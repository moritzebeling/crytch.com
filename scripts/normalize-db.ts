import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const COLOR_MAP: Record<string, string> = {
  black: "#000000",
  white: "#ffffff",
  red: "#ff0000",
  green: "#008000",
  blue: "#0000ff",
  yellow: "#ffff00",
  "rgb(255, 255, 255)": "#ffffff",
  "rgb(0, 0, 0)": "#000000",
  "rgb(0, 0, 255)": "#0000ff",
  "rgb(255, 0, 0)": "#ff0000",
  "000000": "#000000",
};

type Row = {
  id: number;
  style_color: string | null;
  style_background: string | null;
};

function normalizeColor(value: string | null): string | null {
  if (value === null) return null;

  const normalized = value.trim().toLowerCase();
  return COLOR_MAP[normalized] ?? value;
}

function main() {
  const dataDir = path.join(process.cwd(), "data");
  const dbPath =
    process.env.DATABASE_URL?.replace("file:", "") ||
    path.join(dataDir, "crytch.db");

  if (!fs.existsSync(dbPath)) {
    console.error(`Database file not found: ${dbPath}`);
    process.exit(1);
  }

  const sqlite = new Database(dbPath);
  const rows = sqlite
    .prepare("SELECT id, style_color, style_background FROM messages")
    .all() as Row[];

  const update = sqlite.prepare(`
    UPDATE messages
    SET style_color = @style_color, style_background = @style_background
    WHERE id = @id
  `);

  let updatedCount = 0;

  const normalizeAll = sqlite.transaction((records: Row[]) => {
    for (const row of records) {
      const nextStyleColor = normalizeColor(row.style_color);
      const nextStyleBackground = normalizeColor(row.style_background);

      if (
        nextStyleColor !== row.style_color ||
        nextStyleBackground !== row.style_background
      ) {
        update.run({
          id: row.id,
          style_color: nextStyleColor,
          style_background: nextStyleBackground,
        });
        updatedCount += 1;
      }
    }
  });

  normalizeAll(rows);
  sqlite.close();

  console.log(`Normalized ${updatedCount} message record(s).`);
}

main();
