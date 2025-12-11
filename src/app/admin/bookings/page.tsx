"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BookingTable from "@/components/admin/booking-table";
import { Loader2, BookOpen, Calendar, Users, TrendingUp } from "lucide-react";

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

  // Calculate statistics
  const totalBookings = bookings.length;
  const totalLabourAssignments = bookings.reduce(
    (sum, b) => sum + (b.labours?.length || 0),
    0
  );
  
  const now = new Date();
  const recentBookings = bookings.filter((b) => {
    if (!b.booking_date) return false;
    const bookingDate = new Date(b.booking_date);
    const diffTime = Math.abs(now.getTime() - bookingDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;

  const taskCounts: Record<string, number> = {};
  bookings.forEach((b) => {
    const task = b.task || "Unknown";
    taskCounts[task] = (taskCounts[task] || 0) + 1;
  });

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <p className="text-muted-foreground">
          Manage and search all bookings
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">All bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentBookings}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Labour Assignments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLabourAssignments}</div>
            <p className="text-xs text-muted-foreground">Total assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task Types</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(taskCounts).length}</div>
            <p className="text-xs text-muted-foreground">Unique tasks</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Bookings</CardTitle>
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
        <BookingTable bookings={bookings} onDelete={fetchAll} />
      )}
    </div>
  );
}
