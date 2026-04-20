import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/login?error=facebook_denied`);
  }

  const cookieStore = await cookies();
  const savedState = cookieStore.get("fb_oauth_state")?.value;
  const callbackUrl = cookieStore.get("fb_oauth_callback")?.value || "/dashboard";

  if (!savedState || savedState !== state) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/login?error=state_mismatch`);
  }

  // Exchange code for token
  const tokenRes = await fetch(
    `https://graph.facebook.com/v19.0/oauth/access_token?` +
    new URLSearchParams({
      client_id: process.env.FACEBOOK_APP_ID!,
      client_secret: process.env.FACEBOOK_APP_SECRET!,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/facebook/callback`,
      code,
    })
  );

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/login?error=token_failed`);
  }

  const tokenData = await tokenRes.json();

  // Get user info
  const userRes = await fetch(
    `https://graph.facebook.com/me?fields=id,first_name,last_name,email,picture&access_token=${tokenData.access_token}`
  );

  if (!userRes.ok) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/login?error=userinfo_failed`);
  }

  const fbUser = await userRes.json();

  cookieStore.delete("fb_oauth_state");
  cookieStore.delete("fb_oauth_callback");

  const params = new URLSearchParams({
    firstName: fbUser.first_name || "Utilisateur",
    lastName: fbUser.last_name || "",
    email: fbUser.email || `fb_${fbUser.id}@facebook.com`,
    avatar: fbUser.picture?.data?.url || "",
    callback: callbackUrl,
  });

  return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/google-success?${params}`);
}
