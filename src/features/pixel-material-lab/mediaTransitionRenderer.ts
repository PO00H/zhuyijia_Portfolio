export type MediaTransitionMode = 'dither-matrix' | 'ascii-reveal';

export type MediaTransitionPhase =
  | 'quantize'
  | 'resolve'
  | 'rebuild'
  | 'settle';

export interface MediaTransitionSettings {
  width: number;
  height: number;
  levels: number;
  dither: number;
}

export interface MediaFramePair {
  from: ImageData;
  to: ImageData;
}

const OUTPUT_SCALE = 2;
const ASCII_COLUMNS = 64;
const ASCII_ROWS = 36;
const ASCII_RAMP = ' .·:-=+*#%@';

const BAYER_4 = [
  0, 8, 2, 10,
  12, 4, 14, 6,
  3, 11, 1, 9,
  15, 7, 13, 5,
];

const frameCache = new Map<string, Promise<MediaFramePair>>();
const scratchByContext = new WeakMap<CanvasRenderingContext2D, HTMLCanvasElement>();

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const smoothstep = (value: number) => {
  const normalized = clamp(value);
  return normalized * normalized * (3 - 2 * normalized);
};

const mix = (from: number, to: number, amount: number) =>
  Math.round(from + (to - from) * amount);

const loadImage = (source: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load pixel lab media: ${source}`));
    image.src = source;
  });

const imageToFrame = (
  image: HTMLImageElement,
  width: number,
  height: number,
) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { alpha: false });
  if (!context) throw new Error('Pixel lab source canvas is unavailable.');

  const sourceRatio = image.naturalWidth / image.naturalHeight;
  const targetRatio = width / height;
  let sourceX = 0;
  let sourceY = 0;
  let sourceWidth = image.naturalWidth;
  let sourceHeight = image.naturalHeight;

  if (sourceRatio > targetRatio) {
    sourceWidth = image.naturalHeight * targetRatio;
    sourceX = (image.naturalWidth - sourceWidth) / 2;
  } else {
    sourceHeight = image.naturalWidth / targetRatio;
    sourceY = (image.naturalHeight - sourceHeight) / 2;
  }

  context.imageSmoothingEnabled = true;
  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    width,
    height,
  );
  return context.getImageData(0, 0, width, height);
};

export function loadMediaFramePair(
  fromSource: string,
  toSource: string,
  settings: MediaTransitionSettings,
) {
  const key = `${fromSource}|${toSource}|${settings.width}x${settings.height}`;
  const cached = frameCache.get(key);
  if (cached) return cached;

  const request = Promise.all([loadImage(fromSource), loadImage(toSource)]).then(
    ([fromImage, toImage]) => ({
      from: imageToFrame(fromImage, settings.width, settings.height),
      to: imageToFrame(toImage, settings.width, settings.height),
    }),
  );
  frameCache.set(key, request);
  return request;
}

export const getMediaTransitionPhase = (
  progress: number,
): MediaTransitionPhase => {
  if (progress < 0.18) return 'quantize';
  if (progress < 0.46) return 'resolve';
  if (progress < 0.82) return 'rebuild';
  return 'settle';
};

const getScratchCanvas = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
) => {
  const cached = scratchByContext.get(context);
  if (cached && cached.width === width && cached.height === height) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  scratchByContext.set(context, canvas);
  return canvas;
};

const quantizeChannel = (
  channel: number,
  levels: number,
  threshold: number,
  dither: number,
) => {
  const normalized = channel / 255;
  const shifted = clamp(normalized + threshold * dither * (0.72 / levels));
  return Math.round(Math.round(shifted * (levels - 1)) * (255 / (levels - 1)));
};

const resolvePixelSource = (
  x: number,
  y: number,
  progress: number,
  frames: MediaFramePair,
  settings: MediaTransitionSettings,
) => {
  const { width } = settings;
  const pixelOffset = (y * width + x) * 4;
  const matrixShift = Math.floor(progress * 28);
  const shiftedBayer = BAYER_4[
    ((x + matrixShift) % 4) + (((y + Math.floor(matrixShift / 2)) % 4) * 4)
  ] / 15;
  const staticBayer = BAYER_4[(x % 4) + ((y % 4) * 4)] / 15;
  const directional = clamp(
    (x / Math.max(1, width - 1)) * 0.68 + staticBayer * 0.32,
  );
  const handoff = smoothstep((progress - 0.18) / 0.64);
  const source = progress >= 0.18 && directional <= handoff
    ? frames.to
    : frames.from;

  return {
    source,
    pixelOffset,
    threshold: shiftedBayer - 0.5,
    visible: true,
  };
};

const renderDitherLayer = (
  context: CanvasRenderingContext2D,
  frames: MediaFramePair,
  settings: MediaTransitionSettings,
  progress: number,
) => {
  const { width, height, levels, dither } = settings;
  const scratchCanvas = getScratchCanvas(context, width, height);
  const scratchContext = scratchCanvas.getContext('2d', { alpha: false });
  if (!scratchContext) return;

  const frame = scratchContext.createImageData(width, height);
  const quantizeIn = smoothstep(progress / 0.18);
  const quantizeOut = 1 - smoothstep((progress - 0.82) / 0.18);
  const quantizeAmount = progress < 0.18 ? quantizeIn : progress > 0.82 ? quantizeOut : 1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const outputOffset = (y * width + x) * 4;
      const pixel = resolvePixelSource(x, y, progress, frames, settings);

      if (!pixel.visible) {
        frame.data[outputOffset] = 9;
        frame.data[outputOffset + 1] = 10;
        frame.data[outputOffset + 2] = 9;
        frame.data[outputOffset + 3] = 255;
        continue;
      }

      const red = pixel.source.data[pixel.pixelOffset];
      const green = pixel.source.data[pixel.pixelOffset + 1];
      const blue = pixel.source.data[pixel.pixelOffset + 2];
      const quantizedRed = quantizeChannel(red, levels, pixel.threshold, dither);
      const quantizedGreen = quantizeChannel(green, levels, pixel.threshold, dither);
      const quantizedBlue = quantizeChannel(blue, levels, pixel.threshold, dither);

      frame.data[outputOffset] = mix(red, quantizedRed, quantizeAmount);
      frame.data[outputOffset + 1] = mix(green, quantizedGreen, quantizeAmount);
      frame.data[outputOffset + 2] = mix(blue, quantizedBlue, quantizeAmount);
      frame.data[outputOffset + 3] = 255;
    }
  }

  scratchContext.putImageData(frame, 0, 0);
  context.imageSmoothingEnabled = false;
  context.drawImage(scratchCanvas, 0, 0, context.canvas.width, context.canvas.height);
};

const renderAsciiLayer = (
  context: CanvasRenderingContext2D,
  frames: MediaFramePair,
  settings: MediaTransitionSettings,
  progress: number,
) => {
  const asciiIn = smoothstep((progress - 0.18) / 0.16);
  const asciiOut = 1 - smoothstep((progress - 0.68) / 0.14);
  const asciiAmount = clamp(Math.min(asciiIn, asciiOut));
  if (asciiAmount <= 0) return;

  const cellWidth = context.canvas.width / ASCII_COLUMNS;
  const cellHeight = context.canvas.height / ASCII_ROWS;
  context.save();
  context.globalAlpha = asciiAmount * 0.94;
  context.fillStyle = '#090a09';
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  context.textBaseline = 'top';
  context.font = `${Math.ceil(cellHeight)}px "Fusion Pixel 12", monospace`;

  for (let row = 0; row < ASCII_ROWS; row += 1) {
    for (let column = 0; column < ASCII_COLUMNS; column += 1) {
      const sourceX = Math.min(
        settings.width - 1,
        Math.floor(((column + 0.5) / ASCII_COLUMNS) * settings.width),
      );
      const sourceY = Math.min(
        settings.height - 1,
        Math.floor(((row + 0.5) / ASCII_ROWS) * settings.height),
      );
      const pixel = resolvePixelSource(
        sourceX,
        sourceY,
        progress,
        frames,
        settings,
      );
      if (!pixel.visible) continue;

      const red = pixel.source.data[pixel.pixelOffset];
      const green = pixel.source.data[pixel.pixelOffset + 1];
      const blue = pixel.source.data[pixel.pixelOffset + 2];
      const luminance = clamp((red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255);
      const glyph = ASCII_RAMP[Math.round(luminance * (ASCII_RAMP.length - 1))];
      const threshold = pixel.threshold * settings.dither;
      const colorLevel = Math.max(2, settings.levels);
      const glyphRed = quantizeChannel(red, colorLevel, threshold, settings.dither);
      const glyphGreen = quantizeChannel(green, colorLevel, threshold, settings.dither);
      const glyphBlue = quantizeChannel(blue, colorLevel, threshold, settings.dither);

      context.fillStyle = `rgb(${glyphRed} ${glyphGreen} ${glyphBlue})`;
      context.fillText(glyph, column * cellWidth, row * cellHeight);
    }
  }

  context.restore();
};

export function renderMediaTransition(
  context: CanvasRenderingContext2D,
  frames: MediaFramePair,
  settings: MediaTransitionSettings,
  progress: number,
  mode: MediaTransitionMode,
) {
  const outputWidth = settings.width * OUTPUT_SCALE;
  const outputHeight = settings.height * OUTPUT_SCALE;
  if (context.canvas.width !== outputWidth || context.canvas.height !== outputHeight) {
    context.canvas.width = outputWidth;
    context.canvas.height = outputHeight;
  }

  context.imageSmoothingEnabled = false;
  context.fillStyle = '#090a09';
  context.fillRect(0, 0, outputWidth, outputHeight);
  renderDitherLayer(context, frames, settings, clamp(progress));

  if (mode === 'ascii-reveal') {
    renderAsciiLayer(context, frames, settings, clamp(progress));
  }
}
