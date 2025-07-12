import React from "react";
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
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import {
  BarChart3,
  Download,
  FileText,
  TrendingUp,
  Users,
  Loader2,
  Filter,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  studentsApi,
  marksheetsApi,
  classSectionsApi,
  examTypesApi,
} from "@/lib/api";
import { Student, ExamType, ClassSection, Marksheet } from "@shared/types";

export default function Reports() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [academicYear, setAcademicYear] = useState("2024-25");
  const [generating, setGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");

  const [classSections, setClassSections] = useState<ClassSection[]>([]);
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [classSectionsRes, examTypesRes] = await Promise.all([
        classSectionsApi.getAll(),
        examTypesApi.getAll(),
      ]);

      if (classSectionsRes.success) setClassSections(classSectionsRes.data);
      if (examTypesRes.success) setExamTypes(examTypesRes.data);
    } catch (error) {
      toast.error("Failed to load initial data");
      console.error("Error loading initial data:", error);
    }
  };

  const handleGenerateBulkReport = async () => {
    if (!selectedClass || !selectedSection || !selectedExam) {
      toast.error("Please select class, section, and examination type");
      return;
    }

    setGenerating(true);
    try {
      setLoadingStep("Step 1/3: Loading students...");
      toast.loading("Step 1/3: Loading students...", { id: "pdf-generation" });

      // Get students for the selected class and section
      const studentsResponse = await studentsApi.getAll({
        class: selectedClass,
        section: selectedSection,
      });

      if (!studentsResponse.success || studentsResponse.data.length === 0) {
        toast.error("No students found for the selected class and section", {
          id: "pdf-generation",
        });
        return;
      }

      setLoadingStep("Step 2/3: Generating class report...");
      toast.loading("Step 2/3: Generating class report...", {
        id: "pdf-generation",
      });

      // Use the existing bulk marksheet API
      const bulkResponse = await marksheetsApi.generateBulk({
        className: selectedClass,
        section: selectedSection,
        examTypeId: selectedExam,
        academicYear,
      });

      if (bulkResponse.success && bulkResponse.data.length > 0) {
        setLoadingStep("Step 3/3: Creating PDF download...");
        toast.loading("Step 3/3: Creating PDF download...", {
          id: "pdf-generation",
        });

        const examTypeName =
          examTypes.find((e) => e.id === selectedExam)?.name || selectedExam;

        // Create a comprehensive class report
        const reportData = {
          schoolName: "GUZIA HIGH SCHOOL",
          class: selectedClass,
          section: selectedSection,
          examType: examTypeName,
          academicYear,
          totalStudents: bulkResponse.data.length,
          generatedAt: new Date().toLocaleString("en-IN"),
          students: bulkResponse.data.map((item: any) => ({
            rollNo: item.rollNo || item.studentId,
            name: item.studentName || "Student",
            percentage: item.percentage || 0,
            grade: item.overallGrade || "N/A",
            totalMarks: item.totalMarks || 0,
            maxMarks: item.totalMaxMarks || 0,
            result: (item.percentage || 0) >= 33 ? "PASS" : "FAIL",
          })),
        };

        // Calculate statistics
        const passedStudents = reportData.students.filter(
          (s) => s.result === "PASS",
        ).length;
        const classAverage = (
          reportData.students.reduce((sum, s) => sum + s.percentage, 0) /
          reportData.students.length
        ).toFixed(2);
        const highestScore = Math.max(
          ...reportData.students.map((s) => s.percentage),
        );
        const lowestScore = Math.min(
          ...reportData.students.map((s) => s.percentage),
        );

        // Create HTML content for PDF
        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6;">
            <!-- Header -->
            <div style="text-align: center; border-bottom: 3px solid #9c1638; padding-bottom: 20px; margin-bottom: 30px;">
              <div style="width: 80px; height: 80px; background: #9c1638; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; font-weight: bold;">GHS</div>
              <h1 style="font-size: 32px; font-weight: bold; color: #2c1117; margin: 0 0 10px 0;">${reportData.schoolName}</h1>
              <p style="font-size: 16px; color: #666; margin: 0 0 20px 0;">Academic Performance Report</p>
              <h2 style="font-size: 24px; font-weight: bold; color: #9c1638; margin: 0;">${reportData.examType} - Class ${reportData.class}-${reportData.section}</h2>
            </div>

            <!-- Summary -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <h3 style="margin: 0 0 15px 0; color: #333;">Class Summary</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                  <p style="margin: 5px 0;"><strong>Academic Year:</strong> ${reportData.academicYear}</p>
                  <p style="margin: 5px 0;"><strong>Total Students:</strong> ${reportData.totalStudents}</p>
                  <p style="margin: 5px 0;"><strong>Students Passed:</strong> ${passedStudents} (${((passedStudents / reportData.totalStudents) * 100).toFixed(1)}%)</p>
                </div>
                <div>
                  <p style="margin: 5px 0;"><strong>Class Average:</strong> ${classAverage}%</p>
                  <p style="margin: 5px 0;"><strong>Highest Score:</strong> ${highestScore}%</p>
                  <p style="margin: 5px 0;"><strong>Lowest Score:</strong> ${lowestScore}%</p>
                </div>
              </div>
            </div>

            <!-- Students Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              <thead>
                <tr style="background: #f0f8ff;">
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Roll No</th>
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Student Name</th>
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Marks</th>
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Percentage</th>
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Grade</th>
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Result</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.students
                  .map(
                    (student, index) => `
                  <tr style="background: ${index % 2 === 0 ? "#f9f9f9" : "white"};">
                    <td style="border: 1px solid #ddd; padding: 10px;">${student.rollNo}</td>
                    <td style="border: 1px solid #ddd; padding: 10px;">${student.name}</td>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${student.totalMarks}/${student.maxMarks}</td>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">${student.percentage}%</td>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">${student.grade}</td>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold; color: ${student.result === "PASS" ? "#16a34a" : "#dc2626"};">${student.result}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>

            <!-- Footer -->
            <div style="text-align: center; border-top: 2px solid #9c1638; padding-top: 20px; font-size: 12px; color: #666;">
              <p style="margin: 0;">Generated on ${reportData.generatedAt} by Academic Management System</p>
              <p style="margin: 5px 0 0 0;">GUZIA HIGH SCHOOL - Academic Excellence</p>
            </div>
          </div>
        `;

        // Create temporary container and generate PDF
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = htmlContent;
        tempContainer.style.position = "absolute";
        tempContainer.style.left = "-9999px";
        tempContainer.style.backgroundColor = "white";
        tempContainer.style.width = "210mm";
        tempContainer.style.padding = "20mm";
        document.body.appendChild(tempContainer);

        // Import PDF generation utility
        const { generatePDFFromElement } = await import("@/lib/pdfUtils");
        const filename = `Class_${selectedClass}${selectedSection}_${examTypeName.replace(/[^a-zA-Z0-9]/g, "_")}_Report_${academicYear}.pdf`;

        await generatePDFFromElement(tempContainer, filename);
        document.body.removeChild(tempContainer);

        toast.success(
          `Successfully generated class report PDF with ${reportData.totalStudents} students!`,
          { id: "pdf-generation" },
        );
      } else {
        toast.error(
          "No data found for this class. Please check if marks are entered.",
          { id: "pdf-generation" },
        );
      }
    } catch (error) {
      console.error("Error generating bulk report:", error);
      toast.error("Error generating PDF report. Please try again.", {
        id: "pdf-generation",
      });
    } finally {
      setGenerating(false);
      setLoadingStep("");
    }
  };

  const handleExportReport = () => {
    toast.info("Export functionality will be available soon!");
  };

  const handleViewAnalytics = () => {
    toast.info("Analytics view will be available soon!");
  };

  const handleViewProgress = () => {
    toast.info("Progress reports will be available soon!");
  };

  const handleGenerateAllMarksheets = async () => {
    if (!selectedClass || !selectedSection || !selectedExam) {
      toast.error("Please select class, section, and examination type");
      return;
    }

    setGenerating(true);
    try {
      setLoadingStep("Step 1/4: Loading students...");
      toast.loading("Step 1/4: Loading students...", {
        id: "marksheet-generation",
      });

      // Get students for the selected class and section
      const studentsResponse = await studentsApi.getAll({
        class: selectedClass,
        section: selectedSection,
      });

      if (!studentsResponse.success || studentsResponse.data.length === 0) {
        toast.error("No students found for the selected class and section", {
          id: "marksheet-generation",
        });
        return;
      }

      const students = studentsResponse.data;
      setLoadingStep(
        `Step 2/4: Generating marksheets for ${students.length} students...`,
      );
      toast.loading(
        `Step 2/4: Generating marksheets for ${students.length} students...`,
        {
          id: "marksheet-generation",
        },
      );

      // Generate individual marksheets for each student
      const marksheets: Marksheet[] = [];
      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        try {
          const marksheetResponse = await marksheetsApi.generate({
            studentId: student.id,
            examTypeId: selectedExam,
            academicYear,
          });

          if (marksheetResponse.success) {
            marksheets.push(marksheetResponse.data);
          }
        } catch (error) {
          console.warn(
            `Failed to generate marksheet for student ${student.name}:`,
            error,
          );
        }

        // Update progress
        if ((i + 1) % 10 === 0 || i === students.length - 1) {
          setLoadingStep(
            `Step 2/4: Generated ${i + 1}/${students.length} marksheets...`,
          );
        }
      }

      if (marksheets.length === 0) {
        toast.error(
          "No marksheets could be generated. Please check if marks are entered.",
          {
            id: "marksheet-generation",
          },
        );
        return;
      }

      setLoadingStep("Step 3/4: Creating PDF pages...");
      toast.loading("Step 3/4: Creating PDF pages...", {
        id: "marksheet-generation",
      });

      const examTypeName =
        examTypes.find((e) => e.id === selectedExam)?.name || selectedExam;

      // Create HTML for all marksheets
      const allMarksheetsHTML = marksheets
        .map((marksheet, index) => {
          const pageNumber = index + 1;
          return `
          <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6; min-height: 100vh; page-break-after: always; position: relative;">
            <!-- Page Number -->
            <div style="position: absolute; top: 20px; right: 40px; font-size: 14px; color: #666;">Page ${pageNumber}</div>

            <!-- Header -->
            <div style="text-align: center; border-bottom: 3px solid #9c1638; padding-bottom: 20px; margin-bottom: 30px;">
              <div style="width: 80px; height: 80px; background: #9c1638; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; font-weight: bold;">GHS</div>
              <h1 style="font-size: 32px; font-weight: bold; color: #2c1117; margin: 0 0 10px 0;">GUZIA HIGH SCHOOL</h1>
              <p style="font-size: 16px; color: #666; margin: 0 0 20px 0;">Academic Excellence Through Innovation</p>
              <h2 style="font-size: 24px; font-weight: bold; color: #9c1638; margin: 0;">MARKSHEET</h2>
            </div>

            <!-- Student Info -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                  <p style="margin: 5px 0;"><strong>Student Name:</strong> ${marksheet.studentName}</p>
                  <p style="margin: 5px 0;"><strong>Roll Number:</strong> ${marksheet.rollNo}</p>
                  <p style="margin: 5px 0;"><strong>Class:</strong> ${marksheet.className}-${marksheet.section}</p>
                </div>
                <div>
                  <p style="margin: 5px 0;"><strong>Examination:</strong> ${examTypeName}</p>
                  <p style="margin: 5px 0;"><strong>Academic Year:</strong> ${marksheet.academicYear}</p>
                  <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString("en-IN")}</p>
                </div>
              </div>
            </div>

            <!-- Marks Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              <thead>
                <tr style="background: #f0f8ff;">
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Subject</th>
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Full Marks</th>
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Pass Marks</th>
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Marks Obtained</th>
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Grade</th>
                </tr>
              </thead>
              <tbody>
                ${marksheet.subjectMarks
                  .map(
                    (subject, idx) => `
                  <tr style="background: ${idx % 2 === 0 ? "#f9f9f9" : "white"};">
                    <td style="border: 1px solid #ddd; padding: 10px;">${subject.subjectName}</td>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${subject.fullMarks}</td>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${subject.passMarks}</td>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">${subject.marksObtained}</td>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">${subject.grade}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>

            <!-- Summary -->
            <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                  <p style="margin: 5px 0;"><strong>Total Marks:</strong> ${marksheet.totalMarks}/${marksheet.totalMaxMarks}</p>
                  <p style="margin: 5px 0;"><strong>Percentage:</strong> ${marksheet.percentage}%</p>
                  <p style="margin: 5px 0;"><strong>Overall Grade:</strong> ${marksheet.overallGrade}</p>
                </div>
                <div>
                  <p style="margin: 5px 0;"><strong>Result:</strong> <span style="color: ${marksheet.percentage >= 33 ? "#16a34a" : "#dc2626"}; font-weight: bold;">${marksheet.percentage >= 33 ? "PASS" : "FAIL"}</span></p>
                  <p style="margin: 5px 0;"><strong>Rank:</strong> -</p>
                  <p style="margin: 5px 0;"><strong>Attendance:</strong> -</p>
                </div>
              </div>
            </div>

            <!-- Grading Scale -->
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 30px;">
              <h4 style="margin: 0 0 10px 0; font-size: 14px;">Grading Scale:</h4>
              <div style="font-size: 12px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px;">
                <span><strong>A+:</strong> 90-100%</span>
                <span><strong>A:</strong> 80-89%</span>
                <span><strong>B+:</strong> 70-79%</span>
                <span><strong>B:</strong> 60-69%</span>
                <span><strong>C:</strong> 50-59%</span>
              </div>
              <div style="font-size: 12px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 5px;">
                <span><strong>D:</strong> 40-49%</span>
                <span><strong>E:</strong> 33-39%</span>
                <span><strong>F:</strong> Below 33%</span>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; border-top: 2px solid #9c1638; padding-top: 20px; font-size: 12px; color: #666;">
              <p style="margin: 0;">This marksheet is computer generated and does not require signature</p>
              <p style="margin: 5px 0 0 0;">GUZIA HIGH SCHOOL - Academic Excellence</p>
            </div>
          </div>
        `;
        })
        .join("");

      setLoadingStep("Step 4/4: Generating PDF download...");
      toast.loading("Step 4/4: Generating PDF download...", {
        id: "marksheet-generation",
      });

      // Create temporary container and generate PDF
      const tempContainer = document.createElement("div");
      tempContainer.innerHTML = allMarksheetsHTML;
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.backgroundColor = "white";
      tempContainer.style.width = "210mm";
      document.body.appendChild(tempContainer);

      // Import PDF generation utility
      const { generatePDFFromElement } = await import("@/lib/pdfUtils");
      const filename = `All_Marksheets_${selectedClass}${selectedSection}_${examTypeName.replace(/[^a-zA-Z0-9]/g, "_")}_${academicYear}.pdf`;

      await generatePDFFromElement(tempContainer, filename);
      document.body.removeChild(tempContainer);

      toast.success(
        `Successfully generated ${marksheets.length} individual marksheets in one PDF!`,
        { id: "marksheet-generation" },
      );
    } catch (error) {
      console.error("Error generating all marksheets:", error);
      toast.error("Error generating marksheets PDF. Please try again.", {
        id: "marksheet-generation",
      });
    } finally {
      setGenerating(false);
      setLoadingStep("");
    }
  };

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Reports"
        subtitle="View academic reports and analytics"
      >
        <div className="flex gap-2">
          <Button onClick={handleGenerateBulkReport} disabled={generating}>
            {generating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Generate Combined PDF
          </Button>
          <Button
            onClick={handleGenerateAllMarksheets}
            disabled={generating}
            variant="outline"
          >
            {generating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FileText className="w-4 h-4 mr-2" />
            )}
            Generate all Marksheet
          </Button>
        </div>
      </DashboardHeader>

      <div className="p-8 space-y-6">
        {/* Report Generation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Generate Class Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
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
                <Label htmlFor="year">Academic Year</Label>
                <Input
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="2024-25"
                />
              </div>
            </div>

            {selectedClass && selectedSection && selectedExam && (
              <div className="mt-4 space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4" />
                    <span className="font-medium">Report Preview</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      Class {selectedClass}-{selectedSection}
                    </Badge>
                    <Badge variant="outline">
                      {examTypes.find((e) => e.id === selectedExam)?.name}
                    </Badge>
                    <Badge variant="outline">{academicYear}</Badge>
                    <Badge variant="outline">~50 Students</Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <FileText className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900 mb-1">
                          Combined PDF Generation
                        </h4>
                        <p className="text-sm text-green-700">
                          This will generate a comprehensive class report PDF
                          with student performance summary, statistics, and
                          detailed results table for all students in the
                          selected class.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">
                          Individual Marksheets PDF
                        </h4>
                        <p className="text-sm text-blue-700">
                          This will generate one PDF file containing individual
                          marksheet for each student. Each page will be one
                          student's marksheet, and page number will correspond
                          to student number.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analytics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Reports
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Classes Covered
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10</div>
              <p className="text-xs text-muted-foreground">
                All classes active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Score
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78.5%</div>
              <p className="text-xs text-success">+2.1% improvement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Reports This Month
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">Generated reports</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Class Performance Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Generate detailed performance reports for each class
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleViewAnalytics}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Class Reports
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subject Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Analyze performance across different subjects
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleViewAnalytics}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                View Subject Analytics
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Student Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Track individual student progress over time
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleViewProgress}
              >
                <Users className="w-4 h-4 mr-2" />
                View Progress Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <LoadingOverlay
        isVisible={generating}
        message="Generating Class Report PDF"
        progress={loadingStep}
      />
    </DashboardLayout>
  );
}
