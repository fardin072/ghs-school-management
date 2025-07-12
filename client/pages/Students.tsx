import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Loader2,
  Filter,
  UserPlus,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { studentsApi, classSectionsApi } from "@/lib/api";
import { Student, ClassSection, CreateStudentRequest } from "@shared/types";

export default function Students() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [students, setStudents] = useState<Student[]>([]);
  const [classSections, setClassSections] = useState<ClassSection[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [formData, setFormData] = useState<CreateStudentRequest>({
    rollNo: "",
    name: "",
    fatherName: "",
    motherName: "",
    class: "",
    section: "",
    dateOfBirth: "",
    address: "",
    phoneNumber: "",
    gender: "Male",
    bloodGroup: "",
    email: "",
  });

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Filter students when search/filter criteria change
  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, selectedClass, selectedSection]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [studentsRes, classSectionsRes] = await Promise.all([
        studentsApi.getAll(),
        classSectionsApi.getAll(),
      ]);

      if (studentsRes.success) setStudents(studentsRes.data);
      if (classSectionsRes.success) setClassSections(classSectionsRes.data);
    } catch (error) {
      toast.error("Failed to load data");
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          s.rollNo.includes(term) ||
          s.fatherName.toLowerCase().includes(term),
      );
    }

    if (selectedClass) {
      filtered = filtered.filter((s) => s.class === selectedClass);
    }

    if (selectedSection) {
      filtered = filtered.filter((s) => s.section === selectedSection);
    }

    setFilteredStudents(filtered);
  };

  const resetForm = () => {
    setFormData({
      rollNo: "",
      name: "",
      fatherName: "",
      motherName: "",
      class: "",
      section: "",
      dateOfBirth: "",
      address: "",
      phoneNumber: "",
      gender: "Male",
      bloodGroup: "",
      email: "",
    });
  };

  const handleAddStudent = async () => {
    if (!formData.name || !formData.rollNo || !formData.class) {
      toast.error("Please fill in required fields");
      return;
    }

    setSaving(true);
    try {
      const response = await studentsApi.create(formData);

      if (response.success) {
        toast.success("Student added successfully!");
        setStudents((prev) => [...prev, response.data]);
        setIsAddDialogOpen(false);
        resetForm();
      } else {
        toast.error(response.error || "Failed to add student");
      }
    } catch (error) {
      toast.error("Error adding student");
      console.error("Error adding student:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleEditStudent = async () => {
    if (!editingStudent) return;

    setSaving(true);
    try {
      const response = await studentsApi.update(editingStudent.id, formData);

      if (response.success) {
        toast.success("Student updated successfully!");
        setStudents((prev) =>
          prev.map((s) => (s.id === editingStudent.id ? response.data : s)),
        );
        setIsEditDialogOpen(false);
        setEditingStudent(null);
        resetForm();
      } else {
        toast.error(response.error || "Failed to update student");
      }
    } catch (error) {
      toast.error("Error updating student");
      console.error("Error updating student:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    setDeleting(studentId);
    try {
      const response = await studentsApi.delete(studentId);

      if (response.success) {
        toast.success("Student deleted successfully!");
        setStudents((prev) => prev.filter((s) => s.id !== studentId));
      } else {
        toast.error(response.error || "Failed to delete student");
      }
    } catch (error) {
      toast.error("Error deleting student");
      console.error("Error deleting student:", error);
    } finally {
      setDeleting(null);
    }
  };

  const openEditDialog = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      rollNo: student.rollNo,
      name: student.name,
      fatherName: student.fatherName,
      motherName: student.motherName,
      class: student.class,
      section: student.section,
      dateOfBirth: student.dateOfBirth,
      address: student.address,
      phoneNumber: student.phoneNumber,
      gender: student.gender,
      bloodGroup: student.bloodGroup || "",
      email: student.email || "",
    });
    setIsEditDialogOpen(true);
  };

  const StudentForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rollNo">Roll Number *</Label>
          <Input
            id="rollNo"
            value={formData.rollNo}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, rollNo: e.target.value }))
            }
            placeholder="0001"
            disabled={isEdit} // Roll number shouldn't be editable
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Student Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Student Name"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fatherName">Father's Name</Label>
          <Input
            id="fatherName"
            value={formData.fatherName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fatherName: e.target.value }))
            }
            placeholder="Father's Name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="motherName">Mother's Name</Label>
          <Input
            id="motherName"
            value={formData.motherName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, motherName: e.target.value }))
            }
            placeholder="Mother's Name"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="class">Class *</Label>
          <Select
            value={formData.class}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, class: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classSections.map((cs) => (
                <SelectItem key={`${cs.class}`} value={cs.class}>
                  Class {cs.class}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="section">Section *</Label>
          <Select
            value={formData.section}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, section: value }))
            }
            disabled={!formData.class}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              {classSections
                .filter((cs) => cs.class === formData.class)
                .map((cs) => (
                  <SelectItem key={cs.section} value={cs.section}>
                    Section {cs.section}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={formData.gender}
            onValueChange={(value: "Male" | "Female") =>
              setFormData((prev) => ({ ...prev, gender: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bloodGroup">Blood Group</Label>
          <Select
            value={formData.bloodGroup}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, bloodGroup: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <SelectItem key={bg} value={bg}>
                  {bg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, address: e.target.value }))
          }
          placeholder="Full Address"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))
            }
            placeholder="+91 9876543210"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email (Optional)</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="student@email.com"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            if (isEdit) {
              setIsEditDialogOpen(false);
              setEditingStudent(null);
            } else {
              setIsAddDialogOpen(false);
            }
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={isEdit ? handleEditStudent : handleAddStudent}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <>{isEdit ? "Update" : "Add"} Student</>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Students"
        subtitle="Manage student records and information"
      >
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Add New Student
              </DialogTitle>
            </DialogHeader>
            <StudentForm />
          </DialogContent>
        </Dialog>
      </DashboardHeader>

      <div className="p-8 space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Search & Filter Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, roll no..."
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="filterClass">Filter by Class</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="All classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Classes</SelectItem>
                    {classSections.map((cs) => (
                      <SelectItem key={`${cs.class}`} value={cs.class}>
                        Class {cs.class}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="filterSection">Filter by Section</Label>
                <Select
                  value={selectedSection}
                  onValueChange={setSelectedSection}
                  disabled={!selectedClass}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All sections" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Sections</SelectItem>
                    {classSections
                      .filter((cs) => cs.class === selectedClass)
                      .map((cs) => (
                        <SelectItem key={cs.section} value={cs.section}>
                          Section {cs.section}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedClass("");
                      setSelectedSection("");
                    }}
                    className="flex-1"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Badge variant="outline">Total: {students.length} students</Badge>
              <Badge variant="outline">
                Filtered: {filteredStudents.length} students
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Records</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p>Loading students...</p>
              </div>
            ) : filteredStudents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Father's Name</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.rollNo}
                      </TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>
                        {student.class}-{student.section}
                      </TableCell>
                      <TableCell>{student.fatherName}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student.gender === "Male" ? "default" : "secondary"
                          }
                        >
                          {student.gender}
                        </Badge>
                      </TableCell>
                      <TableCell>{student.phoneNumber}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(student)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Student
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete{" "}
                                  <strong>{student.name}</strong>? This action
                                  cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteStudent(student.id)
                                  }
                                  disabled={deleting === student.id}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {deleting === student.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    "Delete"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-16">
                <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mb-2">
                  No Students Found
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {searchTerm || selectedClass || selectedSection
                    ? "No students match your search criteria. Try adjusting your filters."
                    : "No students have been added yet. Click the 'Add Student' button to get started."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Edit Student: {editingStudent?.name}
              </DialogTitle>
            </DialogHeader>
            <StudentForm isEdit />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
