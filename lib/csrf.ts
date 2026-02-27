import crypto from "crypto";
import { cookies, headers } from "next/headers";

export async function generateCSRFToken() {
  const token = crypto.randomBytes(32).toString("hex");
  return token;
}

export async function setCSRFCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("csrf_token", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export async function verifyCSRFToken(token: string): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("csrf_token")?.value;

  if (!token || !cookieToken) {
    return false;
  }

  return token === cookieToken;
}

export async function getClientIP(): Promise<string> {
  const headersList = await headers();
  return (
    headersList.get("x-forwarded-for")?.split(",")[0] ||
    headersList.get("x-real-ip") ||
    "unknown"
  );
}
