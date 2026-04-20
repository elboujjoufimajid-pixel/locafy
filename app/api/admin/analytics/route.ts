import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data: all } = await supabase
      .from("visitors")
      .select("*")
      .gte("visited_at", monthAgo)
      .order("visited_at", { ascending: false });

    const visitors = all || [];

    const todayCount = visitors.filter((v) => v.visited_at >= today).length;
    const weekCount = visitors.filter((v) => v.visited_at >= weekAgo).length;
    const monthCount = visitors.length;

    // Top pages
    const pageCounts: Record<string, number> = {};
    visitors.forEach((v) => {
      pageCounts[v.page] = (pageCounts[v.page] || 0) + 1;
    });
    const topPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([page, views]) => ({ page, views }));

    // Cities
    const cityCounts: Record<string, number> = {};
    visitors.forEach((v) => {
      if (v.city) cityCounts[v.city] = (cityCounts[v.city] || 0) + 1;
    });
    const cities = Object.entries(cityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([city, users]) => ({ city, users }));

    // Countries
    const countryCounts: Record<string, number> = {};
    visitors.forEach((v) => {
      if (v.country) countryCounts[v.country] = (countryCounts[v.country] || 0) + 1;
    });
    const countries = Object.entries(countryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([country, users]) => ({ country, users }));

    // Devices
    const mobileCnt = visitors.filter((v) => v.device === "Mobile").length;
    const desktopCnt = visitors.filter((v) => v.device === "Desktop").length;

    // Last 7 days chart
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
      const label = d.toLocaleDateString("fr-MA", { weekday: "short" });
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
      const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).toISOString();
      const count = visitors.filter((v) => v.visited_at >= start && v.visited_at < end).length;
      return { label, count };
    });

    // Recent visitors
    const recent = visitors.slice(0, 10).map((v) => ({
      page: v.page,
      city: v.city,
      country: v.country,
      device: v.device,
      visitedAt: v.visited_at,
    }));

    return NextResponse.json({
      today: todayCount,
      week: weekCount,
      month: monthCount,
      topPages,
      cities,
      countries,
      devices: { mobile: mobileCnt, desktop: desktopCnt },
      days,
      recent,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
