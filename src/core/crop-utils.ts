export interface CropBoxLayout {
  left: number;
  top: number;
  scaledW: number;
  scaledH: number;
  slackX: number;
  slackY: number;
}

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function normalizeAngleDeg(deg: number): number {
  let a = ((deg % 360) + 360) % 360;
  if (a > 180) a -= 360;
  return Math.round(a);
}

/**
 * Computes exact pixel geometry of a cropped/zoomed/panned image inside a frame of (frameW, frameH).
 */
export function computeCropBoxLayout(
  frameW: number,
  frameH: number,
  natW: number,
  natH: number,
  objectFit: 'cover' | 'contain',
  cropX = 50,
  cropY = 50,
  cropZoom = 1
): CropBoxLayout {
  const safeNatW = Math.max(1, natW);
  const safeNatH = Math.max(1, natH);
  const baseScale =
    objectFit === 'cover'
      ? Math.max(frameW / safeNatW, frameH / safeNatH)
      : Math.min(frameW / safeNatW, frameH / safeNatH);

  const zoom = clamp(cropZoom || 1, 1, 4);
  const scaledW = safeNatW * baseScale * zoom;
  const scaledH = safeNatH * baseScale * zoom;
  const slackX = frameW - scaledW;
  const slackY = frameH - scaledH;

  const left = slackX * (clamp(cropX, 0, 100) / 100);
  const top = slackY * (clamp(cropY, 0, 100) / 100);

  return { left, top, scaledW, scaledH, slackX, slackY };
}

/**
 * Checks if a canvas-space point (px, py) lies inside a possibly-rotated element bounding box.
 */
export function isPointInElement(
  px: number,
  py: number,
  el: { x: number; y: number; width: number; height: number; rotation?: number },
  padding = 0
): boolean {
  const cx = el.x + el.width / 2;
  const cy = el.y + el.height / 2;
  const rad = -((el.rotation || 0) * Math.PI) / 180;
  const dx = px - cx;
  const dy = py - cy;
  const lx = dx * Math.cos(rad) - dy * Math.sin(rad) + el.width / 2;
  const ly = dx * Math.sin(rad) + dy * Math.cos(rad) + el.height / 2;
  return (
    lx >= -padding &&
    lx <= el.width + padding &&
    ly >= -padding &&
    ly <= el.height + padding
  );
}

export interface ImageAdjustments {
  brightness?: number;
  contrast?: number;
  saturation?: number;
  hueRotate?: number;
  blur?: number;
  grayscale?: number;
  sepia?: number;
}

export const DEFAULT_IMAGE_ADJUSTMENTS: Required<ImageAdjustments> = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hueRotate: 0,
  blur: 0,
  grayscale: 0,
  sepia: 0,
};

export const IMAGE_FILTER_PRESETS: Array<{ id: string; label: string; values: Required<ImageAdjustments> }> = [
  {
    id: 'natural',
    label: 'Natural',
    values: { ...DEFAULT_IMAGE_ADJUSTMENTS },
  },
  {
    id: 'vivid',
    label: 'Vivid',
    values: { brightness: 106, contrast: 118, saturation: 148, hueRotate: 0, blur: 0, grayscale: 0, sepia: 0 },
  },
  {
    id: 'warm',
    label: 'Warm Film',
    values: { brightness: 104, contrast: 108, saturation: 118, hueRotate: -6, blur: 0, grayscale: 0, sepia: 22 },
  },
  {
    id: 'cool',
    label: 'Cool Crisp',
    values: { brightness: 104, contrast: 115, saturation: 94, hueRotate: 10, blur: 0, grayscale: 0, sepia: 0 },
  },
  {
    id: 'noir',
    label: 'Noir B&W',
    values: { brightness: 102, contrast: 128, saturation: 0, hueRotate: 0, blur: 0, grayscale: 100, sepia: 0 },
  },
  {
    id: 'vintage',
    label: 'Vintage',
    values: { brightness: 108, contrast: 88, saturation: 76, hueRotate: -4, blur: 0, grayscale: 0, sepia: 40 },
  },
];

export function buildImageFilterCss(adj?: ImageAdjustments | null): string | undefined {
  if (!adj) return undefined;
  const parts: string[] = [];
  const br = adj.brightness ?? 100;
  const ct = adj.contrast ?? 100;
  const sat = adj.saturation ?? 100;
  const hue = adj.hueRotate ?? 0;
  const blur = adj.blur ?? 0;
  const gray = adj.grayscale ?? 0;
  const sep = adj.sepia ?? 0;

  if (br !== 100) parts.push(`brightness(${clamp(br, 20, 200)}%)`);
  if (ct !== 100) parts.push(`contrast(${clamp(ct, 20, 200)}%)`);
  if (sat !== 100) parts.push(`saturate(${clamp(sat, 0, 250)}%)`);
  if (hue !== 0) parts.push(`hue-rotate(${clamp(hue, -180, 180)}deg)`);
  if (gray > 0) parts.push(`grayscale(${clamp(gray, 0, 100)}%)`);
  if (sep > 0) parts.push(`sepia(${clamp(sep, 0, 100)}%)`);
  if (blur > 0) parts.push(`blur(${clamp(blur, 0, 20)}px)`);

  return parts.length > 0 ? parts.join(' ') : undefined;
}

export function extractFrameMediaAdjustments(props: Record<string, unknown>): ImageAdjustments {
  return {
    brightness: typeof props.mediaBrightness === 'number' ? props.mediaBrightness : 100,
    contrast: typeof props.mediaContrast === 'number' ? props.mediaContrast : 100,
    saturation: typeof props.mediaSaturation === 'number' ? props.mediaSaturation : 100,
    hueRotate: typeof props.mediaHueRotate === 'number' ? props.mediaHueRotate : 0,
    blur: typeof props.mediaBlur === 'number' ? props.mediaBlur : 0,
    grayscale: typeof props.mediaGrayscale === 'number' ? props.mediaGrayscale : 0,
    sepia: typeof props.mediaSepia === 'number' ? props.mediaSepia : 0,
  };
}

