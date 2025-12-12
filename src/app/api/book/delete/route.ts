import { NextResponse, NextRequest } from "next/server";
import { deleteBooking } from "@/lib/redis";

// Shared param reader
async function getParams(req: NextRequest) {
  const url = new URL(req.url);

  let id = url.searchParams.get("id");
  let body: any = {};

  try {
    body = await req.json();
  } catch (_) {}

  id ||= body.id;

  return { id };
}

// ----------------------------------
// DELETE METHOD
// ----------------------------------
export async function DELETE(req: NextRequest) {
  return handleDelete(req);
}

// ----------------------------------
// POST METHOD (acts like DELETE)
// ----------------------------------
export async function POST(req: NextRequest) {
  return handleDelete(req);
}

// ----------------------------------
// THE ACTUAL LOGIC (shared)
// ----------------------------------
async function handleDelete(req: NextRequest) {
  try {
    const { id } = await getParams(req);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Booking ID is required" },
        { status: 400 }
      );
    }

    const deleted = await deleteBooking(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Booking not found or failed to delete" },
        { status: 404 }
      );
    }

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