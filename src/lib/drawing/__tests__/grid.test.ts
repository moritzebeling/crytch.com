import { describe, it, expect } from "vitest";
import {
  snap,
  snapPoint,
  blow,
  blowPoint,
  shrink,
  shrinkPoint,
  calculateGridDimensions,
  isMobileDevice,
  DEFAULT_GRID,
} from "../grid";

describe("Grid Utilities", () => {
  describe("snap", () => {
    it("should snap values to nearest grid point", () => {
      const gridSize = 15;
      expect(snap(0, gridSize)).toBe(0);
      expect(snap(7, gridSize)).toBe(0);
      expect(snap(8, gridSize)).toBe(15);
      expect(snap(15, gridSize)).toBe(15);
      expect(snap(22, gridSize)).toBe(15);
      expect(snap(23, gridSize)).toBe(30);
    });

    it("should use default grid size", () => {
      expect(snap(8)).toBe(15); // Default is 15
    });

    it("should handle negative values", () => {
      expect(snap(-7, 15)).toBe(-0);
      expect(snap(-8, 15)).toBe(-15);
    });
  });

  describe("snapPoint", () => {
    it("should snap both x and y coordinates", () => {
      const result = snapPoint({ x: 22, y: 37 }, 15);
      expect(result.x).toBe(15);
      expect(result.y).toBe(30); // 37 rounds to 30 (2*15), not 45
    });
  });

  describe("blow", () => {
    it("should multiply value by grid size", () => {
      expect(blow(2, 15)).toBe(30);
      expect(blow(3, 10)).toBe(30);
      expect(blow(0, 15)).toBe(0);
    });

    it("should use default grid size", () => {
      expect(blow(2)).toBe(30); // Default is 15
    });
  });

  describe("blowPoint", () => {
    it("should multiply both coordinates by grid size", () => {
      const result = blowPoint({ x: 2, y: 3 }, 15);
      expect(result.x).toBe(30);
      expect(result.y).toBe(45);
    });
  });

  describe("shrink", () => {
    it("should divide value by grid size", () => {
      expect(shrink(30, 15)).toBe(2);
      expect(shrink(45, 15)).toBe(3);
    });

    it("should round to nearest integer", () => {
      expect(shrink(32, 15)).toBe(2);
      expect(shrink(38, 15)).toBe(3);
    });
  });

  describe("shrinkPoint", () => {
    it("should divide both coordinates by grid size", () => {
      const result = shrinkPoint({ x: 30, y: 45 }, 15);
      expect(result.x).toBe(2);
      expect(result.y).toBe(3);
    });
  });

  describe("calculateGridDimensions", () => {
    it("should calculate grid dimensions from window size", () => {
      const result = calculateGridDimensions(1920, 1080, 15);
      expect(result.size).toBe(15);
      expect(result.width).toBe(128); // Math.floor(1920/15)
      expect(result.height).toBe(72); // Math.floor(1080/15)
    });

    it("should use default grid size", () => {
      const result = calculateGridDimensions(1920, 1080);
      expect(result.size).toBe(DEFAULT_GRID.size);
    });
  });

  describe("isMobileDevice", () => {
    it("should return true for small widths", () => {
      expect(isMobileDevice(400, 800)).toBe(true);
      expect(isMobileDevice(460, 800)).toBe(true);
    });

    it("should return true for small heights", () => {
      expect(isMobileDevice(800, 400)).toBe(true);
      expect(isMobileDevice(800, 420)).toBe(true);
    });

    it("should return false for desktop sizes", () => {
      expect(isMobileDevice(1024, 768)).toBe(false);
      expect(isMobileDevice(1920, 1080)).toBe(false);
    });
  });
});
