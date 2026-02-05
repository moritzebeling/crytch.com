/**
 * Encryption matrix mapping each alphanumeric character to a displacement vector [x, y]
 * Ported exactly from v/2/crytch.js line 20
 */
export const ENCRYPTION_MATRIX: Record<string, [number, number]> = {
  // Numbers
  "0": [-4, 3],
  "1": [3, 5],
  "2": [4, 2],
  "3": [3, -4],
  "4": [-3, -4],
  "5": [-1, 3],
  "6": [4, -1],
  "7": [1, 3],
  "8": [-3, 2],
  "9": [-4, 4],
  // Lowercase letters
  a: [-1, 5],
  b: [2, 3],
  c: [1, 3],
  d: [-2, 4],
  e: [1, -4],
  f: [-2, -2],
  g: [3, 2],
  h: [-3, 3],
  i: [-2, 1],
  j: [-2, -5],
  k: [2, 2],
  l: [4, -3],
  m: [4, 3],
  n: [1, -3],
  o: [1, 5],
  p: [-2, -3],
  q: [-3, 1],
  r: [-2, -4],
  s: [2, 4],
  t: [5, -2],
  u: [4, 1],
  v: [-4, -3],
  w: [-4, 1],
  x: [-1, -4],
  y: [-1, 4],
  z: [-4, -5],
  // Uppercase letters
  A: [-3, 4],
  B: [2, -2],
  C: [3, -3],
  D: [3, -1],
  E: [4, 4],
  F: [-2, 2],
  G: [-1, -2],
  H: [-1, 2],
  I: [3, -2],
  J: [1, -2],
  K: [1, 4],
  L: [5, 1],
  M: [-4, -2],
  N: [5, -1],
  O: [-3, -3],
  P: [2, -5],
  Q: [-2, -1],
  R: [5, 3],
  S: [-5, -2],
  T: [2, -1],
  U: [-4, 1],
  V: [-3, -1],
  W: [-3, 5],
  X: [3, 1],
  Y: [-2, 3],
  Z: [2, -3],
};

/**
 * Get displacement vector for a character
 * Returns [0, 0] for unsupported characters
 */
export function getDisplacement(char: string): [number, number] {
  return ENCRYPTION_MATRIX[char] || [0, 0];
}

/**
 * Check if a character is supported by the encryption matrix
 */
export function isValidChar(char: string): boolean {
  return char in ENCRYPTION_MATRIX;
}

/**
 * Validate a password - only alphanumeric characters allowed
 */
export function validatePassword(password: string): string {
  return password.replace(/[^a-zA-Z0-9]/g, "");
}
