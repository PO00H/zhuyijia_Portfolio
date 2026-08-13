export type PixelScene = 0 | 1;

export interface PixelRenderSettings {
  width: number;
  height: number;
  levels: number;
  dither: number;
}

interface SignalShape {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  rotation: number;
  hole: number;
  lightOffset: number;
}

const PALETTE = ['#090a09', '#252b12', '#48540f', '#81951c', '#d8ff32', '#f1f2ed'];

const BAYER_4 = [
  0, 8, 2, 10,
  12, 4, 14, 6,
  3, 11, 1, 9,
  15, 7, 13, 5,
];

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const easeInOutCubic = (value: number) =>
  value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;

const hash = (x: number, y: number) => {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

const hexToRgb = (hex: string) => ({
  r: Number.parseInt(hex.slice(1, 3), 16),
  g: Number.parseInt(hex.slice(3, 5), 16),
  b: Number.parseInt(hex.slice(5, 7), 16),
});

const PALETTE_RGB = PALETTE.map(hexToRgb);

const createScene = (scene: PixelScene, time: number): SignalShape[] => {
  if (scene === 0) {
    return [
      {
        x: 0.26 + Math.sin(time * 0.58) * 0.018,
        y: 0.28 + Math.cos(time * 0.43) * 0.02,
        radiusX: 0.13,
        radiusY: 0.19,
        rotation: -0.42 + Math.sin(time * 0.3) * 0.08,
        hole: 0,
        lightOffset: 0.08,
      },
      {
        x: 0.56 + Math.cos(time * 0.47) * 0.018,
        y: 0.25 + Math.sin(time * 0.36) * 0.014,
        radiusX: 0.11,
        radiusY: 0.16,
        rotation: 0.18 + Math.sin(time * 0.4) * 0.1,
        hole: 0.5,
        lightOffset: -0.04,
      },
      {
        x: 0.77 + Math.sin(time * 0.39) * 0.015,
        y: 0.39 + Math.cos(time * 0.5) * 0.018,
        radiusX: 0.15,
        radiusY: 0.075,
        rotation: -0.62 + Math.sin(time * 0.33) * 0.12,
        hole: 0.56,
        lightOffset: 0.12,
      },
      {
        x: 0.39 + Math.cos(time * 0.44) * 0.02,
        y: 0.71 + Math.sin(time * 0.31) * 0.018,
        radiusX: 0.16,
        radiusY: 0.1,
        rotation: 0.48 + Math.cos(time * 0.35) * 0.1,
        hole: 0.48,
        lightOffset: -0.08,
      },
      {
        x: 0.69 + Math.sin(time * 0.51) * 0.018,
        y: 0.7 + Math.cos(time * 0.42) * 0.016,
        radiusX: 0.12,
        radiusY: 0.17,
        rotation: -0.2 + Math.sin(time * 0.28) * 0.08,
        hole: 0,
        lightOffset: 0.03,
      },
    ];
  }

  return [
    {
      x: 0.22 + Math.cos(time * 0.42) * 0.02,
      y: 0.53 + Math.sin(time * 0.35) * 0.018,
      radiusX: 0.12,
      radiusY: 0.17,
      rotation: 0.34 + Math.sin(time * 0.29) * 0.08,
      hole: 0.5,
      lightOffset: -0.03,
    },
    {
      x: 0.47 + Math.sin(time * 0.38) * 0.016,
      y: 0.27 + Math.cos(time * 0.46) * 0.018,
      radiusX: 0.17,
      radiusY: 0.095,
      rotation: -0.28 + Math.cos(time * 0.31) * 0.12,
      hole: 0.55,
      lightOffset: 0.11,
    },
    {
      x: 0.76 + Math.cos(time * 0.5) * 0.018,
      y: 0.27 + Math.sin(time * 0.34) * 0.02,
      radiusX: 0.1,
      radiusY: 0.16,
      rotation: -0.48 + Math.sin(time * 0.41) * 0.08,
      hole: 0,
      lightOffset: 0.04,
    },
    {
      x: 0.44 + Math.cos(time * 0.36) * 0.02,
      y: 0.73 + Math.sin(time * 0.48) * 0.015,
      radiusX: 0.12,
      radiusY: 0.18,
      rotation: 0.08 + Math.sin(time * 0.38) * 0.08,
      hole: 0,
      lightOffset: -0.06,
    },
    {
      x: 0.72 + Math.sin(time * 0.44) * 0.018,
      y: 0.69 + Math.cos(time * 0.37) * 0.018,
      radiusX: 0.17,
      radiusY: 0.09,
      rotation: 0.54 + Math.cos(time * 0.3) * 0.1,
      hole: 0.52,
      lightOffset: 0.08,
    },
  ];
};

const sampleShape = (x: number, y: number, shape: SignalShape, time: number) => {
  const cosine = Math.cos(shape.rotation);
  const sine = Math.sin(shape.rotation);
  const localX = ((x - shape.x) * cosine + (y - shape.y) * sine) / shape.radiusX;
  const localY = (-(x - shape.x) * sine + (y - shape.y) * cosine) / shape.radiusY;
  const distanceSquared = localX * localX + localY * localY;

  if (distanceSquared > 1) return -1;
  if (shape.hole > 0 && distanceSquared < shape.hole * shape.hole) return -1;

  const edge = shape.hole > 0
    ? clamp((1 - distanceSquared) * 3.2) * clamp((distanceSquared - shape.hole * shape.hole) * 5.2)
    : clamp((1 - distanceSquared) * 2.4);
  const normalZ = Math.sqrt(clamp(1 - distanceSquared));
  const lightX = -0.58 + Math.sin(time * 0.22 + shape.lightOffset) * 0.12;
  const lightY = -0.42 + Math.cos(time * 0.19 + shape.lightOffset) * 0.08;
  const diffuse = clamp(localX * lightX + localY * lightY + normalZ * 0.9);
  const rim = Math.pow(1 - normalZ, 2.2) * 0.72;
  const band = Math.sin((localX * 0.7 - localY * 0.4 + time * 0.08) * Math.PI) * 0.05;

  return clamp(0.1 + diffuse * 0.72 + rim + band) * edge;
};

const sampleScene = (x: number, y: number, scene: PixelScene, time: number) => {
  const shapes = createScene(scene, time);
  let value = -1;
  for (const shape of shapes) {
    value = Math.max(value, sampleShape(x, y, shape, time));
  }
  return value;
};

const resolveSignal = (
  x: number,
  y: number,
  time: number,
  scene: PixelScene,
  transitionProgress: number | null,
) => {
  const current = sampleScene(x, y, scene, time);
  if (transitionProgress === null) return current;

  const eased = easeInOutCubic(clamp(transitionProgress));
  const nextScene: PixelScene = scene === 0 ? 1 : 0;
  const next = sampleScene(x, y, nextScene, time + 0.65);
  const noise = hash(Math.floor(x * 997), Math.floor(y * 991));

  if (eased < 0.5) {
    const visibility = 1 - eased * 2;
    return noise < visibility ? current : -1;
  }

  const visibility = (eased - 0.5) * 2;
  return noise < visibility ? next : -1;
};

export function renderPixelMaterial(
  context: CanvasRenderingContext2D,
  settings: PixelRenderSettings,
  time: number,
  scene: PixelScene,
  transitionProgress: number | null,
) {
  const { width, height, levels, dither } = settings;
  if (context.canvas.width !== width || context.canvas.height !== height) {
    context.canvas.width = width;
    context.canvas.height = height;
  }
  context.imageSmoothingEnabled = false;

  const frame = context.createImageData(width, height);
  const colorCount = Math.max(3, Math.min(PALETTE_RGB.length, levels));
  const colors = Array.from({ length: colorCount }, (_, index) =>
    PALETTE_RGB[Math.round((index / (colorCount - 1)) * (PALETTE_RGB.length - 1))],
  );

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const normalizedX = x / Math.max(1, width - 1);
      const normalizedY = y / Math.max(1, height - 1);
      const signal = resolveSignal(normalizedX, normalizedY, time, scene, transitionProgress);
      const pixelIndex = (y * width + x) * 4;
      let color = colors[0];

      if (signal >= 0) {
        const threshold = BAYER_4[(x % 4) + (y % 4) * 4] / 15 - 0.5;
        const quantized = clamp(signal + threshold * dither * 0.34);
        const colorIndex = Math.round(quantized * (colors.length - 1));
        color = colors[colorIndex];
      }

      frame.data[pixelIndex] = color.r;
      frame.data[pixelIndex + 1] = color.g;
      frame.data[pixelIndex + 2] = color.b;
      frame.data[pixelIndex + 3] = 255;
    }
  }

  context.putImageData(frame, 0, 0);
}

export function renderDitherStudy(
  context: CanvasRenderingContext2D,
  settings: PixelRenderSettings,
) {
  renderPixelMaterial(context, settings, 1.4, 0, null);
}
