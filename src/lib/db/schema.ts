import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  version: integer("version").notNull().default(2),
  messageUrl: text("message_url").notNull().unique(),
  message: text("message").notNull(), // Paper.js JSON export
  gridSize: integer("grid_size").default(15),
  gridWidth: integer("grid_width"),
  gridHeight: integer("grid_height"),
  windowWidth: integer("window_width"),
  windowHeight: integer("window_height"),
  styleColor: text("style_color").default("#000000"),
  styleBackground: text("style_background").default("#ffffff"),
  styleStroke: integer("style_stroke").default(2),
  language: text("language").default("en"),
  settings: text("settings"), // JSON string for bounds
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  viewCount: integer("view_count").default(0),
});

export type MessageRecord = typeof messages.$inferSelect;
export type NewMessageRecord = typeof messages.$inferInsert;
