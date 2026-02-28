'use client';

import { useEffect, useRef } from 'react';
import { getCharacter } from '@/lib/typeface';

interface TypefaceLetterCanvasProps {
  char: string;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

export function TypefaceLetterCanvas({
  char,
  color = '#000000',
  strokeWidth = 2,
  className,
}: TypefaceLetterCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const charDef = getCharacter(char);
    if (!charDef) return;

    let scope: paper.PaperScope | null = null;

    const init = async () => {
      const paperModule = await import('paper');
      const paper = paperModule.default;

      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width || 200;
      canvas.height = rect.height || 200;

      scope = new paper.PaperScope();
      scope.setup(canvas);

      const { points } = charDef;

      const xs = points.map(([x]) => x);
      const minX = Math.min(...xs);

      // Grid runs 0–9: uppercase cap-height at 0, baseline at 7, descenders at 9.
      // A fixed GRID_HEIGHT keeps 1 grid unit = same pixels on every canvas,
      // so C (cap 0–7) renders larger than c (x-height 2–7).
      const GRID_HEIGHT = 9;
      // Baseline sits at grid y=7. Centering the full grid (0–9) vertically
      // places the baseline at the same pixel on every canvas — all letters
      // stand on a shared baseline regardless of their cap-height or descenders.
      const BASELINE = 7;

      const { width, height } = scope.view.size;
      const padding = Math.min(width, height) * 0.25;
      const availW = width - 2 * padding;
      const availH = height - 2 * padding;

      const scale = availH / GRID_HEIGHT;

      // Shared baseline pixel: center the grid vertically, then locate y=7.
      const gridTop = (height - GRID_HEIGHT * scale) / 2;
      const baselinePx = gridTop + BASELINE * scale;

      // Each character is anchored so its y=7 hits baselinePx.
      // Horizontal: center by the character's advance width (span).
      const offsetX =
        padding + (availW - charDef.span * scale) / 2 - minX * scale;
      const offsetY = baselinePx - BASELINE * scale;

      new scope.Path({
        segments: points.map(
          ([x, y]) =>
            new scope!.Point(x * scale + offsetX, y * scale + offsetY),
        ),
        strokeColor: new scope.Color(color),
        strokeWidth,
        strokeCap: 'round',
        strokeJoin: 'round',
      });

      scope.view.update();
    };

    init();

    return () => {
      scope?.project?.clear();
    };
  }, [char, color, strokeWidth]);

  return <canvas ref={canvasRef} className={className} />;
}
