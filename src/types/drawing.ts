export interface Point {
  x: number;
  y: number;
}

export interface GridConfig {
  size: number;
  width: number;
  height: number;
}

export interface PathStyle {
  strokeColor: string;
  strokeWidth: number;
  strokeCap: "round" | "butt" | "square";
  strokeJoin: "round" | "miter" | "bevel";
}

export interface DrawingState {
  isEncrypted: boolean;
  isCompressed: boolean;
  canvasFilled: boolean;
  maxPaths: number;
  bounds: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface CursorState {
  position: Point;
  visible: boolean;
  home: Point;
}

export interface TypeSettings {
  scale: number;
  leading: number;
  whitespace: number;
  lineHeight: number;
}
