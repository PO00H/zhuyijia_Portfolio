interface VerticalBreathingFrame {
  width: number;
  height: number;
  elapsedSeconds: number;
  compact: boolean;
  settings: MotionStudySettings;
  dotEventProgress: number | null;
  dotEventOrigin: { x: number; y: number };
  dotEventIntensity?: number;
  dotEventMode?: 'cell' | 'wave';
}

export type GeometryMode = 'flat' | 'shallow' | 'inset' | 'saddle' | 'twist';
export type MotionDirection =
  | 'top-to-bottom'
  | 'bottom-to-top'
  | 'left-to-right'
  | 'right-to-left'
  | 'top-left-to-bottom-right'
  | 'top-right-to-bottom-left';

export interface MotionStudyPalette {
  paper: string;
  coral: string;
  cyan: string;
}

export interface MotionStudySettings {
  geometry: GeometryMode;
  density: number;
  fisheye: number;
  direction: MotionDirection;
  palette: MotionStudyPalette;
}

export const DEFAULT_MOTION_STUDY_SETTINGS: MotionStudySettings = {
  geometry: 'flat',
  density: 1.05,
  fisheye: 0.08,
  direction: 'top-right-to-bottom-left',
  palette: {
    paper: '#e0e0e0',
    coral: '#28b6c3',
    cyan: '#2d929b',
  },
};

const FALLBACK_COLORS = {
  paper: '#fafbf8',
  coral: '#ee8f89',
  cyan: '#2d929b',
} as const;

const GEOMETRY = {
  flat: { pinch: 1, curve: 0, curveFalloff: 0, twist: 0 },
  shallow: { pinch: 0.9, curve: 0.018, curveFalloff: 0.008, twist: 0 },
  inset: { pinch: 0.74, curve: 0.028, curveFalloff: 0.018, twist: 0 },
  saddle: { pinch: 0.84, curve: -0.018, curveFalloff: -0.012, twist: 0 },
  twist: { pinch: 0.84, curve: 0.018, curveFalloff: 0.012, twist: 0.055 },
} as const;

const BAYER_8 = [
  0, 48, 12, 60, 3, 51, 15, 63,
  32, 16, 44, 28, 35, 19, 47, 31,
  8, 56, 4, 52, 11, 59, 7, 55,
  40, 24, 36, 20, 43, 27, 39, 23,
  2, 50, 14, 62, 1, 49, 13, 61,
  34, 18, 46, 30, 33, 17, 45, 29,
  10, 58, 6, 54, 9, 57, 5, 53,
  42, 26, 38, 22, 41, 25, 37, 21,
] as const;

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp01((value - edge0) / Math.max(0.0001, edge1 - edge0));
  return t * t * (3 - 2 * t);
};

const parseHex = (value: string) => {
  const normalized = /^#[0-9a-f]{6}$/i.test(value) ? value : FALLBACK_COLORS.paper;
  return [1, 3, 5].map((start) => Number.parseInt(normalized.slice(start, start + 2), 16));
};

