import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Save, Search, Filter, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  studentsApi,
  subjectsApi,
  examTypesApi,
  classSectionsApi,
  marksApi,
} from "@/lib/api";
import {
  Student,
  Subject,
  ExamType,
  ClassSection,
  StudentMarks,
  UpdateMarksRequest,
} from "@shared/types";

export default function MarksEntry() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedExam, setSelectedExam] = useState("");

  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [classSections, setClassSections] = useState<ClassSection[]>([]);
  const [existingMarks, setExistingMarks] = useState<StudentMarks[]>([]);
  const [marks, setMarks] = useState<Record<string, string>>({});

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [subjectsRes, examTypesRes, classSectionsRes] = await Promise.all([
        subjectsApi.getAll(),
        examTypesApi.getAll(),
        classSectionsApi.getAll(),
      ]);

      if (subjectsRes.success) setSubjects(subjectsRes.data);
      if (examTypesRes.success) setExamTypes(examTypesRes.data);
      if (classSectionsRes.success) setClassSections(classSectionsRes.data);
    } catch (error) {
      toast.error("Failed to load initial data");
      console.error("Error loading initial data:", error);
    }
  };

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

        // Load existing marks if subject and exam are selected
        if (selectedSubject && selectedExam) {
          await loadExistingMarks(response.data);
        }
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

  const loadExistingMarks = async (studentList: Student[]) => {
    if (!selectedSubject || !selectedExam || studentList.length === 0) return;

    try {
      const response = await marksApi.getByClassSubject({
        className: selectedClass,
        section: selectedSection,
        subjectId: selectedSubject,
        examTypeId: selectedExam,
      });

      if (response.success) {
        setExistingMarks(response.data);

        // Populate marks state with existing marks
        const marksMap: Record<string, string> = {};
        response.data.forEach((mark) => {
          marksMap[mark.studentId] = mark.marksObtained.toString();
        });
        setMarks(marksMap);
      }
    } catch (error) {
      console.error("Error loading existing marks:", error);
    }
  };

  // Load students when class/section changes
  useEffect(() => {
    if (selectedClass && selectedSection) {
      loadStudents();
    } else {
      setStudents([]);
      setExistingMarks([]);
      setMarks({});
    }
  }, [selectedClass, selectedSection]);

  // Load existing marks when subject/exam changes
  useEffect(() => {
    if (students.length > 0 && selectedSubject && selectedExam) {
      loadExistingMarks(students);
    }
  }, [selectedSubject, selectedExam]);

  const handleMarksChange = (studentId: string, value: string) => {
    setMarks((prev) => ({ ...prev, [studentId]: value }));
  };

  const calculateGrade = (marksObtained: number, maxMarks: number): string => {
    const percentage = (marksObtained / maxMarks) * 100;
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C+";
    if (percentage >= 40) return "C";
    if (percentage >= 33) return "D";
    return "F";
  };

  const saveMarks = async () => {
    if (!selectedSubject || !selectedExam) {
      toast.error("Please select subject and exam type");
      return;
    }

    const updates: UpdateMarksRequest[] = [];

    // Prepare updates for students with marks entered
    Object.entries(marks).forEach(([studentId, marksValue]) => {
      const marksObtained = parseFloat(marksValue);
      if (!isNaN(marksObtained) && marksObtained >= 0) {
        updates.push({
          studentId,
          subjectId: selectedSubject,
          examTypeId: selectedExam,
          marksObtained,
        });
      }
    });

    if (updates.length === 0) {
      toast.error("No marks to save");
      return;
    }

    setSaving(true);
    try {
      const response = await marksApi.update(updates);

      if (response.success) {
        toast.success(
          `Successfully saved marks for ${updates.length} students`,
        );
        // Reload existing marks to show updated data
        await loadExistingMarks(students);
      } else {
        toast.error("Failed to save marks");
      }
    } catch (error) {
      toast.error("Error saving marks");
      console.error("Error saving marks:", error);
    } finally {
      setSaving(false);
    }
  };

  const selectedExamType = examTypes.find((e) => e.id === selectedExam);

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Marks Entry"
        subtitle="Enter examination marks for students"
      >
        <Button
          onClick={saveMarks}
          disabled={saving || Object.keys(marks).length === 0}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save All
        </Button>
      </DashboardHeader>

      <div className="p-8 space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Select Class & Subject
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
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
                <Label htmlFor="subject">Subject</Label>
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="exam">Examination</Label>
                <Select value={selectedExam} onValueChange={setSelectedExam}>
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
                <Label>&nbsp;</Label>
                <Button
                  className="w-full"
                  onClick={loadStudents}
                  disabled={!selectedClass || !selectedSection || loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  Load Students
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Marks Entry Table */}
        {students.length > 0 && selectedSubject && selectedExam && (
          <Card>
            <CardHeader>
              <CardTitle>
                Students List - Class {selectedClass}-{selectedSection} (
                {subjects.find((s) => s.id === selectedSubject)?.name})
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline">
                  {examTypes.find((e) => e.id === selectedExam)?.name}
                </Badge>
                <Badge variant="outline">
                  Total Students: {students.length}
                </Badge>
                {selectedExamType && (
                  <Badge variant="outline">
                    Max Marks: {selectedExamType.maxMarks}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 font-medium text-sm text-muted-foreground border-b pb-2">
                  <div className="col-span-1">Roll No</div>
                  <div className="col-span-4">Student Name</div>
                  <div className="col-span-2">Class</div>
                  <div className="col-span-2">
                    Marks ({selectedExamType?.maxMarks || 100})
                  </div>
                  <div className="col-span-2">Grade</div>
                  <div className="col-span-1">Status</div>
                </div>
                {students.map((student) => {
                  const studentMarks = marks[student.id] || "";
                  const numMarks = parseFloat(studentMarks);
                  const maxMarks = selectedExamType?.maxMarks || 100;
                  const grade = !isNaN(numMarks)
                    ? calculateGrade(numMarks, maxMarks)
                    : "";

                  const hasExistingMark = existingMarks.some(
                    (m) => m.studentId === student.id,
                  );

                  return (
                    <div
                      key={student.id}
                      className="grid grid-cols-12 gap-4 items-center py-3 border-b"
                    >
                      <div className="col-span-1 font-medium">
                        {student.rollNo}
                      </div>
                      <div className="col-span-4">{student.name}</div>
                      <div className="col-span-2">
                        {student.class}-{student.section}
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          min="0"
                          max={maxMarks}
                          placeholder="Enter marks"
                          value={studentMarks}
                          onChange={(e) =>
                            handleMarksChange(student.id, e.target.value)
                          }
                          className="w-full"
                        />
                      </div>
                      <div className="col-span-2">
                        {grade && (
                          <Badge
                            variant={
                              numMarks >= maxMarks * 0.33
                                ? "default"
                                : "destructive"
                            }
                          >
                            {grade}
                          </Badge>
                        )}
                      </div>
                      <div className="col-span-1">
                        {studentMarks ? (
                          <Badge
                            variant={hasExistingMark ? "default" : "secondary"}
                            className={
                              hasExistingMark
                                ? "bg-warning text-warning-foreground"
                                : "bg-success text-success-foreground"
                            }
                          >
                            {hasExistingMark ? "Updated" : "New"}
                          </Badge>
                        ) : hasExistingMark ? (
                          <Badge
                            variant="default"
                            className="bg-success text-success-foreground"
                          >
                            Entered
                          </Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end mt-6 gap-3">
                <Button variant="outline" onClick={() => setMarks({})}>
                  Clear All
                </Button>
                <Button onClick={saveMarks} disabled={saving}>
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Submit Marks
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {(!selectedClass ||
          !selectedSection ||
          !selectedSubject ||
          !selectedExam) && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">
                  Select Class, Section, Subject & Exam
                </h3>
                <p>
                  Please select a class, section, subject, and examination type
                  to load students.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
