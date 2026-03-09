import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "No token configured" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
    );
    const data = await res.json();

    if (!res.ok) {
      console.error("[IG Token Refresh] Failed:", data);
      return NextResponse.json({ error: "Refresh failed", details: data }, { status: 500 });
    }

    console.log(`[IG Token Refresh] Success — new token expires in ${data.expires_in}s`);

    // Optionally update Vercel env var if VERCEL_TOKEN is available
    const vercelToken = process.env.VERCEL_TOKEN;
    const vercelProjectId = process.env.VERCEL_PROJECT_ID;
    if (vercelToken && vercelProjectId && data.access_token) {
      try {
        await fetch(
          `https://api.vercel.com/v10/projects/${vercelProjectId}/env`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${vercelToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              key: "INSTAGRAM_ACCESS_TOKEN",
              value: data.access_token,
              type: "encrypted",
              target: ["production", "preview", "development"],
            }),
          }
        );
        console.log("[IG Token Refresh] Updated Vercel env var");
      } catch (e) {
        console.error("[IG Token Refresh] Failed to update Vercel env:", e);
      }
    }

    return NextResponse.json({
      refreshed: true,
      expires_in: data.expires_in,
    });
  } catch (err) {
    console.error("[IG Token Refresh] Error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
