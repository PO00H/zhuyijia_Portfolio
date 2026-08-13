export type AsciiVariant = 'characters' | 'blocks' | 'dither';
export type PointerMode = 'luminance' | 'flow' | 'repel';

export interface AsciiPalette {
  id: 'warm' | 'cool' | 'violet';
  label: string;
  background: string;
  base: string;
  highlight: string;
  event: string;
  muted: string;
}

export interface AsciiSourceField {
  columns: number;
  rows: number;
  luminance: Float32Array;
  edges: Float32Array;
}

export interface AsciiRenderSettings {
  variant: AsciiVariant;
  palette: AsciiPalette;
  glyphRamp: string;
  contrast: number;
  edge: number;
  density: number;
}

export interface AsciiRenderState {
  spreadProgress: number | null;
  spreadOrigin: { x: number; y: number };
  pointer: {
    active: boolean;
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    strength: number;
    radius: number;
    mode: PointerMode;
  };
}

export const ASCII_PALETTES: AsciiPalette[] = [
  {
    id: 'warm',
    label: '暖琥珀',
    background: '#0b0907',
    base: '#a9844f',
    highlight: '#d5b77f',
    event: '#77658f',
    muted: '#564630',
  },
  {
    id: 'cool',
    label: '冷青灰',
    background: '#07100f',
    base: '#5f8781',
    highlight: '#9bb8b0',
    event: '#a77a55',
    muted: '#344d49',
  },
  {
    id: 'violet',
    label: '灰紫',
    background: '#0d0a10',
    base: '#796a8d',
    highlight: '#b2a3bf',
    event: '#a78658',
    muted: '#483e52',
  },
];

const BAYER_4 = [
  0, 8, 2, 10,
  12, 4, 14, 6,
  3, 11, 1, 9,
  15, 7, 13, 5,
];

const sourceCache = new Map<string, Promise<AsciiSourceField>>();

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

const smoothstep = (value: number) => {
  const amount = clamp(value);
  return amount * amount * (3 - 2 * amount);
};