const mixHex = (from: string, to: string, amount: number) => {
  const a = parseHex(from);
  const b = parseHex(to);
  const mixed = a.map((channel, index) => Math.round(channel + (b[index] - channel) * amount));
  return `#${mixed.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
};

const getDirectionCoordinate = (
  direction: MotionDirection,
  horizontal: number,
  vertical: number,
) => {
  switch (direction) {
    case 'bottom-to-top': return -vertical;
    case 'left-to-right': return horizontal;
    case 'right-to-left': return -horizontal;
    case 'top-left-to-bottom-right': return (horizontal + vertical) * Math.SQRT1_2;
    case 'top-right-to-bottom-left': return (-horizontal + vertical) * Math.SQRT1_2;
    default: return vertical;
  }
};

const drawCell = (
  path: Path2D,
  x: number,
  y: number,
  cell: number,
  amount: number,
  phaseOffset: number,
) => {
  const strength = clamp01(amount);
  if (strength < 0.025) return;

  const size = cell * (0.2 + strength * 0.48);
  const pulse = 0.95 + 0.05 * Math.sin(phaseOffset);
  const side = Math.max(0.65, size * pulse);
  path.rect(x - side * 0.5, y - side * 0.5, side, side);
};

const hashCell = (column: number, row: number) => {
  const value = Math.sin(column * 127.1 + row * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

const drawBloomCell = (
  path: Path2D,
  x: number,
  y: number,
  cell: number,
  amount: number,
  phaseOffset: number,
  eventAmount: number,
  targetScale: number,
) => {
  const strength = clamp01(amount);
  const pulse = 0.95 + 0.05 * Math.sin(phaseOffset);
  const sourceSide = Math.max(0.65, cell * (0.2 + strength * 0.48) * pulse);
  const targetSide = cell * targetScale;
  const side = sourceSide + (targetSide - sourceSide) * eventAmount;
  path.rect(x - side * 0.5, y - side * 0.5, side, side);
};

export function renderVerticalBreathingFrame(
  context: CanvasRenderingContext2D,
  frame: VerticalBreathingFrame,
) {
  const {
    width,
    height,
    elapsedSeconds,
    compact,
    settings,
    dotEventProgress,
    dotEventOrigin,
    dotEventIntensity = 1,
    dotEventMode = 'cell',
  } = frame;
  const palette = settings.palette;
  const coralLight = mixHex(palette.coral, palette.paper, 0.38);
  const cyanLight = mixHex(palette.cyan, palette.paper, 0.34);
  const cyanDeep = mixHex(palette.cyan, '#000000', 0.12);
  const geometry = GEOMETRY[settings.geometry];
  const shorterSide = Math.min(width, height);
  const density = Math.max(0.65, Math.min(1.5, settings.density));
  const cell = Math.max(compact ? 3.4 : 2.8, shorterSide / (compact ? 96 : 230)) / density;
  const columns = Math.ceil((width / cell) * 1.34);
  const rows = Math.ceil((height / cell) * 1.2);
  const phase = (elapsedSeconds / 4.2) * Math.PI * 2;
  const exchange = Math.cos(phase);
  const transfer = Math.sin(phase);
  const inhale = (1 - Math.cos(phase * 2)) * 0.5;
  const aspect = width / Math.max(1, height);

  context.save();
  context.fillStyle = palette.paper;
  context.fillRect(0, 0, width, height);

  const coralPath = new Path2D();
  const coralLightPath = new Path2D();
  const cyanPath = new Path2D();
  const cyanDeepPath = new Path2D();

  for (let row = -1; row < rows; row += 1) {
    for (let column = -1; column < columns; column += 1) {
      const sourceU = ((column + 0.5) / columns - 0.5) * 2.72;
      const sourceV = ((row + 0.5) / rows - 0.5) * 2.38;
      const lensX = sourceU / 1.36;
      const lensY = sourceV / 1.19;
      const lensRadius = Math.min(1.7, lensX * lensX + lensY * lensY);
      const lensScale = 1
        - Math.max(0, Math.min(0.18, settings.fisheye)) * lensRadius * 0.45;
      const u = sourceU * lensScale;
      const v = sourceV * lensScale;
      const absoluteV = Math.min(1, Math.abs(v));
      const pinchScale = geometry.pinch
        + smoothstep(0.02, 1, absoluteV) * (1 - geometry.pinch);
      const localX = u * width * 0.5 * pinchScale;
      const arcLift = -v
        * u * u
        * height
        * (geometry.curve + (1 - absoluteV) * geometry.curveFalloff);
      const localY = v * height * 0.46 + arcLift;
      const twist = geometry.twist * Math.sin(phase) * (1 - absoluteV);
      const cosTwist = Math.cos(twist);
      const sinTwist = Math.sin(twist);
      const x = width * 0.5 + localX * cosTwist - localY * sinTwist;
      const y = height * 0.5 + localX * sinTwist + localY * cosTwist;
      if (x < -cell || x > width + cell || y < -cell || y > height + cell) continue;

      const nx = u * 0.48;
      const ny = v * 0.42;
      const radialX = nx * Math.min(1.35, aspect * 0.82);
      const arch = (Math.pow(Math.abs(radialX), 1.72) - 0.08) * (0.16 + inhale * 0.07);
      const bowedY = ny + arch * (0.72 + Math.abs(exchange) * 0.28);
      const directionCoordinate = getDirectionCoordinate(settings.direction, nx, bowedY);
      const eventProgress = dotEventProgress ?? 0;
      const eventX = dotEventOrigin.x;
      const eventY = dotEventOrigin.y;
      const normalizedX = x / width;
      const normalizedY = y / height;
      const eventDistance = Math.hypot(
        (normalizedX - eventX) * aspect,
        normalizedY - eventY,
      );
      let waveAmount = 0;
      let waveWake = 0;

      if (dotEventMode === 'wave' && dotEventProgress !== null) {
        const easedProgress = 1 - Math.pow(1 - eventProgress, 3);
        const waveRadius = 0.015 + easedProgress * 0.78 * Math.min(1.25, dotEventIntensity);
        const waveWidth = 0.075 + eventProgress * 0.045;
        const eventEnvelope = smoothstep(0, 0.1, eventProgress)
          * (1 - smoothstep(0.68, 1, eventProgress));
        const waveOffset = (eventDistance - waveRadius) / waveWidth;
        const wakeOffset = (eventDistance - (waveRadius - 0.14)) / (waveWidth * 1.55);
        waveAmount = Math.exp(-(waveOffset * waveOffset)) * eventEnvelope;
        waveWake = Math.exp(-(wakeOffset * wakeOffset)) * eventEnvelope * 0.32;
      }

      const signedColorBase = exchange * 0.88
        - transfer * directionCoordinate * 2.18;
      const waveDirection = transfer >= 0 ? 1 : -1;
      const signedColor = signedColorBase
        + (waveAmount - waveWake) * 0.62 * waveDirection;

      const coverageThreshold = (BAYER_8[(row & 7) * 8 + (column & 7)] + 0.5) / 64;
      const colorThreshold = (BAYER_8[((row + 3) & 7) * 8 + ((column + 5) & 7)] + 0.5) / 64;
      const microPhase = phase + column * 0.17 - row * 0.11;
      const fieldStrength = smoothstep(0.025, 0.92, Math.abs(signedColor));
      const coverage = Math.min(1, 0.28 + fieldStrength * 0.66 + waveAmount * 0.24 - waveWake * 0.06);
      if (coverage <= coverageThreshold) continue;

      const coralShare = smoothstep(-0.24, 0.24, signedColor);
      const isCoral = coralShare > colorThreshold;
      const cellStrength = Math.min(1, 0.42 + fieldStrength * 0.58 + waveAmount * 0.16);
      const projectedCell = cell * (0.78 + pinchScale * 0.22) * (1 + waveAmount * 0.08);
      const eventEnvelope = dotEventProgress === null
        ? 0
        : eventProgress < 0.364
          ? smoothstep(0, 0.364, eventProgress)
          : eventProgress < 0.473
            ? 1
            : 1 - smoothstep(0.473, 1, eventProgress);
      const cellEventDistance = Math.hypot(
        (normalizedX - eventX) / (0.18 * Math.min(1.35, dotEventIntensity)),
        (normalizedY - eventY) / (0.22 * Math.min(1.35, dotEventIntensity)),
      );
      const selectionSeed = hashCell(column, row);
      const sizeSeed = hashCell(column + 37, row - 29);
      const irregularEdge = Math.sin(column * 0.31 + row * 0.17) * 0.07;
      const eventCell = dotEventMode === 'cell'
        && dotEventProgress !== null
        && cellEventDistance + irregularEdge < 1
        && selectionSeed > 0.905 - Math.max(0, dotEventIntensity - 1) * 0.1 + cellEventDistance * 0.045;

      if (eventCell) {
        const targetScale = sizeSeed > 0.88
          ? 1
          : sizeSeed > 0.38
            ? 0.72
            : 0.28;
        const targetPath = isCoral
          ? coralShare > 0.68 ? coralPath : coralLightPath
          : coralShare < 0.32 ? cyanDeepPath : cyanPath;
        drawBloomCell(
          targetPath,
          x,
          y,
          projectedCell,
          cellStrength,
          microPhase,
          eventEnvelope,
          targetScale,
        );
      } else if (isCoral) {
        drawCell(coralShare > 0.68 ? coralPath : coralLightPath, x, y, projectedCell, cellStrength, microPhase);
      } else {
        drawCell(coralShare < 0.32 ? cyanDeepPath : cyanPath, x, y, projectedCell, cellStrength, microPhase);
      }
    }
  }

  context.fillStyle = coralLight;
  context.fill(coralLightPath);
  context.fillStyle = palette.coral;
  context.fill(coralPath);
  context.fillStyle = cyanLight;
  context.fill(cyanPath);
  context.fillStyle = cyanDeep;
  context.fill(cyanDeepPath);
  context.restore();
}
