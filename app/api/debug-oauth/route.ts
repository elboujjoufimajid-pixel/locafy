import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID || "NOT SET";
  return NextResponse.json({
    clientId_preview: clientId.substring(0, 30) + "...",
    clientId_length: clientId.length,
    nextauth_url: process.env.NEXTAUTH_URL,
  });
}