const hash = (x: number, y: number) => {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

const loadImage = (source: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load ASCII source: ${source}`));
    image.src = source;
  });

const cropImageToField = (
  image: HTMLImageElement,
  columns: number,
  rows: number,
  visualRatio: number,
) => {
  const canvas = document.createElement('canvas');
  canvas.width = columns;
  canvas.height = rows;
  const context = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
  if (!context) throw new Error('ASCII source canvas is unavailable.');

  const sourceRatio = image.naturalWidth / image.naturalHeight;
  const targetRatio = visualRatio;
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
    columns,
    rows,
  );

  return context.getImageData(0, 0, columns, rows);
};

const buildSourceField = (
  pixels: ImageData,
  columns: number,
  rows: number,
): AsciiSourceField => {
  const luminance = new Float32Array(columns * rows);
  const edges = new Float32Array(columns * rows);

  for (let index = 0; index < luminance.length; index += 1) {
    const pixel = index * 4;
    luminance[index] = (
      pixels.data[pixel] * 0.2126
      + pixels.data[pixel + 1] * 0.7152
      + pixels.data[pixel + 2] * 0.0722
    ) / 255;
  }

  const sample = (x: number, y: number) => {
    const sampleX = Math.max(0, Math.min(columns - 1, x));
    const sampleY = Math.max(0, Math.min(rows - 1, y));
    return luminance[sampleY * columns + sampleX];
  };

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      const gradientX =
        -sample(x - 1, y - 1) + sample(x + 1, y - 1)
        - 2 * sample(x - 1, y) + 2 * sample(x + 1, y)
        - sample(x - 1, y + 1) + sample(x + 1, y + 1);
      const gradientY =
        -sample(x - 1, y - 1) - 2 * sample(x, y - 1) - sample(x + 1, y - 1)
        + sample(x - 1, y + 1) + 2 * sample(x, y + 1) + sample(x + 1, y + 1);
      edges[y * columns + x] = clamp(Math.hypot(gradientX, gradientY) * 0.75);
    }
  }

  return { columns, rows, luminance, edges };
};

export function loadAsciiSource(
  source: string,
  columns: number,
  rows: number,
  visualRatio = columns / rows,
) {
  const key = `${source}|${columns}x${rows}|${visualRatio.toFixed(3)}`;
  const cached = sourceCache.get(key);
  if (cached) return cached;

  const request = loadImage(source).then((image) =>
    buildSourceField(cropImageToField(image, columns, rows, visualRatio), columns, rows),
  );
  sourceCache.set(key, request);
  return request;
}

const hexToRgb = (hex: string) => ({
  r: Number.parseInt(hex.slice(1, 3), 16),
  g: Number.parseInt(hex.slice(3, 5), 16),
  b: Number.parseInt(hex.slice(5, 7), 16),
});

const mixColor = (from: string, to: string, amount: number) => {
  const start = hexToRgb(from);
  const end = hexToRgb(to);
  const progress = clamp(amount);
  return `rgb(${Math.round(start.r + (end.r - start.r) * progress)} ${Math.round(start.g + (end.g - start.g) * progress)} ${Math.round(start.b + (end.b - start.b) * progress)})`;
};

const getSpreadState = (
  x: number,
  y: number,
  progress: number | null,
  origin: { x: number; y: number },
) => {
  if (progress === null) return { revealed: 1, front: 0 };
  const eased = 1 - Math.pow(1 - clamp(progress), 3);
  const distance = Math.hypot(x - origin.x, y - origin.y);
  const maximumDistance = Math.max(
    Math.hypot(origin.x, origin.y),
    Math.hypot(1 - origin.x, origin.y),
    Math.hypot(origin.x, 1 - origin.y),
    Math.hypot(1 - origin.x, 1 - origin.y),
  );
  const noise = (hash(Math.floor(x * 401), Math.floor(y * 397)) - 0.5) * 0.13;
  const threshold = eased * (maximumDistance + 0.12) + noise;
  const signedDistance = threshold - distance;
  return {
    revealed: smoothstep((signedDistance + 0.035) / 0.08),
    front: 1 - smoothstep(Math.abs(signedDistance) / 0.075),
  };
};

const getFlowCharacter = (velocityX: number, velocityY: number) => {
  const angle = Math.atan2(velocityY, velocityX);
  const direction = Math.round(((angle + Math.PI) / (Math.PI * 2)) * 8) % 8;
  return ['-', '/', '|', '\\', '-', '/', '|', '\\'][direction];
};

export function renderAsciiField(
  context: CanvasRenderingContext2D,
  field: AsciiSourceField,
  settings: AsciiRenderSettings,
  state: AsciiRenderState,
) {
  const width = context.canvas.width;
  const height = context.canvas.height;
  const cellWidth = width / field.columns;
  const cellHeight = height / field.rows;
  const ramp = settings.variant === 'blocks'
    ? ' ░▒▓█'
    : (settings.glyphRamp || ' .,:;i1tfLCG08@');
  const fontSize = Math.max(5, Math.ceil(cellHeight * 1.02));

  context.save();
  context.fillStyle = settings.palette.background;
  context.fillRect(0, 0, width, height);
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = `${fontSize}px Consolas, "Courier New", monospace`;

  for (let row = 0; row < field.rows; row += 1) {
    for (let column = 0; column < field.columns; column += 1) {
      const index = row * field.columns + column;
      const normalizedX = (column + 0.5) / field.columns;
      const normalizedY = (row + 0.5) / field.rows;
      const spread = getSpreadState(
        normalizedX,
        normalizedY,
        state.spreadProgress,
        state.spreadOrigin,
      );

      let value = clamp(
        (field.luminance[index] - 0.5) * settings.contrast + 0.5
        + field.edges[index] * settings.edge,
      );
      const pointerX = state.pointer.x * width;
      const pointerY = state.pointer.y * height;
      const cellX = (column + 0.5) * cellWidth;
      const cellY = (row + 0.5) * cellHeight;
      const pointerDistance = Math.hypot(cellX - pointerX, cellY - pointerY);
      const pointerAmount = state.pointer.active
        ? clamp(1 - pointerDistance / state.pointer.radius) * state.pointer.strength
        : 0;

      if (state.pointer.mode === 'luminance') value = clamp(value + pointerAmount * 0.42);
      const densityThreshold = (1 - settings.density) * 0.58;
      const visibleValue = clamp((value - densityThreshold) / Math.max(0.001, 1 - densityThreshold));
      const revealedValue = visibleValue * (0.12 + spread.revealed * 0.88);
      const displayValue = Math.max(revealedValue, spread.front * 0.72);

      if (settings.variant === 'dither') {
        const threshold = BAYER_4[(column % 4) + (row % 4) * 4] / 15;
        if (displayValue <= threshold * 0.86) continue;
        const color = spread.front > 0.12
          ? mixColor(settings.palette.base, settings.palette.event, spread.front)
          : mixColor(settings.palette.muted, settings.palette.highlight, displayValue);
        context.globalAlpha = 0.2 + displayValue * 0.8;
        context.fillStyle = color;
        context.fillRect(
          Math.floor(column * cellWidth),
          Math.floor(row * cellHeight),
          Math.ceil(cellWidth + 0.25),
          Math.ceil(cellHeight + 0.25),
        );
        continue;
      }

      const rampIndex = Math.min(ramp.length - 1, Math.floor(displayValue * ramp.length));
      let glyph = ramp[rampIndex] ?? ramp[ramp.length - 1];
      if (!glyph || glyph === ' ') continue;
      if (state.pointer.mode === 'flow' && pointerAmount > 0.12) {
        glyph = getFlowCharacter(state.pointer.velocityX, state.pointer.velocityY);
      }

      let offsetX = 0;
      let offsetY = 0;
      if (state.pointer.mode === 'repel' && pointerAmount > 0) {
        const directionX = (cellX - pointerX) / Math.max(1, pointerDistance);
        const directionY = (cellY - pointerY) / Math.max(1, pointerDistance);
        offsetX = directionX * pointerAmount * 2.2;
        offsetY = directionY * pointerAmount * 2.2;
      }

      const color = spread.front > 0.08
        ? mixColor(settings.palette.base, settings.palette.event, spread.front)
        : mixColor(settings.palette.muted, settings.palette.highlight, displayValue);
      context.globalAlpha = 0.2 + displayValue * 0.8;
      context.fillStyle = color;
      context.fillText(glyph, cellX + offsetX, cellY + offsetY);
    }
  }

  context.restore();
}
