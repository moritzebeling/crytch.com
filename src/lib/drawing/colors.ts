/**
 * Convert an rgb(r, g, b) string to a #rrggbb hex color string.
 * Returns null if the input cannot be parsed.
 */
export function rgbToHex(rgb: string): string | null {
  const match = rgb.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
  if (!match) return null;

  const [, r, g, b] = match.map(Number);
  if ([r, g, b].some((v) => v > 255)) return null;

  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

/**
 * Attempt to repair a malformed hex color string into a valid #rrggbb format.
 * - Strips any characters that are not valid hex digits (0-9, a-f)
 * - If 3 hex digits remain, each digit is doubled (e.g. "abc" -> "aabbcc")
 * - Otherwise pads with trailing zeros to reach 6 digits, or truncates to 6
 * - Prefixes with #
 * Returns null if no valid hex digits can be extracted.
 */
export function repairHex(value: string): string | null {
  const digits = value.toLowerCase().replace(/[^0-9a-f]/g, "");

  if (digits.length === 0) return null;

  let hex: string;
  if (digits.length === 3) {
    hex = digits.split("").map((c) => c + c).join("");
  } else {
    hex = digits.slice(0, 6).padEnd(6, "0");
  }

  return "#" + hex;
}
