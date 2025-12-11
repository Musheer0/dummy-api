import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import {
  getAllBookings,
  getBookingById,
  getBookingsByPhone,
  addBooking,
  updateBooking,
} from "@/lib/redis";

// ===============================
// GET HANDLER (ALL IN ONE)
// ===============================
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const phone = url.searchParams.get("phone");

    // --- Get by ID ---
    if (id) {
      const booking = await getBookingById(id);
      if (!booking) {
        return NextResponse.json(
          { success: false, message: "Booking not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, booking });
    }

    // --- Get by phone ---
    if (phone) {
      const filtered = await getBookingsByPhone(phone);
      return NextResponse.json({
        success: true,
        count: filtered.length,
        bookings: filtered,
      });
    }

    // --- Return all ---
    const bookings = await getAllBookings();
    return NextResponse.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (err) {
    console.error("GET bookings error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// ===============================
// POST HANDLER (QUERY MODES)
// ===============================
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const bookings = await getAllBookings();

    // QUERY MODE: all
    if (body.mode === "all") {
      return NextResponse.json({
        success: true,
        count: bookings.length,
        bookings,
      });
    }

    // QUERY MODE: byPhone
    if (body.mode === "byPhone" && body.phone) {
      const filtered = await getBookingsByPhone(body.phone);
      return NextResponse.json({
        success: true,
        count: filtered.length,
        bookings: filtered,
      });
    }

    // QUERY MODE: byId
    if (body.mode === "byId" && body.id) {
      const booking = await getBookingById(body.id);
      if (!booking) {
        return NextResponse.json(
          { success: false, message: "Booking not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        booking,
      });
    }

    // EDIT MODE (if id is provided without mode)
    if (body.id) {
      const updated = await updateBooking(body.id, body);
      if (!updated) {
        return NextResponse.json(
          { success: false, message: "Booking not found for update" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Booking updated",
        booking: updated,
      });
    }

    // CREATE MODE
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
    console.error("POST bookings error:", err);
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }
}
