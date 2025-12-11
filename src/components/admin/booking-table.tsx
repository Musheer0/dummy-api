import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function BookingTable({ bookings }: { bookings: any[] }) {
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
                {b.labours?.map((l: any) => (
                  <div key={l.phone_number}>
                    {l.name} ({l.phone_number})
                  </div>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
