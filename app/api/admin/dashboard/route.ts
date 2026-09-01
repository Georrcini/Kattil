import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import City from "@/lib/models/City";
import Room from "@/lib/models/Room";
import Gallery from "@/lib/models/Gallery";
import Amenity from "@/lib/models/Amenity";
import KanbanTask from "@/lib/models/Kanban";
import Media from "@/lib/models/Media";
import Blog from "@/lib/models/Blog";
import Faq from "@/lib/models/Faq";
import { apiSuccess, apiError } from "@/lib/utils/api";

export async function GET(_request: NextRequest) {
  try {
    await connectDB();

    const [
      totalRooms,
      activeRooms,
      totalCities,
      amenitiesCount,
      galleryCount,
      mediaCount,
      blogsCount,
      publishedBlogsCount,
      faqsCount,
      kanbanTodo,
      kanbanInProgress,
      kanbanReview,
      kanbanCompleted,
      recentRooms,
      recentGallery,
      roomCategories,
    ] = await Promise.all([
      Room.countDocuments(),
      Room.countDocuments({ status: "active" }),
      City.countDocuments({ active: true }),
      Amenity.countDocuments({ visible: true }),
      Gallery.countDocuments(),
      Media.countDocuments(),
      Blog.countDocuments(),
      Blog.countDocuments({ status: "published" }),
      Faq.countDocuments({ status: "active" }),
      KanbanTask.countDocuments({ column: "todo" }),
      KanbanTask.countDocuments({ column: "in-progress" }),
      KanbanTask.countDocuments({ column: "review" }),
      KanbanTask.countDocuments({ column: "completed" }),
      Room.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("city", "name")
        .select("name status city slug"),
      Gallery.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .select("src alt category"),
      Room.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    return apiSuccess({
      totalRooms,
      activeRooms,
      totalCities,
      amenitiesCount,
      galleryCount,
      mediaCount,
      blogsCount,
      publishedBlogsCount,
      faqsCount,
      kanbanStats: {
        todo: kanbanTodo,
        inProgress: kanbanInProgress,
        review: kanbanReview,
        completed: kanbanCompleted,
      },
      roomCategories: roomCategories.map((r: { _id: string; count: number }) => ({
        name: r._id ? r._id.charAt(0).toUpperCase() + r._id.slice(1) : "Unknown",
        value: r.count,
      })),
      cmsModules: [
        { module: "Rooms", count: totalRooms },
        { module: "Blogs", count: blogsCount },
        { module: "Gallery", count: galleryCount },
        { module: "FAQs", count: faqsCount },
        { module: "Amenities", count: amenitiesCount },
        { module: "Media", count: mediaCount },
      ],
      recentRooms,
      recentGallery,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[GET /api/admin/dashboard]", error);
    return apiError("Internal server error", 500);
  }
}
