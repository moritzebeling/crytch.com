export interface MessageStyles {
  color: string;
  background: string;
  strokeWidth: number;
}

export interface MessageBounds {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface MessageSettings {
  bounds?: MessageBounds;
}

export interface Message {
  id: number;
  version: number;
  messageUrl: string;
  message: string; // Paper.js JSON export
  gridSize: number;
  gridWidth: number | null;
  gridHeight: number | null;
  windowWidth: number | null;
  windowHeight: number | null;
  styleColor: string;
  styleBackground: string;
  styleStroke: number;
  language: string;
  settings: string | null;
  createdAt: Date;
  viewCount: number;
}

export interface SaveMessageRequest {
  message: string;
  gridSize: number;
  gridWidth: number;
  gridHeight: number;
  windowWidth: number;
  windowHeight: number;
  styleColor: string;
  styleBackground: string;
  styleStroke: number;
  language: string;
  bounds?: MessageBounds;
}

export interface SaveMessageResponse {
  status: "success" | "error";
  url?: string;
  error?: string;
}

export interface GetMessageResponse {
  status: "success" | "error";
  data?: Message;
  error?: string;
}
