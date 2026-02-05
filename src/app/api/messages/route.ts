import { NextRequest, NextResponse } from "next/server";
import { db, messages } from "@/lib/db";
import { createHash } from "crypto";

/**
 * Generate a unique message URL using MD5 hash
 */
function generateMessageUrl(): string {
  const prefix = Math.floor(Math.random() * 100000);
  const uniqueId = `${Date.now()}-${prefix}`;
  return createHash("md5").update(uniqueId).digest("hex");
}

/**
 * POST /api/messages
 * Save a new encrypted message
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      message,
      gridSize = 15,
      gridWidth,
      gridHeight,
      windowWidth,
      windowHeight,
      styleColor = "#000000",
      styleBackground = "#ffffff",
      styleStroke = 2,
      language = "en",
      bounds,
    } = body;

    if (!message) {
      return NextResponse.json(
        { status: "error", error: "No message provided" },
        { status: 400 }
      );
    }

    const messageUrl = generateMessageUrl();
    const settings = bounds ? JSON.stringify(bounds) : null;

    await db.insert(messages).values({
      messageUrl,
      message,
      gridSize,
      gridWidth,
      gridHeight,
      windowWidth,
      windowHeight,
      styleColor,
      styleBackground,
      styleStroke,
      language,
      settings,
      version: 2,
    });

    return NextResponse.json({
      status: "success",
      url: `/m/${messageUrl}`,
    });
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json(
      { status: "error", error: "Failed to save message" },
      { status: 500 }
    );
  }
}
