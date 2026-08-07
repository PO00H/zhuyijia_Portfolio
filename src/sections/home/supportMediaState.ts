export function toggleActiveMedia(
  currentId: string | null,
  requestedId: string,
): string | null {
  return currentId === requestedId ? null : requestedId;
}
