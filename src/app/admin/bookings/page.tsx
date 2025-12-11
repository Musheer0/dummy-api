"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BookingTable from "@/components/admin/booking-table";
import { Loader2 } from "lucide-react";

export default function Page() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [phone, setPhone] = useState("");
  const [id, setId] = useState("");

  async function postQuery(payload: any) {
    const res = await fetch("/api/book/query", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.json();
  }

  async function fetchAll() {
    setLoading(true);
    const data = await postQuery({ mode: "all" });
    setBookings(data.bookings || []);
    setLoading(false);
  }

  async function searchByPhone() {
    if (!phone) return fetchAll();
    setLoading(true);
    const data = await postQuery({ mode: "byPhone", phone });
    setBookings(data.bookings || []);
    setLoading(false);
  }

  async function searchById() {
    if (!id) return fetchAll();
    setLoading(true);
    const data = await postQuery({ mode: "byId", id });
    setBookings(data.booking ? [data.booking] : []);
    setLoading(false);
  }

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Booking Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search by phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="md:w-1/3"
            />
            <Button onClick={searchByPhone}>Search Phone</Button>

            <Input
              placeholder="Search by ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="md:w-1/3"
            />
            <Button onClick={searchById}>Search ID</Button>

            <Button variant="outline" onClick={fetchAll}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        <BookingTable bookings={bookings} />
      )}
    </div>
  );
}
