export type ToolType = "pen" | "text" | "move" | "encrypt" | "send" | "notool";

export interface ToolState {
  activeTool: ToolType;
  lastTool: ToolType;
  pathSelected: boolean;
  preventInput: boolean;
}

export interface PenToolState {
  pathLength: number;
  dragged: number;
  currentPath: paper.Path | null;
}

export interface MoveToolState {
  selectedSegment: paper.Segment | null;
  selectedPath: paper.Path | null;
}

export interface TextToolState {
  cursorPosition: { x: number; y: number };
  cursorVisible: boolean;
}
