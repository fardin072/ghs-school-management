import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Search } from "lucide-react";
import { useState, useEffect } from "react";

// Simple mock data
const mockStudents = [
  {
    id: "1",
    rollNo: "001",
    name: "John Doe",
    fatherName: "Robert Doe",
    class: "10",
    section: "A",
    gender: "Male",
    phoneNumber: "+91 9876543210",
  },
  {
    id: "2",
    rollNo: "002",
    name: "Jane Smith",
    fatherName: "Michael Smith",
    class: "10",
    section: "A",
    gender: "Female",
    phoneNumber: "+91 9876543211",
  },
];

export default function StudentsSimple() {
  const [students, setStudents] = useState(mockStudents);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.includes(searchTerm),
  );

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Students"
        subtitle="Manage student records and information"
      >
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </DashboardHeader>

      <div className="p-8 space-y-6">
        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or roll number..."
                className="pl-10"
              />
            </div>
            <div className="mt-4">
              <Badge variant="outline">
                Total: {filteredStudents.length} students
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        <Card>
          <CardHeader>
            <CardTitle>Student Records</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredStudents.length > 0 ? (
              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-gray-500">
                        Roll No: {student.rollNo} | Class: {student.class}-
                        {student.section}
                      </div>
                      <div className="text-sm text-gray-500">
                        Father: {student.fatherName} | Phone:{" "}
                        {student.phoneNumber}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          student.gender === "Male" ? "default" : "secondary"
                        }
                      >
                        {student.gender}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2">
                  No Students Found
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "No students match your search criteria."
                    : "No students have been added yet."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
