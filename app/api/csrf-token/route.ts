import { NextRequest, NextResponse } from "next/server";
import { generateCSRFToken, setCSRFCookie } from "@/lib/csrf";

export async function GET(request: NextRequest) {
  try {
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
    console.error("[v0] CSRF token generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate CSRF token" },
      { status: 500 }
    );
  }
}
