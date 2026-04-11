import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/login?error=google_denied`);
  }

  const cookieStore = await cookies();
  const savedState = cookieStore.get("google_oauth_state")?.value;
  const callbackUrl = cookieStore.get("google_oauth_callback")?.value || "/dashboard";

  if (!savedState || savedState !== state) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/login?error=state_mismatch`);
  }

  // Exchange code for token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/google/callback`,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/login?error=token_failed`);
  }

  const tokenData = await tokenRes.json();

  // Get user info
  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  if (!userRes.ok) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/login?error=userinfo_failed`);
  }

  const googleUser = await userRes.json();

  // Clear state cookies
  cookieStore.delete("google_oauth_state");
  cookieStore.delete("google_oauth_callback");

  // Redirect to success page with user data
  const params = new URLSearchParams({
    firstName: googleUser.given_name || googleUser.name?.split(" ")[0] || "Utilisateur",
    lastName: googleUser.family_name || googleUser.name?.split(" ").slice(1).join(" ") || "",
    email: googleUser.email || "",
    avatar: googleUser.picture || "",
    callback: callbackUrl,
  });

  return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/google-success?${params}`);
}
