import { NextResponse } from "next/server";
import { getAllBookings } from "@/lib/redis";
import { LABOURS } from "../../labours/all/route";

export async function GET() {
  try {
    const bookings = await getAllBookings();
    const labours = LABOURS;

    // Calculate statistics
    const totalLabours = labours.length;
    const totalBookings = bookings.length;
    
    // Skills distribution
    const skillsCount: Record<string, number> = {};
    labours.forEach((labour) => {
      labour.skills.forEach((skill) => {
        skillsCount[skill] = (skillsCount[skill] || 0) + 1;
      });
    });

    // Experience distribution
    const expDistribution: Record<string, number> = {};
    labours.forEach((labour) => {
      const exp = labour.exp;
      expDistribution[exp] = (expDistribution[exp] || 0) + 1;
    });

    // Location distribution
    const locationCount: Record<string, number> = {};
    labours.forEach((labour) => {
      locationCount[labour.location] = (locationCount[labour.location] || 0) + 1;
    });

    // Booking statistics
    const totalLabourBookings = bookings.reduce((sum, booking) => {
      return sum + (booking.labours?.length || 0);
    }, 0);

    const taskDistribution: Record<string, number> = {};
    bookings.forEach((booking) => {
      const task = booking.task || "Unknown";
      taskDistribution[task] = (taskDistribution[task] || 0) + 1;
    });

    // Recent bookings (last 7 days)
    const now = new Date();
    const recentBookings = bookings.filter((booking) => {
      if (!booking.booking_date) return false;
      const bookingDate = new Date(booking.booking_date);
      const diffTime = Math.abs(now.getTime() - bookingDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }).length;

    return NextResponse.json({
      success: true,
      stats: {
        totalLabours,
        totalBookings,
        totalLabourBookings,
        recentBookings,
        skillsDistribution: Object.entries(skillsCount).map(([name, value]) => ({
          name,
          value,
        })),
        experienceDistribution: Object.entries(expDistribution).map(([name, value]) => ({
          name,
          value,
        })),
        locationDistribution: Object.entries(locationCount).map(([name, value]) => ({
          name,
          value,
        })),
        taskDistribution: Object.entries(taskDistribution).map(([name, value]) => ({
          name,
          value,
        })),
      },
    });
  } catch (err) {
    console.error("Stats API error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
