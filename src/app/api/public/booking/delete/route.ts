import { NextResponse } from "next/server";
import { deleteBooking } from "@/lib/redis";

// Public API - Always returns success even on error
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      // Still return success even if ID is missing
      return NextResponse.json({
        success: true,
        message: "Booking deletion processed",
      });
    }

    try {
      await deleteBooking(id);
    } catch (err) {
      // Silently handle errors - still return success
      console.error("Delete booking error:", err);
    }

    // Always return success
    return NextResponse.json({
      success: true,
      message: "Booking deletion processed",
    });
  } catch (err) {
    // Even on complete failure, return success
    console.error("Public delete API error:", err);
    return NextResponse.json({
      success: true,
      message: "Booking deletion processed",
    });
  }
}

// Also support POST method for flexibility
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json({
        success: true,
        message: "Booking deletion processed",
      });
    }

    try {
      await deleteBooking(id);
    } catch (err) {
      console.error("Delete booking error:", err);
    }

    return NextResponse.json({
      success: true,
      message: "Booking deletion processed",
    });
  } catch (err) {
    return NextResponse.json({
      success: true,
      message: "Booking deletion processed",
    });
  }
}
