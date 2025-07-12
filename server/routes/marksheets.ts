import { RequestHandler } from "express";
import {
  MarksheetResponse,
  GenerateMarksheetRequest,
  Marksheet,
  ApiResponse,
} from "@shared/types";
import {
  mockStudents,
  mockSubjects,
  mockExamTypes,
  getMarksByStudent,
} from "../data/mockData";

function calculateOverallGrade(percentage: number): string {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C+";
  if (percentage >= 40) return "C";
  if (percentage >= 33) return "D";
  return "F";
}

export const generateMarksheet: RequestHandler = (req, res) => {
  try {
    const { studentId, examTypeId, academicYear } = req.body;

    if (!studentId || !examTypeId || !academicYear) {
      const response: MarksheetResponse = {
        success: false,
        data: {} as any,
        error:
          "Missing required parameters: studentId, examTypeId, academicYear",
      };
      return res.status(400).json(response);
    }

    // Find student
    const student = mockStudents.find((s) => s.id === studentId);
    if (!student) {
      const response: MarksheetResponse = {
        success: false,
        data: {} as any,
        error: "Student not found",
      };
      return res.status(404).json(response);
    }

    // Find exam type
    const examType = mockExamTypes.find((e) => e.id === examTypeId);
    if (!examType) {
      const response: MarksheetResponse = {
        success: false,
        data: {} as any,
        error: "Exam type not found",
      };
      return res.status(404).json(response);
    }

    // Get student marks for the exam
    const studentMarks = getMarksByStudent(studentId, examTypeId);

    // Prepare subjects with marks
    const subjects = studentMarks.map((mark) => {
      const subject = mockSubjects.find((s) => s.id === mark.subjectId);
      return {
        subjectId: mark.subjectId,
        subjectName: subject ? subject.name : "Unknown Subject",
        marksObtained: mark.marksObtained,
        maxMarks: mark.maxMarks,
        grade: mark.grade,
      };
    });

    // Calculate totals
    const totalMarks = subjects.reduce((sum, s) => sum + s.marksObtained, 0);
    const totalMaxMarks = subjects.reduce((sum, s) => sum + s.maxMarks, 0);
    const percentage =
      totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;
    const overallGrade = calculateOverallGrade(percentage);

    // Calculate rank (simplified - just random for demo)
    const rank = Math.floor(Math.random() * 50) + 1;

    const marksheet: Marksheet = {
      id: `marksheet-${Date.now()}`,
      studentId: student.id,
      class: student.class,
      section: student.section,
      examType: examType.name,
      academicYear,
      subjects,
      totalMarks,
      totalMaxMarks,
      percentage: Math.round(percentage * 100) / 100,
      overallGrade,
      rank,
      generatedDate: new Date().toISOString().split("T")[0],
      remarks:
        percentage >= 33 ? "Promoted to next class" : "Needs improvement",
    };

    const response: MarksheetResponse = {
      success: true,
      data: marksheet,
      message: "Marksheet generated successfully",
    };

    res.json(response);
  } catch (error) {
    const response: MarksheetResponse = {
      success: false,
      data: {} as any,
      error: "Failed to generate marksheet",
    };
    res.status(500).json(response);
  }
};

