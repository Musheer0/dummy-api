"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Users, MapPin, Briefcase } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Labour {
  id: string;
  name: string;
  phone: string;
  skills: string[];
  exp: string;
  location: string;
}

export default function LaboursPage() {
  const [labours, setLabours] = useState<Labour[]>([]);
  const [filteredLabours, setFilteredLabours] = useState<Labour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLabours();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = labours.filter(
        (labour) =>
          labour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          labour.phone.includes(searchTerm) ||
          labour.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          labour.skills.some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
      setFilteredLabours(filtered);
    } else {
      setFilteredLabours(labours);
    }
  }, [searchTerm, labours]);

  const fetchLabours = async () => {
    try {
      const res = await fetch("/api/labours/all");
      const data = await res.json();
      if (data.success) {
        setLabours(data.labours || []);
        setFilteredLabours(data.labours || []);
      }
    } catch (err) {
      console.error("Failed to fetch labours:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Labours</h1>
        <p className="text-muted-foreground">
          View and search all registered labours
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Labours</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{labours.length}</div>
            <p className="text-xs text-muted-foreground">Registered workers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(labours.map((l) => l.location)).size}
            </div>
            <p className="text-xs text-muted-foreground">Unique locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Skills</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(labours.flatMap((l) => l.skills)).size}
            </div>
            <p className="text-xs text-muted-foreground">Unique skills</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Labours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, location, or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Labours Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Labours List ({filteredLabours.length} {filteredLabours.length === 1 ? "result" : "results"})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLabours.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground">
              No labours found
            </p>
          ) : (
            <div className="overflow-x-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Experience</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLabours.map((labour) => (
                    <TableRow key={labour.id}>
                      <TableCell className="font-medium">{labour.id}</TableCell>
                      <TableCell>{labour.name}</TableCell>
                      <TableCell>{labour.phone}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{labour.location}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {labour.skills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{labour.exp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

