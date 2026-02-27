import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { rgbToHex, repairHex } from "../src/lib/drawing/colors";

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

  if (COLOR_MAP[normalized]) return COLOR_MAP[normalized];
  if (normalized.startsWith("rgb(")) return rgbToHex(normalized) ?? value;
  return repairHex(normalized) ?? value;
}

function normalizeReadableColor(
  color: string | null,
  background: string | null
): string | null {
  if (color === "#000000" && background === "#000000") {
    return "#ffffff";
  }

  if (color === "#ffffff" && background === "#ffffff") {
    return "#000000";
  }

  if (color === background) {
    return "#000000";
  }

  return color;
}

const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/;

function isValidHexColor(value: string | null): boolean {
  return value === null || HEX_COLOR_PATTERN.test(value);
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

  const invalidHexGlob = "#[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]";
  const rows = sqlite
    .prepare(`
      SELECT id, style_color, style_background FROM messages
      WHERE (style_color IS NOT NULL AND style_color NOT GLOB '${invalidHexGlob}')
         OR (style_background IS NOT NULL AND style_background NOT GLOB '${invalidHexGlob}')
    `)
    .all() as Row[];

  const update = sqlite.prepare(`
    UPDATE messages
    SET style_color = @style_color, style_background = @style_background
    WHERE id = @id
  `);

  let updatedCount = 0;
  const unreplacedCounts = new Map<string, number>();

  const normalizeAll = sqlite.transaction((records: Row[]) => {
    for (const row of records) {
      const nextStyleBackground = normalizeColor(row.style_background);
      const normalizedStyleColor = normalizeColor(row.style_color);
      const nextStyleColor = normalizeReadableColor(
        normalizedStyleColor,
        nextStyleBackground
      );

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

      for (const value of [nextStyleColor, nextStyleBackground]) {
        if (!isValidHexColor(value)) {
          const key = value as string;
          unreplacedCounts.set(key, (unreplacedCounts.get(key) ?? 0) + 1);
        }
      }
    }
  });

  normalizeAll(rows);
  sqlite.close();

  console.log(`Found ${rows.length} record(s) with invalid color values.`);
  console.log(`Normalized ${updatedCount} record(s).`);

  if (unreplacedCounts.size > 0) {
    console.log(`\nUnreplaced invalid values:`);
    for (const [value, count] of [...unreplacedCounts.entries()].sort((a, b) => b[1] - a[1])) {
      console.log(`  ${count}x  ${value}`);
    }
  } else {
    console.log(`All invalid values were successfully replaced.`);
  }
}

main();