export const getMarksheet: RequestHandler = async (req, res) => {
  try {
    const { studentId, examTypeId, academicYear } = req.query;

    if (!studentId || !examTypeId || !academicYear) {
      const response: MarksheetResponse = {
        success: false,
        data: {} as any,
        error:
          "Missing required parameters: studentId, examTypeId, academicYear",
      };
      return res.status(400).json(response);
    }

    // Find student
    const student = mockStudents.find((s) => s.id === studentId);
    if (!student) {
      const response: MarksheetResponse = {
        success: false,
        data: {} as any,
        error: "Student not found",
      };
      return res.status(404).json(response);
    }

    // Find exam type
    const examType = mockExamTypes.find((e) => e.id === examTypeId);
    if (!examType) {
      const response: MarksheetResponse = {
        success: false,
        data: {} as any,
        error: "Exam type not found",
      };
      return res.status(404).json(response);
    }

    // Get student marks for the exam
    const studentMarks = getMarksByStudent(
      studentId as string,
      examTypeId as string,
    );

    // Prepare subjects with marks
    const subjects = studentMarks.map((mark) => {
      const subject = mockSubjects.find((s) => s.id === mark.subjectId);
      return {
        subjectId: mark.subjectId,
        subjectName: subject ? subject.name : "Unknown Subject",
        marksObtained: mark.marksObtained,
        maxMarks: mark.maxMarks,
        grade: mark.grade,
      };
    });

    // Calculate totals
    const totalMarks = subjects.reduce((sum, s) => sum + s.marksObtained, 0);
    const totalMaxMarks = subjects.reduce((sum, s) => sum + s.maxMarks, 0);
    const percentage =
      totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;
    const overallGrade = calculateOverallGrade(percentage);

    // Calculate rank (simplified - just random for demo)
    const rank = Math.floor(Math.random() * 50) + 1;

    const marksheet: Marksheet = {
      id: `marksheet-${Date.now()}`,
      studentId: student.id,
      class: student.class,
      section: student.section,
      examType: examType.name,
      academicYear: academicYear as string,
      subjects,
      totalMarks,
      totalMaxMarks,
      percentage: Math.round(percentage * 100) / 100,
      overallGrade,
      rank,
      generatedDate: new Date().toISOString().split("T")[0],
      remarks:
        percentage >= 33 ? "Promoted to next class" : "Needs improvement",
    };

    const response: MarksheetResponse = {
      success: true,
      data: marksheet,
      message: "Marksheet fetched successfully",
    };

    res.json(response);
  } catch (error) {
    const response: MarksheetResponse = {
      success: false,
      data: {} as any,
      error: "Failed to fetch marksheet",
    };
    res.status(500).json(response);
  }
};

export const generateBulkMarksheets: RequestHandler = (req, res) => {
  try {
    const { className, section, examTypeId, academicYear } = req.body;

    if (!className || !section || !examTypeId || !academicYear) {
      const response: ApiResponse<any> = {
        success: false,
        data: null,
        error:
          "Missing required parameters: className, section, examTypeId, academicYear",
      };
      return res.status(400).json(response);
    }

    // Find students in the class
    const classStudents = mockStudents.filter(
      (s) => s.class === className && s.section === section,
    );

    if (classStudents.length === 0) {
      const response: ApiResponse<any> = {
        success: false,
        data: null,
        error: "No students found in the specified class and section",
      };
      return res.status(404).json(response);
    }

    const marksheets = [];

    // Generate marksheet for each student
    for (const student of classStudents) {
      const studentMarks = getMarksByStudent(student.id, examTypeId);

      if (studentMarks.length > 0) {
        const subjects = studentMarks.map((mark) => {
          const subject = mockSubjects.find((s) => s.id === mark.subjectId);
          return {
            subjectId: mark.subjectId,
            subjectName: subject ? subject.name : "Unknown Subject",
            marksObtained: mark.marksObtained,
            maxMarks: mark.maxMarks,
            grade: mark.grade,
          };
        });

        const totalMarks = subjects.reduce(
          (sum, s) => sum + s.marksObtained,
          0,
        );
        const totalMaxMarks = subjects.reduce((sum, s) => sum + s.maxMarks, 0);
        const percentage =
          totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;
        const overallGrade = calculateOverallGrade(percentage);

        marksheets.push({
          id: `marksheet-${student.id}-${examTypeId}`,
          studentId: student.id,
          studentName: student.name,
          rollNo: student.rollNo,
          class: student.class,
          section: student.section,
          examType:
            mockExamTypes.find((e) => e.id === examTypeId)?.name || examTypeId,
          academicYear,
          subjects,
          totalMarks,
          totalMaxMarks,
          percentage: Math.round(percentage * 100) / 100,
          overallGrade,
          generatedDate: new Date().toISOString().split("T")[0],
        });
      }
    }

    const response: ApiResponse<any> = {
      success: true,
      data: marksheets,
      message: `Generated ${marksheets.length} marksheets for class ${className}-${section}`,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<any> = {
      success: false,
      data: null,
      error: "Failed to generate bulk marksheets",
    };
    res.status(500).json(response);
  }
};
