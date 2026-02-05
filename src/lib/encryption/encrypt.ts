import { getDisplacement, validatePassword } from "./matrix";

/**
 * Segment point representation for encryption
 */
export interface SegmentPoint {
  x: number;
  y: number;
}

/**
 * Path representation for encryption
 */
export interface EncryptablePath {
  segments: SegmentPoint[];
}

/**
 * Convert grid units to pixels
 */
function blow(value: number, gridSize: number): number {
  return Math.round(value * gridSize);
}

/**
 * Encrypt a drawing using the Crytch v2 algorithm
 * Port from v/2/crytch.js lines 573-637
 *
 * @param paths - Array of paths with segments
 * @param password - Alphanumeric password
 * @param gridSize - Grid size in pixels (default 15)
 * @returns Encrypted paths with modified segment positions
 */
export function encryptV2(
  paths: EncryptablePath[],
  password: string,
  gridSize: number = 15
): EncryptablePath[] {
  const cleanPassword = validatePassword(password);

  if (!cleanPassword || cleanPassword.length < 1) {
    return paths;
  }

  // Deep clone paths to avoid mutation
  const encryptedPaths: EncryptablePath[] = JSON.parse(JSON.stringify(paths));
  const passwordChars = cleanPassword.split("");
  const passwordLength = passwordChars.length;
  const pathCount = encryptedPaths.length;

  let salt = 1;

  // Go through password characters
  for (let i = 0; i < passwordLength; i++) {
    const key = passwordChars[i];
    const [matrixX, matrixY] = getDisplacement(key);

    // Go through single paths of drawing
    for (let p = 0; p < pathCount; p++) {
      const currentPath = encryptedPaths[p];
      const segmentCount = currentPath.segments.length;

      // Go through segments (starting offset varies by character index)
      for (let s = i % 4; s < segmentCount; s++) {
        const manip = { x: 1, y: 1 };

        // Apply matrix displacement with modifiers
        if (s % 5 > 0) {
          manip.x = matrixX;
        }
        if (s % 5 < 3) {
          manip.y = matrixY;
        }

        // Apply salt-based sign flipping
        if (salt % 4 > 2) {
          manip.x = manip.x * -1;
        }
        // Note: salt % 4 < 0 is never true for positive salt, keeping for exact port
        if (salt % 4 < 0) {
          manip.x = manip.x * -1;
        }

        // Swap x/y based on salt + segment position
        if ((salt + s) % 4 > 2) {
          const prex = manip.x;
          manip.x = manip.y;
          if ((salt + s) % 4 < 0) {
            manip.y = prex;
          }
        } else if ((salt + s) % 4 < 0) {
          manip.y = manip.x;
        }

        // Scale based on character position in password
        if (i < 2) {
          manip.x = Math.floor(manip.x * 0.5);
          manip.y = Math.floor(manip.y * 0.5);
        } else if (i < 3) {
          manip.x = Math.ceil(manip.x * 0.5);
          manip.y = Math.ceil(manip.y * 0.5);
        } else if (i > 10) {
          manip.x = Math.floor(manip.x * (i * 0.1));
          manip.y = Math.floor(manip.y * (i * 0.1));
        }

        // Apply displacement (in pixels)
        currentPath.segments[s].x += blow(manip.x, gridSize);
        currentPath.segments[s].y += blow(manip.y, gridSize);

        salt++;
      }
    }
  }

  return encryptedPaths;
}

/**
 * Encrypt a drawing using the Crytch v1 algorithm
 * Port from v/1/crytch.js - simpler algorithm
 *
 * @param paths - Array of paths with segments
 * @param password - Alphanumeric password
 * @param gridSize - Grid size in pixels (default 15)
 * @returns Encrypted paths with modified segment positions
 */
export function encryptV1(
  paths: EncryptablePath[],
  password: string,
  gridSize: number = 15
): EncryptablePath[] {
  const cleanPassword = validatePassword(password);

  if (!cleanPassword || cleanPassword.length < 1) {
    return paths;
  }

  // Deep clone paths to avoid mutation
  const encryptedPaths: EncryptablePath[] = JSON.parse(JSON.stringify(paths));
  const passwordChars = cleanPassword.split("");
  const passwordLength = passwordChars.length;
  const pathCount = encryptedPaths.length;

  let salt = 1;

  // Go through password characters
  for (let i = 0; i < passwordLength; i++) {
    const key = passwordChars[i];
    const [matrixX, matrixY] = getDisplacement(key);

    // Go through single paths of drawing
    for (let p = 0; p < pathCount; p++) {
      const currentPath = encryptedPaths[p];
      const segmentCount = currentPath.segments.length;

      // Go through segments
      for (let s = i % 4; s < segmentCount; s++) {
        const manip = { x: 1, y: 1 };

        // Apply matrix displacement with modifiers
        if (s % 5 > 0) {
          manip.x = matrixX;
        }
        if (s % 5 < 3) {
          manip.y = matrixY;
        }

        // Apply salt-based sign flipping
        if (salt % 4 > 2) {
          manip.x = manip.x * -1;
        }

        // Swap x/y based on salt + segment position
        if ((salt + s) % 4 > 2) {
          const prex = manip.x;
          manip.x = manip.y;
          manip.y = prex;
        }

        // v1 doesn't have position-based scaling

        // Apply displacement (in pixels)
        currentPath.segments[s].x += blow(manip.x, gridSize);
        currentPath.segments[s].y += blow(manip.y, gridSize);

        salt++;
      }
    }
  }

  return encryptedPaths;
}

/**
 * Encrypt paths with the appropriate version
 */
export function encrypt(
  paths: EncryptablePath[],
  password: string,
  gridSize: number = 15,
  version: 1 | 2 = 2
): EncryptablePath[] {
  if (version === 1) {
    return encryptV1(paths, password, gridSize);
  }
  return encryptV2(paths, password, gridSize);
}
