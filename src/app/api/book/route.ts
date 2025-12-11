import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import {
  getAllBookings,
  addBooking,
  updateBooking,
} from "@/lib/redis";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // If editing
    if (body.id) {
      const updated = await updateBooking(body.id, body);

      if (!updated) {
        return NextResponse.json(
          { success: false, message: "Booking not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Booking updated",
        booking: updated,
      });
    }

    // New booking
    const newBooking = {
      id: randomUUID(),
      ...body,
    };

    const created = await addBooking(newBooking);
    if (!created) {
      return NextResponse.json(
        { success: false, message: "Failed to create booking" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Booking created",
      booking: newBooking,
    });
  } catch (err) {
    console.error("Booking router error:", err);
    return NextResponse.json(
      { success: false, message: "Invalid booking data" },
      { status: 400 }
    );
  }
}
