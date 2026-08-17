from __future__ import annotations

import argparse
import json
import re
import subprocess
from pathlib import Path
from typing import Any

from PIL import Image


VIDEO_SIZE_PATTERN = re.compile(r"\b(\d{2,5})x(\d{2,5})\b")
DURATION_PATTERN = re.compile(r"Duration: (\d{2}):(\d{2}):(\d{2}\.\d+)")


def media_metadata(ffmpeg: Path, path: Path) -> tuple[int, int, float]:
    result = subprocess.run(
        [str(ffmpeg), "-hide_banner", "-i", str(path)],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    output = result.stderr
    size_match = VIDEO_SIZE_PATTERN.search(output)
    duration_match = DURATION_PATTERN.search(output)
    if not size_match or not duration_match:
        raise RuntimeError(f"Could not read video metadata: {path}")
    hours, minutes, seconds = duration_match.groups()
    duration = int(hours) * 3600 + int(minutes) * 60 + float(seconds)
    return int(size_match.group(1)), int(size_match.group(2)), duration


def main() -> int:
    parser = argparse.ArgumentParser(description="Verify Asset Lab derivative outputs")
    parser.add_argument("--config", required=True, type=Path)
    parser.add_argument("--manifest", required=True, type=Path)
    parser.add_argument("--ffmpeg", required=True, type=Path)
    parser.add_argument("--workspace", required=True, type=Path)
    arguments = parser.parse_args()

    workspace = arguments.workspace.resolve()
    public_root = workspace / "public"
    config = json.loads(arguments.config.read_text(encoding="utf-8"))
    manifest = json.loads(arguments.manifest.read_text(encoding="utf-8"))
    approved_by_id: dict[str, dict[str, Any]] = {
        asset["id"]: asset for asset in config["assets"] if asset["crop"]["approved"]
    }

    if len(manifest["assets"]) != len(approved_by_id):
        raise RuntimeError("Manifest count does not match approved asset count")

    image_count = 0
    video_count = 0
    poster_count = 0
    total_bytes = 0

    for derived in manifest["assets"]:
        configured = approved_by_id[derived["id"]]
        expected_width = configured["output"]["width"]
        expected_height = configured["output"]["height"]
        source = public_root / configured["source"].lstrip("/")
        output = public_root / derived["derived"].lstrip("/")
        if not source.is_file() or not output.is_file():
            raise FileNotFoundError(f"Missing source or derivative for {derived['id']}")
        total_bytes += output.stat().st_size

        if derived["kind"] == "image":
            with Image.open(output) as image:
                if image.size != (expected_width, expected_height):
                    raise RuntimeError(f"Wrong image size: {output} -> {image.size}")
            image_count += 1
            continue

        width, height, duration = media_metadata(arguments.ffmpeg, output)
        if (width, height) != (expected_width, expected_height):
            raise RuntimeError(f"Wrong video size: {output} -> {(width, height)}")
        trim_start = float(configured["crop"].get("trimStart") or 0)
        trim_end = configured["crop"].get("trimEnd")
        if trim_end is not None:
            expected_duration = float(trim_end) - trim_start
            if abs(duration - expected_duration) > 0.25:
                raise RuntimeError(
                    f"Wrong video duration: {output} -> {duration:.2f}, expected {expected_duration:.2f}"
                )
        elif duration <= 0:
            raise RuntimeError(f"Empty video: {output}")
        video_count += 1

        poster_value = derived.get("poster")
        if not poster_value:
            raise RuntimeError(f"Missing poster mapping: {derived['id']}")
        poster = public_root / poster_value.lstrip("/")
        with Image.open(poster) as image:
            if image.size != (expected_width, expected_height):
                raise RuntimeError(f"Wrong poster size: {poster} -> {image.size}")
        total_bytes += poster.stat().st_size
        poster_count += 1

    actual_files = [path for path in (public_root / manifest["outputRoot"].lstrip("/")).rglob("*") if path.is_file()]
    expected_files = image_count + video_count + poster_count
    if len(actual_files) != expected_files:
        raise RuntimeError(f"Unexpected output file count: {len(actual_files)}, expected {expected_files}")

    print(json.dumps({
        "approved": len(approved_by_id),
        "images": image_count,
        "videos": video_count,
        "posters": poster_count,
        "files": len(actual_files),
        "bytes": total_bytes,
    }, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
