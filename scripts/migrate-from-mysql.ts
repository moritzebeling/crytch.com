/**
 * Migration script: MySQL to SQLite
 *
 * This script migrates message data from the old MySQL database to the new SQLite database.
 *
 * Usage:
 *   1. Install mysql2: pnpm add -D mysql2
 *   2. Set environment variables:
 *      - MYSQL_HOST (default: localhost)
 *      - MYSQL_USER
 *      - MYSQL_PASSWORD
 *      - MYSQL_DATABASE (default: crytch)
 *   3. Run: npx tsx scripts/migrate-from-mysql.ts
 */

import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

function loadDotEnv() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;

  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const sepIdx = trimmed.indexOf("=");
    if (sepIdx === -1) continue;

    const key = trimmed.slice(0, sepIdx).trim();
    if (!key || process.env[key] !== undefined) continue;

    let value = trimmed.slice(sepIdx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

// Type definitions
interface OldMessage {
  id: number;
  version: number;
  message_url: string;
  message: string;
  gridsize: number | null;
  grid_width: number | null;
  grid_height: number | null;
  window_width: number | null;
  window_height: number | null;
  style_color: string | null;
  style_background: string | null;
  style_stroke: number | null;
  language: string | null;
  settings: string | null;
  created: Date | null;
  opened: number | null;
}

interface NewMessage {
  version: number;
  message_url: string;
  message: string;
  grid_size: number | null;
  grid_width: number | null;
  grid_height: number | null;
  window_width: number | null;
  window_height: number | null;
  style_color: string | null;
  style_background: string | null;
  style_stroke: number | null;
  language: string | null;
  settings: string | null;
  created_at: number | null;
  view_count: number;
}

async function migrate() {
  console.log("🚀 Starting migration from MySQL to SQLite...\n");
  loadDotEnv();

  // Check for mysql2
  let mysql: typeof import("mysql2/promise") | null = null;
  try {
    mysql = await import("mysql2/promise");
  } catch {
    console.error("❌ mysql2 is not installed. Run: pnpm add -D mysql2");
    process.exit(1);
  }

  // MySQL connection config
  const mysqlConfig = {
    host: process.env.MYSQL_HOST || "localhost",
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
    user: process.env.MYSQL_USER || "crytch",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "crytch",
  };

  if (!Number.isInteger(mysqlConfig.port) || mysqlConfig.port <= 0) {
    console.error("❌ MYSQL_PORT must be a valid positive integer");
    process.exit(1);
  }

  if (!mysqlConfig.password) {
    console.error("❌ MYSQL_PASSWORD environment variable is required");
    process.exit(1);
  }

  // SQLite setup
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const sqliteDb = new Database(path.join(dataDir, "crytch.db"));

  // Create SQLite table if not exists
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version INTEGER NOT NULL DEFAULT 2,
      message_url TEXT NOT NULL UNIQUE,
      message TEXT NOT NULL,
      grid_size INTEGER DEFAULT 15,
      grid_width INTEGER,
      grid_height INTEGER,
      window_width INTEGER,
      window_height INTEGER,
      style_color TEXT DEFAULT '#000000',
      style_background TEXT DEFAULT '#ffffff',
      style_stroke INTEGER DEFAULT 2,
      language TEXT DEFAULT 'en',
      settings TEXT,
      created_at INTEGER NOT NULL,
      view_count INTEGER DEFAULT 0
    );
  `);

  try {
    // Connect to MySQL
    console.log(
      `📡 Connecting to MySQL at ${mysqlConfig.host}:${mysqlConfig.port}...`
    );
    const connection = await mysql.createConnection(mysqlConfig);
    console.log("✅ Connected to MySQL\n");

    // Fetch all messages from MySQL
    console.log("📥 Fetching messages from MySQL...");
    const [rows] = await connection.execute(
      "SELECT * FROM Messages ORDER BY id ASC"
    );
    const oldMessages = rows as OldMessage[];
    console.log(`✅ Found ${oldMessages.length} messages\n`);

    // Prepare SQLite insert statement
    const insert = sqliteDb.prepare(`
      INSERT OR IGNORE INTO messages (
        version, message_url, message, grid_size, grid_width, grid_height,
        window_width, window_height, style_color, style_background, style_stroke,
        language, settings, created_at, view_count
      ) VALUES (
        @version, @message_url, @message, @grid_size, @grid_width, @grid_height,
        @window_width, @window_height, @style_color, @style_background, @style_stroke,
        @language, @settings, @created_at, @view_count
      )
    `);

    // Migrate each message
    console.log("🔄 Migrating messages...");
    let migrated = 0;
    let skipped = 0;

    const insertMany = sqliteDb.transaction((messages: NewMessage[]) => {
      for (const msg of messages) {
        try {
          insert.run(msg);
          migrated++;
        } catch (error) {
          console.log(`  ⚠️ Skipped duplicate: ${msg.message_url}`);
          skipped++;
        }
      }
    });

    // Transform and insert
    const newMessages: NewMessage[] = oldMessages.map((old) => ({
      version: old.version || 2,
      message_url: old.message_url,
      message: old.message,
      grid_size: old.gridsize || 15,
      grid_width: old.grid_width,
      grid_height: old.grid_height,
      window_width: old.window_width,
      window_height: old.window_height,
      style_color: old.style_color || "#000000",
      style_background: old.style_background || "#ffffff",
      style_stroke: old.style_stroke || 2,
      language: old.language || "en",
      settings: old.settings,
      created_at: old.created
        ? Math.floor(new Date(old.created).getTime() / 1000)
        : Math.floor(Date.now() / 1000),
      view_count: old.opened || 0,
    }));

    insertMany(newMessages);

    // Close connections
    await connection.end();
    sqliteDb.close();

    console.log("\n✅ Migration complete!");
    console.log(`   📊 Migrated: ${migrated}`);
    console.log(`   ⏭️ Skipped (duplicates): ${skipped}`);

    // Verify
    const verifyDb = new Database(path.join(dataDir, "crytch.db"));
    const count = verifyDb
      .prepare("SELECT COUNT(*) as count FROM messages")
      .get() as { count: number };
    console.log(`   📦 Total in SQLite: ${count.count}`);
    verifyDb.close();
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();
