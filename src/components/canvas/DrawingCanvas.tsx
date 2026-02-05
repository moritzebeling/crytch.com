"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "@/components/ui";
import { snap, blow, DEFAULT_GRID } from "@/lib/drawing";
import { getCharacter } from "@/lib/typeface";
import { encrypt, decrypt, type EncryptablePath } from "@/lib/encryption";
import type { ToolType } from "@/types";

// Paper.js types
type PaperScope = typeof import("paper");
type PaperLayer = paper.Layer;
type PaperPath = paper.Path;
type PaperPoint = paper.Point;
type PaperTool = paper.Tool;
type PaperToolEvent = paper.ToolEvent;

interface DrawingCanvasProps {
  onCanvasChange?: (filled: boolean) => void;
  onEncryptedChange?: (encrypted: boolean) => void;
  initialMessage?: string;
  readOnly?: boolean;
  version?: 1 | 2;
}

export function DrawingCanvas({
  onCanvasChange,
  onEncryptedChange,
  initialMessage,
  readOnly = false,
  version = 2,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolType>("pen");
  const [isEncrypted, setIsEncrypted] = useState(false);
  const { color, strokeWidth, background } = useTheme();

  // Paper.js instance ref
  const paperRef = useRef<PaperScope | null>(null);

  // Paper.js refs
  const layerPen = useRef<PaperLayer | null>(null);
  const layerText = useRef<PaperLayer | null>(null);
  const layerInterface = useRef<PaperLayer | null>(null);
  const layerConserve = useRef<PaperLayer | null>(null);
  const currentPath = useRef<PaperPath | null>(null);
  const cursor = useRef<PaperPath | null>(null);
  const previewPath = useRef<PaperPath | null>(null);
  const highlight = useRef<PaperPath | null>(null);
  const tool = useRef<PaperTool | null>(null);

  // Grid settings
  const gridSize = DEFAULT_GRID.size;

  // Cursor position for text tool
  const cursorPos = useRef({ x: blow(4, gridSize), y: blow(6, gridSize) });
  const cursorHome = { x: blow(4, gridSize), y: blow(6, gridSize) };

  // Type settings
  const typeSettings = {
    scale: 1,
    leading: 1,
    whitespace: 2,
    lineHeight: 7,
  };

  // Initialize Paper.js dynamically
  useEffect(() => {
    if (!canvasRef.current) return;

    let mounted = true;

    async function initPaper() {
      // Dynamic import to avoid SSR issues
      const paperModule = await import("paper");
      const paper = paperModule.default;

      if (!mounted || !canvasRef.current) return;

      paperRef.current = paper;
      paper.setup(canvasRef.current);

      // Create layers
      layerInterface.current = new paper.Layer();
      layerInterface.current.name = "interface";
      layerConserve.current = new paper.Layer();
      layerConserve.current.visible = false;
      layerPen.current = new paper.Layer();
      layerPen.current.name = "pen";
      layerText.current = new paper.Layer();
      layerText.current.name = "text";

      layerInterface.current.sendToBack();

      // Create interface elements
      createInterfaceElements(paper);

      // Load initial message if provided
      if (initialMessage) {
        loadMessage(paper, initialMessage);
      }

      // Set up tool handlers
      setupTool(paper);

      setIsReady(true);
    }

    initPaper();

    return () => {
      mounted = false;
      tool.current?.remove();
      paperRef.current?.project?.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createInterfaceElements = (paper: PaperScope) => {
    if (!layerInterface.current) return;

    layerInterface.current.activate();

    // Create cursor for text tool
    cursor.current = new paper.Path({
      segments: [
        [0, 0],
        [0, blow(typeSettings.lineHeight, gridSize)],
      ],
      strokeColor: new paper.Color("#bbbbbb"),
      strokeWidth: 3,
      visible: false,
    });
    cursor.current.pivot = new paper.Point(0, 0);
    cursor.current.position = new paper.Point(cursorHome.x, cursorHome.y);

    // Create preview path
    previewPath.current = new paper.Path({
      segments: [
        [-100, -100],
        [-100, -100],
      ],
      strokeColor: new paper.Color("#bbbbbb"),
      strokeWidth: 2,
      visible: false,
    });

    // Create highlight circle
    highlight.current = new paper.Path.Circle({
      center: new paper.Point(-100, -100),
      radius: Math.max(2, Math.ceil(strokeWidth * 0.5)),
      fillColor: new paper.Color("#bbbbbb"),
      strokeColor: new paper.Color("#bbbbbb"),
      strokeWidth: 5,
      visible: false,
    });
  };

  const loadMessage = (paper: PaperScope, messageJson: string) => {
    try {
      paper.project.importJSON(messageJson);

      // Find and organize layers
      for (const layer of paper.project.layers) {
        if (layer.children.length > 0 && layer.name !== "interface") {
          layerPen.current = layer;
          break;
        }
      }

      paper.view.update();
    } catch (error) {
      console.error("Error loading message:", error);
    }
  };

  const setupTool = (paper: PaperScope) => {
    tool.current = new paper.Tool();

    tool.current.onMouseDown = (event: PaperToolEvent) => {
      if (readOnly || activeTool !== "pen") return;

      const point = new paper.Point(
        snap(event.point.x, gridSize),
        snap(event.point.y, gridSize)
      );

      if (!currentPath.current) {
        startNewPath(paper);
      }

      if (currentPath.current) {
        const lastSeg = currentPath.current.lastSegment;
        if (!lastSeg || lastSeg.point.x !== point.x || lastSeg.point.y !== point.y) {
          currentPath.current.add(point);
        }

        if (currentPath.current.segments.length === 1) {
          currentPath.current.pivot = currentPath.current.firstSegment.point;
        }

        if (previewPath.current) {
          previewPath.current.visible = true;
        }
      }
    };

    tool.current.onMouseDrag = (event: PaperToolEvent) => {
      if (readOnly || activeTool !== "pen" || !currentPath.current) return;

      const point = new paper.Point(
        snap(event.point.x, gridSize),
        snap(event.point.y, gridSize)
      );

      const lastSeg = currentPath.current.lastSegment;
      if (!lastSeg || lastSeg.point.x !== point.x || lastSeg.point.y !== point.y) {
        currentPath.current.add(point);
      }

      if (highlight.current) {
        highlight.current.position = point;
      }
    };

    tool.current.onMouseUp = (event: PaperToolEvent) => {
      if (readOnly || activeTool !== "pen" || !currentPath.current) return;

      const point = new paper.Point(
        snap(event.point.x, gridSize),
        snap(event.point.y, gridSize)
      );

      // Close path if end meets start
      if (currentPath.current.segments.length > 1) {
        const first = currentPath.current.firstSegment.point;
        const last = currentPath.current.lastSegment.point;
        if (first.x === last.x && first.y === last.y) {
          currentPath.current.lastSegment.remove();
          currentPath.current.closed = true;
          startNewPath(paper);
        }
      }

      if (previewPath.current) {
        previewPath.current.lastSegment.point = point;
        previewPath.current.firstSegment.point = point;
      }

      checkCanvasFilled();
    };

    tool.current.onMouseMove = (event: PaperToolEvent) => {
      if (readOnly) return;

      const point = new paper.Point(
        snap(event.point.x, gridSize),
        snap(event.point.y, gridSize)
      );

      if (highlight.current) {
        highlight.current.position = point;
      }

      if (previewPath.current && currentPath.current && currentPath.current.segments.length > 0) {
        previewPath.current.lastSegment.point = point;
      }
    };
  };

  const startNewPath = useCallback((paper?: PaperScope) => {
    const p = paper || paperRef.current;
    if (!p || !layerPen.current) return;

    layerPen.current.activate();
    currentPath.current = new p.Path({
      strokeColor: new p.Color(color),
      strokeWidth,
      strokeCap: "round",
      strokeJoin: "round",
    });

    if (highlight.current) {
      highlight.current.visible = true;
    }
    if (previewPath.current) {
      previewPath.current.visible = false;
    }
  }, [color, strokeWidth]);

  const checkCanvasFilled = useCallback(() => {
    if (!layerPen.current || !layerText.current) return false;

    const penPaths = layerPen.current.children.filter(
      (child) => child.className === "Path" && (child as PaperPath).segments.length > 1
    );
    const textPaths = layerText.current.children.filter(
      (child) => child.className === "Path" && (child as PaperPath).segments.length > 1
    );

    const filled = penPaths.length + textPaths.length > 0;
    onCanvasChange?.(filled);
    return filled;
  }, [onCanvasChange]);

  // Print a character at cursor position
  const printCharacter = useCallback(
    (char: string) => {
      const paper = paperRef.current;
      if (!paper || !layerText.current || !cursor.current) return;

      const charDef = getCharacter(char);
      if (!charDef) return;

      layerText.current.activate();

      // Create path from character points
      const points = charDef.points.map(([x, y]) => [
        blow(x * typeSettings.scale, gridSize),
        blow(y * typeSettings.scale, gridSize),
      ]);

      const charPath = new paper.Path({
        segments: points,
        strokeColor: new paper.Color(color),
        strokeWidth,
        strokeCap: "round",
        strokeJoin: "round",
      });

      charPath.pivot = new paper.Point(0, 0);
      charPath.position = cursor.current.position;

      // Move cursor
      cursorPos.current.x +=
        blow(charDef.span * typeSettings.scale, gridSize) +
        blow(typeSettings.leading * typeSettings.scale, gridSize);

      // Handle line wrap
      if (cursorPos.current.x > paper.view.size.width - blow(typeSettings.whitespace + 2, gridSize)) {
        cursorPos.current.x = cursorHome.x;
        cursorPos.current.y += blow((typeSettings.lineHeight + typeSettings.leading * 2) * typeSettings.scale, gridSize);
      }

      cursor.current.position = new paper.Point(cursorPos.current.x, cursorPos.current.y);
      checkCanvasFilled();
      paper.view.update();
    },
    [color, strokeWidth, gridSize, checkCanvasFilled, cursorHome.x]
  );

  // Encryption functions
  const encryptCanvas = useCallback(
    (password: string) => {
      const paper = paperRef.current;
      if (!paper || !layerPen.current || !layerConserve.current) return;

      // Merge text layer into pen layer
      if (layerText.current && layerText.current.children.length > 0) {
        layerPen.current.addChildren(layerText.current.removeChildren());
      }

      // Save original state
      layerConserve.current.removeChildren();
      for (const child of layerPen.current.children) {
        layerConserve.current.addChild(child.clone());
      }

      // Convert to encryptable paths
      const paths: EncryptablePath[] = layerPen.current.children
        .filter((child) => child.className === "Path")
        .map((child) => ({
          segments: (child as PaperPath).segments.map((seg) => ({
            x: seg.point.x,
            y: seg.point.y,
          })),
        }));

      // Encrypt
      const encrypted = encrypt(paths, password, gridSize, version);

      // Apply encrypted positions
      let pathIndex = 0;
      for (const child of layerPen.current.children) {
        if (child.className === "Path" && pathIndex < encrypted.length) {
          const encPath = encrypted[pathIndex];
          const paperPath = child as PaperPath;
          for (let i = 0; i < paperPath.segments.length && i < encPath.segments.length; i++) {
            paperPath.segments[i].point = new paper.Point(
              encPath.segments[i].x,
              encPath.segments[i].y
            );
          }
          pathIndex++;
        }
      }

      setIsEncrypted(true);
      onEncryptedChange?.(true);
      paper.view.update();
    },
    [gridSize, version, onEncryptedChange]
  );

  const decryptCanvas = useCallback(
    (password: string) => {
      const paper = paperRef.current;
      if (!paper || !layerPen.current) return;

      // Convert to encryptable paths
      const paths: EncryptablePath[] = layerPen.current.children
        .filter((child) => child.className === "Path")
        .map((child) => ({
          segments: (child as PaperPath).segments.map((seg) => ({
            x: seg.point.x,
            y: seg.point.y,
          })),
        }));

      // Decrypt
      const decrypted = decrypt(paths, password, gridSize, version);

      // Apply decrypted positions
      let pathIndex = 0;
      for (const child of layerPen.current.children) {
        if (child.className === "Path" && pathIndex < decrypted.length) {
          const decPath = decrypted[pathIndex];
          const paperPath = child as PaperPath;
          for (let i = 0; i < paperPath.segments.length && i < decPath.segments.length; i++) {
            paperPath.segments[i].point = new paper.Point(
              decPath.segments[i].x,
              decPath.segments[i].y
            );
          }
          pathIndex++;
        }
      }

      paper.view.update();
    },
    [gridSize, version]
  );

  const restoreFromConserve = useCallback(() => {
    const paper = paperRef.current;
    if (!paper || !layerPen.current || !layerConserve.current) return;

    layerPen.current.removeChildren();
    for (const child of layerConserve.current.children) {
      layerPen.current.addChild(child.clone());
    }

    setIsEncrypted(false);
    onEncryptedChange?.(false);
    paper.view.update();
  }, [onEncryptedChange]);

  const clearCanvas = useCallback(() => {
    const paper = paperRef.current;
    if (!paper) return;

    layerPen.current?.removeChildren();
    layerText.current?.removeChildren();
    layerConserve.current?.removeChildren();

    cursorPos.current = { ...cursorHome };
    if (cursor.current) {
      cursor.current.position = new paper.Point(cursorHome.x, cursorHome.y);
    }

    setIsEncrypted(false);
    onEncryptedChange?.(false);
    checkCanvasFilled();
    paper.view.update();
  }, [cursorHome, checkCanvasFilled, onEncryptedChange]);

  const exportJSON = useCallback(() => {
    if (!layerPen.current) return "";
    return layerPen.current.exportJSON();
  }, []);

  const exportSVG = useCallback(() => {
    const paper = paperRef.current;
    if (!paper) return "";
    return paper.project.exportSVG({ asString: true }) as string;
  }, []);

  // Keyboard event handlers
  useEffect(() => {
    if (readOnly) return;
    const paper = paperRef.current;
    if (!paper) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Tool switching
      if (event.key === "d" || event.key === "p") {
        setActiveTool("pen");
        if (cursor.current) cursor.current.visible = false;
        startNewPath();
      }
      if (event.key === "w" || event.key === "t") {
        setActiveTool("text");
        if (cursor.current) cursor.current.visible = true;
        if (highlight.current) highlight.current.visible = false;
      }
      if (event.key === "m" || event.key === "v" || event.key === "a") {
        setActiveTool("move");
        if (cursor.current) cursor.current.visible = false;
        if (highlight.current) highlight.current.visible = false;
      }

      // Close path
      if (event.key === "c" && activeTool === "pen" && currentPath.current) {
        currentPath.current.closed = true;
        startNewPath();
      }

      // Delete last segment/character
      if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();
        if (activeTool === "pen" && currentPath.current?.lastSegment) {
          currentPath.current.lastSegment.remove();
          checkCanvasFilled();
        }
        if (activeTool === "text" && layerText.current?.lastChild) {
          const lastChild = layerText.current.lastChild as PaperPath;
          if (lastChild.pivot) {
            cursorPos.current = { x: lastChild.pivot.x, y: lastChild.pivot.y };
            if (cursor.current) {
              cursor.current.position = new paper.Point(cursorPos.current.x, cursorPos.current.y);
            }
          }
          lastChild.remove();
          checkCanvasFilled();
        }
        paper.view.update();
      }

      // Arrow keys for cursor/segment movement
      const moveAmount = gridSize;
      if (event.key === "ArrowUp") {
        if (activeTool === "text" && cursor.current) {
          cursorPos.current.y -= moveAmount;
          cursor.current.position.y = cursorPos.current.y;
        }
        if (activeTool === "pen" && currentPath.current?.lastSegment) {
          currentPath.current.lastSegment.point.y -= moveAmount;
        }
        paper.view.update();
      }
      if (event.key === "ArrowDown") {
        if (activeTool === "text" && cursor.current) {
          cursorPos.current.y += moveAmount;
          cursor.current.position.y = cursorPos.current.y;
        }
        if (activeTool === "pen" && currentPath.current?.lastSegment) {
          currentPath.current.lastSegment.point.y += moveAmount;
        }
        paper.view.update();
      }
      if (event.key === "ArrowLeft") {
        if (activeTool === "text" && cursor.current) {
          cursorPos.current.x -= moveAmount;
          cursor.current.position.x = cursorPos.current.x;
        }
        if (activeTool === "pen" && currentPath.current?.lastSegment) {
          currentPath.current.lastSegment.point.x -= moveAmount;
        }
        paper.view.update();
      }
      if (event.key === "ArrowRight") {
        if (activeTool === "text" && cursor.current) {
          cursorPos.current.x += moveAmount;
          cursor.current.position.x = cursorPos.current.x;
        }
        if (activeTool === "pen" && currentPath.current?.lastSegment) {
          currentPath.current.lastSegment.point.x += moveAmount;
        }
        paper.view.update();
      }

      // Text input
      if (activeTool === "text") {
        if (event.key === " ") {
          cursorPos.current.x += blow(typeSettings.whitespace, gridSize);
          if (cursor.current) {
            cursor.current.position.x = cursorPos.current.x;
          }
          paper.view.update();
        }
        if (event.key === "Enter") {
          cursorPos.current.x = cursorHome.x;
          cursorPos.current.y += blow((typeSettings.lineHeight + typeSettings.leading * 2) * typeSettings.scale, gridSize);
          if (cursor.current) {
            cursor.current.position = new paper.Point(cursorPos.current.x, cursorPos.current.y);
          }
          paper.view.update();
        }
        if (/^[a-zA-Z0-9]$/.test(event.key)) {
          printCharacter(event.key);
        }
        // Handle punctuation
        const punctuation = ".,!?:;-_@#$%&*()[]{}'\"/\\|+=<>";
        if (punctuation.includes(event.key)) {
          printCharacter(event.key);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTool, readOnly, gridSize, startNewPath, checkCanvasFilled, printCharacter, cursorHome.x]);

  // Expose functions through ref-like pattern
  useEffect(() => {
    if (canvasRef.current) {
      (canvasRef.current as HTMLCanvasElement & {
        crytchFunctions?: {
          encrypt: typeof encryptCanvas;
          decrypt: typeof decryptCanvas;
          restore: typeof restoreFromConserve;
          clear: typeof clearCanvas;
          exportJSON: typeof exportJSON;
          exportSVG: typeof exportSVG;
          setTool: typeof setActiveTool;
        };
      }).crytchFunctions = {
        encrypt: encryptCanvas,
        decrypt: decryptCanvas,
        restore: restoreFromConserve,
        clear: clearCanvas,
        exportJSON,
        exportSVG,
        setTool: setActiveTool,
      };
    }
  }, [encryptCanvas, decryptCanvas, restoreFromConserve, clearCanvas, exportJSON, exportSVG]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0"
      style={{ backgroundColor: background }}
      data-tool={activeTool}
      data-ready={isReady}
      data-encrypted={isEncrypted}
    />
  );
}

// Hook to access canvas functions
export function useCanvasFunctions(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  return {
    encrypt: (password: string) => {
      const canvas = canvasRef.current as HTMLCanvasElement & { crytchFunctions?: { encrypt: (pw: string) => void } };
      canvas?.crytchFunctions?.encrypt(password);
    },
    decrypt: (password: string) => {
      const canvas = canvasRef.current as HTMLCanvasElement & { crytchFunctions?: { decrypt: (pw: string) => void } };
      canvas?.crytchFunctions?.decrypt(password);
    },
    restore: () => {
      const canvas = canvasRef.current as HTMLCanvasElement & { crytchFunctions?: { restore: () => void } };
      canvas?.crytchFunctions?.restore();
    },
    clear: () => {
      const canvas = canvasRef.current as HTMLCanvasElement & { crytchFunctions?: { clear: () => void } };
      canvas?.crytchFunctions?.clear();
    },
    exportJSON: () => {
      const canvas = canvasRef.current as HTMLCanvasElement & { crytchFunctions?: { exportJSON: () => string } };
      return canvas?.crytchFunctions?.exportJSON() || "";
    },
    exportSVG: () => {
      const canvas = canvasRef.current as HTMLCanvasElement & { crytchFunctions?: { exportSVG: () => string } };
      return canvas?.crytchFunctions?.exportSVG() || "";
    },
    setTool: (tool: ToolType) => {
      const canvas = canvasRef.current as HTMLCanvasElement & { crytchFunctions?: { setTool: (t: ToolType) => void } };
      canvas?.crytchFunctions?.setTool(tool);
    },
  };
}
