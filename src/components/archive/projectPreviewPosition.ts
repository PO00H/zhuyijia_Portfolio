const PREVIEW_WIDTH = 240;
const PREVIEW_HEIGHT = 180;
const POINTER_GAP = 24;

export interface ProjectPreviewPosition {
  x: number;
  y: number;
}

export function getProjectPreviewPosition(
  pointerX: number,
  pointerY: number,
  viewportWidth: number,
  viewportHeight: number,
): ProjectPreviewPosition {
  const fitsOnRight = pointerX + POINTER_GAP + PREVIEW_WIDTH <= viewportWidth;
  const x = fitsOnRight
    ? pointerX + POINTER_GAP
    : Math.max(POINTER_GAP, pointerX - PREVIEW_WIDTH - POINTER_GAP);
  const maxY = Math.max(POINTER_GAP, viewportHeight - PREVIEW_HEIGHT - POINTER_GAP);
  const y = Math.min(Math.max(POINTER_GAP, pointerY + POINTER_GAP), maxY);

  return { x, y };
}
