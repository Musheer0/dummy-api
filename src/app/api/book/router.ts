import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "bookings.json");

function readBookings() {
  // If missing, create an empty JSON file like a civilized backend
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true }) // ensure folder exists
    fs.writeFileSync(filePath, "[]", "utf8")
    return []
  }

  // Otherwise read normally
  const data = fs.readFileSync(filePath, "utf8")
  try {
    return JSON.parse(data || "[]")
  } catch {
    // If file gets corrupted because life sucks
    return []
  }
}

function writeBookings(data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    let bookings = readBookings();

    // If editing
    if (body.id) {
      const idx = bookings.findIndex((b: any) => b.id === body.id);

      if (idx === -1) {
        return NextResponse.json(
          { success: false, message: "Booking not found" },
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

    // New booking
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
    console.log('e')
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Invalid booking data" },
      { status: 400 }
    );
  }
}
