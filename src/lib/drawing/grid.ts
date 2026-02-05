/**
 * Grid utilities for the drawing tool
 * All coordinates snap to a grid for consistent visual aesthetics
 */

import type { Point, GridConfig } from "@/types";

/**
 * Default grid configuration
 */
export const DEFAULT_GRID: GridConfig = {
  size: 15,
  width: 0,
  height: 0,
};

/**
 * Snap a value to the nearest grid point
 */
export function snap(value: number, gridSize: number = DEFAULT_GRID.size): number {
  return Math.round(value / gridSize) * gridSize;
}

/**
 * Snap a point to the nearest grid intersection
 */
export function snapPoint(point: Point, gridSize: number = DEFAULT_GRID.size): Point {
  return {
    x: snap(point.x, gridSize),
    y: snap(point.y, gridSize),
  };
}

/**
 * Snap an array of coordinates to grid
 */
export function snapCoords(coords: number[], gridSize: number = DEFAULT_GRID.size): number[] {
  return coords.map((coord) => snap(coord, gridSize));
}

/**
 * Convert grid units to pixels (multiply)
 */
export function blow(value: number, gridSize: number = DEFAULT_GRID.size): number {
  return Math.round(value * gridSize);
}

/**
 * Convert grid point to pixel coordinates
 */
export function blowPoint(point: Point, gridSize: number = DEFAULT_GRID.size): Point {
  return {
    x: blow(point.x, gridSize),
    y: blow(point.y, gridSize),
  };
}

/**
 * Convert pixels to grid units (divide)
 */
export function shrink(value: number, gridSize: number = DEFAULT_GRID.size): number {
  return Math.round(value / gridSize);
}

/**
 * Convert pixel coordinates to grid point
 */
export function shrinkPoint(point: Point, gridSize: number = DEFAULT_GRID.size): Point {
  return {
    x: shrink(point.x, gridSize),
    y: shrink(point.y, gridSize),
  };
}

/**
 * Calculate grid dimensions from window size
 */
export function calculateGridDimensions(
  windowWidth: number,
  windowHeight: number,
  gridSize: number = DEFAULT_GRID.size
): GridConfig {
  return {
    size: gridSize,
    width: Math.floor(windowWidth / gridSize),
    height: Math.floor(windowHeight / gridSize),
  };
}

/**
 * Check if device is mobile based on window dimensions
 */
export function isMobileDevice(windowWidth: number, windowHeight: number): boolean {
  return windowWidth <= 460 || windowHeight <= 420;
}
