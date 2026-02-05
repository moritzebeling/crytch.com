/**
 * Path style definitions for the drawing tool
 */

import type { PathStyle } from "@/types";

/**
 * Default path style
 */
export const DEFAULT_PATH_STYLE: PathStyle = {
  strokeColor: "#000000",
  strokeWidth: 2,
  strokeCap: "round",
  strokeJoin: "round",
};

/**
 * Interface highlight style (cursor, preview lines)
 */
export const INTERFACE_STYLE: PathStyle = {
  strokeColor: "#bbbbbb",
  strokeWidth: 3,
  strokeCap: "round",
  strokeJoin: "round",
};

/**
 * Color presets
 */
export const COLOR_PRESETS = {
  black: "#000000",
  white: "#ffffff",
  red: "#ff0000",
  blue: "#0000ff",
  green: "#00ff00",
  grey: "#bbbbbb",
  dark: "#555555",
  light: "#bbbbbb",
} as const;

export type ColorPreset = keyof typeof COLOR_PRESETS;

/**
 * Get a color value from preset name or return the value if it's already a color
 */
export function getColor(colorOrPreset: string): string {
  if (colorOrPreset in COLOR_PRESETS) {
    return COLOR_PRESETS[colorOrPreset as ColorPreset];
  }
  return colorOrPreset;
}

/**
 * Generate a random color
 */
export function randomColor(): string {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

/**
 * Check if a background color is dark (for theme switching)
 */
export function isDarkBackground(color: string): boolean {
  const normalized = getColor(color).toLowerCase();
  return normalized === "#000000" || normalized === "black";
}

/**
 * Get the appropriate grey color based on theme
 */
export function getGreyForTheme(isDark: boolean): string {
  return isDark ? COLOR_PRESETS.dark : COLOR_PRESETS.light;
}
