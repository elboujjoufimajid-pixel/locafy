import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const [listingsRes, membersRes, reservationsRes] = await Promise.all([
      supabase.from("listings").select("id, status, price_per_day"),
      supabase.from("members").select("id, role, joined_at"),
      supabase.from("reservations").select("id, status, total, created_at, listing_title, guest, start_date, end_date, guest_email"),
    ]);

    const listings = listingsRes.data || [];
    const members = membersRes.data || [];
    const reservations = reservationsRes.data || [];

    const confirmedRevenue = reservations
      .filter((r) => r.status === "confirmed")
      .reduce((sum, r) => sum + (Number(r.total) || 0), 0);

    // This month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const thisMonthRevenue = reservations
      .filter((r) => r.status === "confirmed" && r.created_at >= monthStart)
      .reduce((sum, r) => sum + (Number(r.total) || 0), 0);

    const thisMonthReservations = reservations.filter((r) => r.created_at >= monthStart).length;
    const thisMonthMembers = members.filter((m) => m.joined_at >= monthStart).length;

    return NextResponse.json({
      listings: {
        total: listings.length,
        approved: listings.filter((l) => l.status === "approved").length,
        pending: listings.filter((l) => l.status === "pending").length,
        rejected: listings.filter((l) => l.status === "rejected").length,
      },
      members: {
        total: members.length,
        owners: members.filter((m) => m.role === "owner").length,
        clients: members.filter((m) => m.role === "client").length,
        thisMonth: thisMonthMembers,
      },
      reservations: {
        total: reservations.length,
        confirmed: reservations.filter((r) => r.status === "confirmed").length,
        pending: reservations.filter((r) => r.status === "pending").length,
        cancelled: reservations.filter((r) => r.status === "cancelled").length,
        thisMonth: thisMonthReservations,
      },
      revenue: {
        total: confirmedRevenue,
        thisMonth: thisMonthRevenue,
      },
      recentReservations: reservations
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 6)
        .map((r) => ({
          id: r.id,
          listingTitle: r.listing_title,
          guest: r.guest,
          guestEmail: r.guest_email,
          startDate: r.start_date,
          endDate: r.end_date,
          total: r.total,
          status: r.status,
        })),
    });
  } catch {
    return NextResponse.json({
      listings: { total: 0, approved: 0, pending: 0, rejected: 0 },
      members: { total: 0, owners: 0, clients: 0, thisMonth: 0 },
      reservations: { total: 0, confirmed: 0, pending: 0, cancelled: 0, thisMonth: 0 },
      revenue: { total: 0, thisMonth: 0 },
      recentReservations: [],
    });
  }
}
