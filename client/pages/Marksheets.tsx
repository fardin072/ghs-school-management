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
import { Badge } from "@/components/ui/badge";
import { MarksheetPDF } from "@/components/marksheets/MarksheetPDF";
import { downloadMarksheetPDF } from "@/lib/pdfUtils";
import {
  FileText,
  Download,
  Search,
  Loader2,
  Eye,
  Users,
  Filter,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  studentsApi,
  examTypesApi,
  classSectionsApi,
  marksheetsApi,
} from "@/lib/api";
import { Student, ExamType, ClassSection, Marksheet } from "@shared/types";

export default function Marksheets() {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [academicYear, setAcademicYear] = useState("2024-25");

  const [students, setStudents] = useState<Student[]>([]);
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [classSections, setClassSections] = useState<ClassSection[]>([]);
  const [currentMarksheet, setCurrentMarksheet] = useState<Marksheet | null>(
    null,
  );
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [viewMode, setViewMode] = useState<"search" | "preview">("search");

  const marksheetRef = useRef<HTMLDivElement>(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [examTypesRes, classSectionsRes] = await Promise.all([
        examTypesApi.getAll(),
        classSectionsApi.getAll(),
      ]);

      if (examTypesRes.success) setExamTypes(examTypesRes.data);
      if (classSectionsRes.success) setClassSections(classSectionsRes.data);
    } catch (error) {
      toast.error("Failed to load initial data");
      console.error("Error loading initial data:", error);
    }
  };

  // Load students when class/section changes
  useEffect(() => {
    if (selectedClass && selectedSection) {
      loadStudents();
    } else {
      setStudents([]);
      setSelectedStudent("");
    }
  }, [selectedClass, selectedSection]);

  const loadStudents = async () => {
    if (!selectedClass || !selectedSection) return;

    setLoading(true);
    try {
      const response = await studentsApi.getAll({
        class: selectedClass,
        section: selectedSection,
      });

      if (response.success) {
        setStudents(response.data);
        toast.success(`Loaded ${response.data.length} students`);
      } else {
        toast.error("Failed to load students");
      }
    } catch (error) {
      toast.error("Error loading students");
      console.error("Error loading students:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateMarksheet = async () => {
    if (!selectedStudent || !selectedExam || !academicYear) {
      toast.error("Please select student, exam type, and academic year");
      return;
    }

    setGenerating(true);
    try {
      const [marksheetRes, studentRes] = await Promise.all([
        marksheetsApi.generate({
          studentId: selectedStudent,
          examTypeId: selectedExam,
          academicYear,
        }),
        studentsApi.getById(selectedStudent),
      ]);

      if (marksheetRes.success && studentRes.success) {
        setCurrentMarksheet(marksheetRes.data);
        setCurrentStudent(studentRes.data);
        setViewMode("preview");
        toast.success("Marksheet generated successfully!");
      } else {
        toast.error("Failed to generate marksheet");
      }
    } catch (error) {
      toast.error("Error generating marksheet");
      console.error("Error generating marksheet:", error);
    } finally {
      setGenerating(false);
    }
  };

  const generateBulkMarksheets = async () => {
    if (!selectedClass || !selectedSection || !selectedExam || !academicYear) {
      toast.error("Please select class, section, exam type, and academic year");
      return;
    }

    setGenerating(true);
    try {
      const response = await marksheetsApi.generateBulk({
        className: selectedClass,
        section: selectedSection,
        examTypeId: selectedExam,
        academicYear,
      });

      if (response.success && response.data.length > 0) {
        toast.success(
          `Generated marksheets for ${response.data.length} students! You can now download individual PDFs by selecting each student below.`,
        );

        // Create a summary file for the class
        const summaryData = response.data.map((item: any) => ({
          rollNo: item.rollNo || item.studentId,
          name: item.studentName || "Student",
          percentage: item.percentage || 0,
          grade: item.overallGrade || "N/A",
        }));

        const csvContent = [
          ["Roll No", "Student Name", "Percentage", "Grade"].join(","),
          ...summaryData.map((s: any) =>
            [s.rollNo, s.name, s.percentage, s.grade].join(","),
          ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Class_${selectedClass}${selectedSection}_${selectedExam}_Summary.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.info(
          "Class summary downloaded! For individual PDF marksheets, select students below.",
        );
      } else {
        toast.error("Failed to generate bulk marksheets");
      }
    } catch (error) {
      toast.error("Error generating bulk marksheets");
      console.error("Error generating bulk marksheets:", error);
    } finally {
      setGenerating(false);
    }
  };

  const downloadPDF = async () => {
    if (!currentMarksheet || !currentStudent || !marksheetRef.current) {
      toast.error("No marksheet to download");
      return;
    }

    setDownloading(currentStudent.id);
    try {
      await downloadMarksheetPDF(
        marksheetRef.current,
        currentStudent.name,
        currentStudent.rollNo,
        currentMarksheet.examType,
        currentMarksheet.academicYear,
      );
      toast.success("Marksheet downloaded successfully!");
    } catch (error) {
      toast.error("Error downloading marksheet");
      console.error("Error downloading marksheet:", error);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Marksheets"
        subtitle="Generate and manage student marksheets"
      >
        {viewMode === "preview" && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setViewMode("search")}>
              <Search className="w-4 h-4 mr-2" />
              New Search
            </Button>
            <Button onClick={downloadPDF} disabled={downloading !== null}>
              {downloading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Download PDF
            </Button>
          </div>
        )}
      </DashboardHeader>

      <div className="p-8 space-y-6">
        {viewMode === "search" && (
          <>
            {/* Search Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Generate Marksheet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                  <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Select
                      value={selectedClass}
                      onValueChange={setSelectedClass}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(
                          new Set(classSections.map((cs) => cs.class)),
                        ).map((cls) => (
                          <SelectItem key={cls} value={cls}>
                            Class {cls}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="section">Section</Label>
                    <Select
                      value={selectedSection}
                      onValueChange={setSelectedSection}
                      disabled={!selectedClass}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
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
                    <Label htmlFor="student">Student</Label>
                    <Select
                      value={selectedStudent}
                      onValueChange={setSelectedStudent}
                      disabled={students.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.rollNo} - {student.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exam">Examination</Label>
                    <Select
                      value={selectedExam}
                      onValueChange={setSelectedExam}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select exam" />
                      </SelectTrigger>
                      <SelectContent>
                        {examTypes.map((exam) => (
                          <SelectItem key={exam.id} value={exam.id}>
                            {exam.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Academic Year</Label>
                    <Input
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      placeholder="2024-25"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>&nbsp;</Label>
                    <Button
                      className="w-full"
                      onClick={generateMarksheet}
                      disabled={!selectedStudent || !selectedExam || generating}
                    >
                      {generating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Eye className="w-4 h-4 mr-2" />
                      )}
                      Generate
                    </Button>
                  </div>
                </div>

                {students.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Bulk Actions for Class {selectedClass}-
                          {selectedSection}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        onClick={generateBulkMarksheets}
                        disabled={!selectedExam || generating}
                      >
                        {generating ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <FileText className="w-4 h-4 mr-2" />
                        )}
                        Generate Class Summary (+ Individual PDFs available
                        below)
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Student List */}
            {students.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Students - Class {selectedClass}-{selectedSection}
                  </CardTitle>
                  <Badge variant="outline">
                    Total Students: {students.length}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {students.slice(0, 10).map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                      >
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Roll No: {student.rollNo} | Father:{" "}
                            {student.fatherName}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedStudent(student.id);
                            generateMarksheet();
                          }}
                          disabled={!selectedExam || generating}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Marksheet
                        </Button>
                      </div>
                    ))}
                    {students.length > 10 && (
                      <div className="text-center text-sm text-muted-foreground mt-4">
                        ... and {students.length - 10} more students
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Marksheet Preview */}
        {viewMode === "preview" && currentMarksheet && currentStudent && (
          <Card>
            <CardHeader>
              <CardTitle>Marksheet Preview</CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline">
                  {currentStudent.name} (Roll: {currentStudent.rollNo})
                </Badge>
                <Badge variant="outline">{currentMarksheet.examType}</Badge>
                <Badge variant="outline">{currentMarksheet.academicYear}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <MarksheetPDF
                ref={marksheetRef}
                marksheet={currentMarksheet}
                student={currentStudent}
              />
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {viewMode === "search" && students.length === 0 && !loading && (
          <Card>
            <CardContent className="py-16">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mb-2">
                  Select Class & Section
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Choose a class and section to load students and generate their
                  marksheets. You can generate individual marksheets or bulk
                  marksheets for the entire class.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
