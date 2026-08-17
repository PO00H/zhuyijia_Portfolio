from __future__ import annotations

import argparse
import hashlib
import json
import math
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Any

from PIL import Image


OUTPUT_VERSION = "asset-lab-v1"
IMAGE_QUALITY = 88


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as file:
        for chunk in iter(lambda: file.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def safe_source(public_root: Path, source: str) -> Path:
    candidate = (public_root / source.lstrip("/")).resolve()
    candidate.relative_to(public_root.resolve())
    if not candidate.is_file():
        raise FileNotFoundError(f"Missing source: {source}")
    return candidate


def normalized_stem(source: str) -> str:
    stem = Path(source).stem
    safe = "".join(character if character.isalnum() or character in "-_" else "-" for character in stem)
    return safe.strip("-") or "asset"


def crop_geometry(
    source_width: int,
    source_height: int,
    output_width: int,
    output_height: int,
    zoom: float,
    position_x: float,
    position_y: float,
) -> tuple[int, int, int, int]:
    base_scale = max(output_width / source_width, output_height / source_height)
    scale = base_scale * zoom
    resized_width = max(output_width, math.ceil(source_width * scale))
    resized_height = max(output_height, math.ceil(source_height * scale))
    left = (resized_width - output_width) / 2 - (position_x / 100) * output_width
    top = (resized_height - output_height) / 2 - (position_y / 100) * output_height
    left = round(max(0, min(resized_width - output_width, left)))
    top = round(max(0, min(resized_height - output_height, top)))
    return resized_width, resized_height, left, top


def process_image(source: Path, destination: Path, output: dict[str, int], crop: dict[str, Any]) -> None:
    with Image.open(source) as image:
        image = image.convert("RGB")
        resized_width, resized_height, left, top = crop_geometry(
            image.width,
            image.height,
            output["width"],
            output["height"],
            float(crop["zoom"]),
            float(crop["positionX"]),
            float(crop["positionY"]),
        )
        image = image.resize((resized_width, resized_height), Image.Resampling.LANCZOS)
        image = image.crop((left, top, left + output["width"], top + output["height"]))
        image.save(destination, "WEBP", quality=IMAGE_QUALITY, method=6)


def ffmpeg_filter(output: dict[str, int], crop: dict[str, Any]) -> str:
    width = output["width"]
    height = output["height"]
    zoom = float(crop["zoom"])
    shift_x = float(crop["positionX"]) / 100 * width
    shift_y = float(crop["positionY"]) / 100 * height
    scale_width = f"ceil(max({width}/iw\\,{height}/ih)*iw*{zoom}/2)*2"
    scale_height = f"ceil(max({width}/iw\\,{height}/ih)*ih*{zoom}/2)*2"
    crop_x = f"max(0\\,min(iw-{width}\\,(iw-{width})/2-{shift_x}))"
    crop_y = f"max(0\\,min(ih-{height}\\,(ih-{height})/2-{shift_y}))"
    return f"scale={scale_width}:{scale_height},crop={width}:{height}:{crop_x}:{crop_y}"


def run_ffmpeg(arguments: list[str]) -> None:
    result = subprocess.run(arguments, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if result.returncode != 0:
        tail = "\n".join(result.stderr.splitlines()[-20:])
        raise RuntimeError(f"FFmpeg failed:\n{tail}")


def process_video(
    ffmpeg: Path,
    source: Path,
    destination: Path,
    poster_destination: Path,
    output: dict[str, int],
    crop: dict[str, Any],
) -> None:
    trim_start = max(0, float(crop.get("trimStart") or 0))
    trim_end_value = crop.get("trimEnd")
    trim_end = float(trim_end_value) if trim_end_value is not None else None
    poster_time = max(0, float(crop.get("posterTime") or trim_start))
    filter_value = ffmpeg_filter(output, crop)

    video_args = [str(ffmpeg), "-hide_banner", "-loglevel", "error", "-y"]
    if trim_start:
        video_args += ["-ss", f"{trim_start:.6f}"]
    video_args += ["-i", str(source)]
    if trim_end is not None and trim_end > trim_start:
        video_args += ["-t", f"{trim_end - trim_start:.6f}"]
    video_args += [
        "-vf", filter_value,
        "-an",
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "23",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        str(destination),
    ]
    run_ffmpeg(video_args)

    poster_args = [
        str(ffmpeg),
        "-hide_banner",
        "-loglevel", "error",
        "-y",
        "-ss", f"{poster_time:.6f}",
        "-i", str(source),
        "-vf", filter_value,
        "-frames:v", "1",
        str(poster_destination),
    ]
    run_ffmpeg(poster_args)


def validate_config(data: dict[str, Any]) -> list[dict[str, Any]]:
    if data.get("version") != 1:
        raise ValueError("Unsupported crop configuration version")
    assets = data.get("assets")
    if not isinstance(assets, list):
        raise ValueError("Missing assets list")
    approved = [asset for asset in assets if asset.get("crop", {}).get("approved")]
    if not approved:
        raise ValueError("No approved assets found")
    for asset in approved:
        crop = asset["crop"]
        if crop.get("ratio") not in {"16:9", "4:3", "1:1"}:
            raise ValueError(f"Unsupported ratio for {asset.get('source')}")
        if float(crop.get("zoom", 0)) < 1:
            raise ValueError(f"Zoom must be at least 1 for {asset.get('source')}")
        if asset.get("kind") not in {"image", "video"}:
            raise ValueError(f"Unsupported asset kind for {asset.get('source')}")
    return approved


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate non-destructive portfolio derivatives")
    parser.add_argument("--config", required=True, type=Path)
    parser.add_argument("--ffmpeg", required=True, type=Path)
    parser.add_argument("--workspace", required=True, type=Path)
    arguments = parser.parse_args()

    workspace = arguments.workspace.resolve()
    public_root = workspace / "public"
    output_root = public_root / "derived" / OUTPUT_VERSION
    manifest_path = workspace / "src" / "data" / "portfolioDerivedAssets.json"

    if output_root.exists():
        raise FileExistsError(f"Output already exists; refusing to overwrite: {output_root}")
    if not arguments.ffmpeg.is_file():
        raise FileNotFoundError(f"FFmpeg not found: {arguments.ffmpeg}")

    data = json.loads(arguments.config.read_text(encoding="utf-8"))
    assets = validate_config(data)
    source_hashes: dict[str, str] = {}
    derived_assets: list[dict[str, Any]] = []
    staging_root = public_root / "derived" / f".{OUTPUT_VERSION}-staging"
    if staging_root.exists():
        shutil.rmtree(staging_root)
    staging_root.mkdir(parents=True)

    try:
        for index, asset in enumerate(assets, start=1):
            source = safe_source(public_root, asset["source"])
            source_hashes[asset["source"]] = sha256(source)
            project_directory = staging_root / asset["projectId"]
            project_directory.mkdir(parents=True, exist_ok=True)
            stem = normalized_stem(asset["source"])
            output = asset["output"]
            crop = asset["crop"]

            if asset["kind"] == "image":
                destination = project_directory / f"{stem}-crop.webp"
                process_image(source, destination, output, crop)
                poster_destination = None
            else:
                destination = project_directory / f"{stem}-crop.mp4"
                poster_destination = project_directory / f"{stem}-poster.webp"
                process_video(arguments.ffmpeg, source, destination, poster_destination, output, crop)

            relative_destination = destination.relative_to(public_root).as_posix()
            relative_poster = (
                poster_destination.relative_to(public_root).as_posix()
                if poster_destination is not None
                else None
            )
            derived_assets.append({
                "id": asset["id"],
                "projectId": asset["projectId"],
                "source": asset["source"],
                "kind": asset["kind"],
                "ratio": crop["ratio"],
                "width": output["width"],
                "height": output["height"],
                "derived": f"/{relative_destination.replace(f'.{OUTPUT_VERSION}-staging', OUTPUT_VERSION)}",
                "poster": (
                    f"/{relative_poster.replace(f'.{OUTPUT_VERSION}-staging', OUTPUT_VERSION)}"
                    if relative_poster
                    else None
                ),
            })
            print(f"[{index:02d}/{len(assets):02d}] {asset['kind']:5s} {asset['source']}", flush=True)

        for source_path, original_hash in source_hashes.items():
            if sha256(safe_source(public_root, source_path)) != original_hash:
                raise RuntimeError(f"Source changed during processing: {source_path}")

        output_root.parent.mkdir(parents=True, exist_ok=True)
        shutil.copytree(staging_root, output_root)
        shutil.rmtree(staging_root)
        manifest = {
            "version": 1,
            "sourceConfigExportedAt": data.get("exportedAt"),
            "outputRoot": f"/derived/{OUTPUT_VERSION}",
            "assets": derived_assets,
        }
        manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    except Exception:
        if staging_root.exists():
            shutil.rmtree(staging_root)
        if output_root.exists():
            shutil.rmtree(output_root)
        raise

    print(f"Generated {len(derived_assets)} approved assets in {output_root}", flush=True)
    print(f"Manifest: {manifest_path}", flush=True)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f"ERROR: {error}", file=sys.stderr)
        raise
