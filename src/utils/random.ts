export function randomId(): string {
  const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
  return uint32.toString(16);
}

export function randomInt(min: number, max: number): number {
  const maxFloor = Math.floor(max);
  const minCeil = Math.ceil(min);
  return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
}