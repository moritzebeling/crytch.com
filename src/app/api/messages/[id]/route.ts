import { NextRequest, NextResponse } from "next/server";
import { db, messages } from "@/lib/db";
import { eq, sql } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/messages/[id]
 * Fetch a message by URL and increment view count
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Find the message
    const result = await db
      .select()
      .from(messages)
      .where(eq(messages.messageUrl, id))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { status: "error", error: "Message not found" },
        { status: 404 }
      );
    }

    const message = result[0];

    // Increment view count
    await db
      .update(messages)
      .set({ viewCount: sql`${messages.viewCount} + 1` })
      .where(eq(messages.messageUrl, id));

    return NextResponse.json({
      status: "success",
      data: {
        id: message.id,
        version: message.version,
        messageUrl: message.messageUrl,
        message: message.message,
        gridSize: message.gridSize,
        gridWidth: message.gridWidth,
        gridHeight: message.gridHeight,
        windowWidth: message.windowWidth,
        windowHeight: message.windowHeight,
        styleColor: message.styleColor,
        styleBackground: message.styleBackground,
        styleStroke: message.styleStroke,
        language: message.language,
        settings: message.settings,
        createdAt: message.createdAt,
        viewCount: (message.viewCount || 0) + 1,
      },
    });
  } catch (error) {
    console.error("Error fetching message:", error);
    return NextResponse.json(
      { status: "error", error: "Failed to fetch message" },
      { status: 500 }
    );
  }
}
