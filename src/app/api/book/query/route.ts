import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "bookings.json");

function readBookings() {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw || "[]");
}

function writeBookings(data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ===============================
// GET HANDLER (ALL IN ONE)
// ===============================
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const phone = url.searchParams.get("phone");

  const bookings = readBookings();

  // --- Get by ID ---
  if (id) {
    const booking = bookings.find((b: any) => b.id === id);
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
    const filtered = bookings.filter(
      (b: any) => b.phone_number === phone
    );
    return NextResponse.json({
      success: true,
      count: filtered.length,
      bookings: filtered,
    });
  }

  // --- Return all ---
  return NextResponse.json({
    success: true,
    count: bookings.length,
    bookings,
  });
}

// ===============================
// POST HANDLER (QUERY MODES)
// ===============================
export async function POST(req: Request) {
  try {
    const body = await req.json();
    let bookings = readBookings();

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
      const filtered = bookings.filter(
        (b: any) => b.phone_number === body.phone
      );
      return NextResponse.json({
        success: true,
        count: filtered.length,
        bookings: filtered,
      });
    }

    // QUERY MODE: byId
    if (body.mode === "byId" && body.id) {
      const booking = bookings.find((b: any) => b.id === body.id);
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
      const idx = bookings.findIndex((b: any) => b.id === body.id);
      if (idx === -1) {
        return NextResponse.json(
          { success: false, message: "Booking not found for update" },
          { status: 404 }
        );
      }

      bookings[idx] = { ...bookings[idx], ...body };
      writeBookings(bookings);

      return NextResponse.json({
        success: true,
        message: "Booking updated",
        booking: bookings[idx],
      });
    }

    // CREATE MODE
    const newBooking = {
      id: randomUUID(),
      ...body,
    };

    bookings.push(newBooking);
    writeBookings(bookings);

    return NextResponse.json({
      success: true,
      message: "Booking created",
      booking: newBooking,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }
}
