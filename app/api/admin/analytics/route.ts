import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Analytic from "@/lib/models/Analytics";
import { apiSuccess, apiError } from "@/lib/utils/api";

export async function GET(_request: NextRequest) {
  try {
    await connectDB();

    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    // ── Book Now clicks – last 7 days by date ─────────────────────────
    const bookNowByDay = await Analytic.aggregate([
      { $match: { event: "book_now", createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill missing days so chart is continuous
    const days: { date: string; clicks: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const found = bookNowByDay.find((x: { _id: string; count: number }) => x._id === key);
      days.push({ date: key, clicks: found?.count ?? 0 });
    }

    // ── Book Now clicks by branch ──────────────────────────────────────
    const byBranch = await Analytic.aggregate([
      { $match: { event: "book_now" } },
      { $group: { _id: "$branch", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const branchData = byBranch
      .filter((b: { _id: string | null; count: number }) => b._id)
      .map((b: { _id: string; count: number }) => ({
        branch: b._id.charAt(0).toUpperCase() + b._id.slice(1),
        clicks: b.count,
      }));

    // ── Page views – last 30 days, top pages ─────────────────────────
    const pageViews = await Analytic.aggregate([
      { $match: { event: "page_view", createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: "$page", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);
    const pageData = pageViews.map((p: { _id: string; count: number }) => ({
      page: p._id,
      views: p.count,
    }));

    // ── Page views – last 7 days by date ─────────────────────────────
    const pageViewsByDay = await Analytic.aggregate([
      { $match: { event: "page_view", createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const visitDays: { date: string; views: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const found = pageViewsByDay.find((x: { _id: string; count: number }) => x._id === key);
      visitDays.push({ date: key, views: found?.count ?? 0 });
    }

    // ── Totals ────────────────────────────────────────────────────────
    const [totalBookNow, totalPageViews] = await Promise.all([
      Analytic.countDocuments({ event: "book_now" }),
      Analytic.countDocuments({ event: "page_view" }),
    ]);

    return apiSuccess({
      bookNowByDay: days,
      branchData,
      pageData,
      visitsByDay: visitDays,
      totalBookNow,
      totalPageViews,
    });
  } catch (error) {
    console.error("[GET /api/admin/analytics]", error);
    return apiError("Internal server error", 500);
  }
}
