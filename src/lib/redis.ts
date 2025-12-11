import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

const BOOKINGS_KEY = "bookings";

export async function getAllBookings() {
  try {
    const data = await redis.get(BOOKINGS_KEY);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Redis get error:", error);
    return [];
  }
}

export async function saveBookings(bookings: any[]) {
  try {
    await redis.set(BOOKINGS_KEY, bookings);
    return true;
  } catch (error) {
    console.error("Redis set error:", error);
    return false;
  }
}

export async function getBookingById(id: string) {
  try {
    const bookings = await getAllBookings();
    return bookings.find((b: any) => b.id === id) || null;
  } catch (error) {
    console.error("Redis get booking by id error:", error);
    return null;
  }
}

export async function getBookingsByPhone(phone: string) {
  try {
    const bookings = await getAllBookings();
    return bookings.filter((b: any) => b.phone_number === phone);
  } catch (error) {
    console.error("Redis get bookings by phone error:", error);
    return [];
  }
}

export async function addBooking(booking: any) {
  try {
    const bookings = await getAllBookings();
    bookings.push(booking);
    await saveBookings(bookings);
    return booking;
  } catch (error) {
    console.error("Redis add booking error:", error);
    return null;
  }
}

export async function updateBooking(id: string, updates: any) {
  try {
    const bookings = await getAllBookings();
    const index = bookings.findIndex((b: any) => b.id === id);
    if (index === -1) return null;
    
    bookings[index] = { ...bookings[index], ...updates };
    await saveBookings(bookings);
    return bookings[index];
  } catch (error) {
    console.error("Redis update booking error:", error);
    return null;
  }
}

export async function deleteBooking(id: string) {
  try {
    const bookings = await getAllBookings();
    const filtered = bookings.filter((b: any) => b.id !== id);
    await saveBookings(filtered);
    return true;
  } catch (error) {
    console.error("Redis delete booking error:", error);
    return false;
  }
}

export { redis };

