import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

// POST /api/book
export async function POST(req: Request) {
  try {
    // parse body
    const body = await req.json();

    // generate uuid
    const bookingId = randomUUID();

    return NextResponse.json({
      success: true,
      bookingId,
      data: body,
      message: "Booking successful 🎉",
    });
  } catch (err) {
    console.error("Request body issue:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Bro what did you send? My server is crying.",
      },
      { status: 400 }
    );
  }
}
