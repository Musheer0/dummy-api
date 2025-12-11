import { NextResponse, NextRequest } from "next/server";
import { randomUUID } from "crypto";
import {
  getAllBookings,
  getBookingById,
  getBookingsByPhone,
  addBooking,
  updateBooking,
} from "@/lib/redis";

// -------------------------------------
// ⭐ Helper: read from URL OR body
// -------------------------------------
async function getParams(req: NextRequest) {
  const url = new URL(req.url);

  // URL values
  let id = url.searchParams.get("id");
  let phone = url.searchParams.get("phone");

  // Body values (if provided)
  let body: any = {};
  try {
    body = await req.json();
  } catch (_) {}

  id ||= body.id;
  phone ||= body.phone;

  return { id, phone, body };
}

// ===============================
// GET HANDLER
// ===============================
export async function GET(req: NextRequest) {
  try {
    const { id, phone } = await getParams(req);

    // Get by ID
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

    // Get by phone
    if (phone) {
      const filtered = await getBookingsByPhone(phone);
      return NextResponse.json({
        success: true,
        count: filtered.length,
        bookings: filtered,
      });
    }

    // Get all
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
// POST HANDLER
// ===============================
export async function POST(req: NextRequest) {
  try {
    const { id, phone, body } = await getParams(req);

    // MODE: all
    if (body.mode === "all") {
      const bookings = await getAllBookings();
      return NextResponse.json({
        success: true,
        count: bookings.length,
        bookings,
      });
    }

    // MODE: byPhone
    if (body.mode === "byPhone" && phone) {
      const filtered = await getBookingsByPhone(phone);
      return NextResponse.json({
        success: true,
        count: filtered.length,
        bookings: filtered,
      });
    }

    // MODE: byId
    if (body.mode === "byId" && id) {
      const booking = await getBookingById(id);
      if (!booking) {
        return NextResponse.json(
          { success: false, message: "Booking not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, booking });
    }

    // UPDATE mode (if ID exists)
    if (id) {
      const updated = await updateBooking(id, body);

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

    // CREATE mode
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