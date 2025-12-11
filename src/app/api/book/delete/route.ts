import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "bookings.json");

function readBookings() {
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

function writeBookings(data: any) {
  // Ensure directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Booking ID is required" },
        { status: 400 }
      );
    }

    let bookings = readBookings();
    const initialLength = bookings.length;
    
    bookings = bookings.filter((b: any) => b.id !== id);

    if (bookings.length === initialLength) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    writeBookings(bookings);

    return NextResponse.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (err) {
    console.error("Delete booking error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to delete booking" },
      { status: 500 }
    );
  }
}

