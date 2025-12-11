"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface BookingTableProps {
  bookings: any[];
  onDelete?: () => void;
}

export default function BookingTable({ bookings, onDelete }: BookingTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/book/delete?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Booking deleted successfully");
        if (onDelete) {
          onDelete();
        }
      } else {
        toast.error(data.message || "Failed to delete booking");
      }
    } catch (err) {
      toast.error("An error occurred while deleting the booking");
    } finally {
      setDeletingId(null);
    }
  };

  if (!bookings.length)
    return <p className="text-center py-10 text-muted-foreground">No bookings found</p>;

  return (
    <div className="overflow-x-auto border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Task</TableHead>
            <TableHead>Count</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Labours</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {bookings.map((b) => (
            <TableRow key={b.id}>
              <TableCell className="font-medium">{b.id}</TableCell>
              <TableCell>{b.name}</TableCell>
              <TableCell>{b.phone_number}</TableCell>
              <TableCell>{b.task}</TableCell>
              <TableCell>{b.count}</TableCell>
              <TableCell>{b.booking_date}</TableCell>
              <TableCell>
                {b.labours?.map((l: any, idx: number) => (
                  <div key={idx} className="text-sm">
                    {l.name} ({l.phone_number})
                  </div>
                ))}
              </TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      disabled={deletingId === b.id}
                    >
                      {deletingId === b.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete
                        the booking for {b.name} (ID: {b.id}).
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(b.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
