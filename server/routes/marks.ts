import { RequestHandler } from "express";
import {
  MarksResponse,
  SubjectsResponse,
  ExamTypesResponse,
  UpdateMarksRequest,
  ApiResponse,
} from "@shared/types";
import {
  mockMarks,
  mockSubjects,
  mockExamTypes,
  getMarksByStudent,
  getMarksByClassAndSubject,
} from "../data/mockData";

export const getAllSubjects: RequestHandler = (req, res) => {
  try {
    const response: SubjectsResponse = {
      success: true,
      data: mockSubjects,
    };

    res.json(response);
  } catch (error) {
    const response: SubjectsResponse = {
      success: false,
      data: [],
      error: "Failed to fetch subjects",
    };
    res.status(500).json(response);
  }
};

export const getAllExamTypes: RequestHandler = (req, res) => {
  try {
    const response: ExamTypesResponse = {
      success: true,
      data: mockExamTypes,
    };

    res.json(response);
  } catch (error) {
    const response: ExamTypesResponse = {
      success: false,
      data: [],
      error: "Failed to fetch exam types",
    };
    res.status(500).json(response);
  }
};

export const getMarksByClassSubject: RequestHandler = (req, res) => {
  try {
    const { className, section, subjectId, examTypeId } = req.query;

    if (!className || !section || !subjectId || !examTypeId) {
      const response: MarksResponse = {
        success: false,
        data: [],
        error: "Missing required parameters: class, section, subject, examType",
      };
      return res.status(400).json(response);
    }

    const marks = getMarksByClassAndSubject(
      className as string,
      section as string,
      subjectId as string,
      examTypeId as string,
    );

    const response: MarksResponse = {
      success: true,
      data: marks,
      message: `Found ${marks.length} mark entries`,
    };

    res.json(response);
  } catch (error) {
    const response: MarksResponse = {
      success: false,
      data: [],
      error: "Failed to fetch marks",
    };
    res.status(500).json(response);
  }
};

export const getStudentMarks: RequestHandler = (req, res) => {
  try {
    const { studentId } = req.params;
    const { examTypeId } = req.query;

    const marks = getMarksByStudent(studentId, examTypeId as string);

    const response: MarksResponse = {
      success: true,
      data: marks,
      message: `Found ${marks.length} mark entries for student`,
    };

    res.json(response);
  } catch (error) {
    const response: MarksResponse = {
      success: false,
      data: [],
      error: "Failed to fetch student marks",
    };
    res.status(500).json(response);
  }
};

export const updateMarks: RequestHandler = (req, res) => {
  try {
    const updates: UpdateMarksRequest[] = req.body;

    if (!Array.isArray(updates)) {
      const response: ApiResponse<any> = {
        success: false,
        data: null,
        error: "Request body must be an array of mark updates",
      };
      return res.status(400).json(response);
    }

    const updatedMarks = [];

    for (const update of updates) {
      const { studentId, subjectId, examTypeId, marksObtained } = update;

      // Find existing mark entry
      const markIndex = mockMarks.findIndex(
        (m) =>
          m.studentId === studentId &&
          m.subjectId === subjectId &&
          m.examTypeId === examTypeId,
      );

      if (markIndex !== -1) {
        // Update existing mark
        const subject = mockSubjects.find((s) => s.id === subjectId);
        const examType = mockExamTypes.find((e) => e.id === examTypeId);

        if (subject && examType) {
          const percentage = (marksObtained / examType.maxMarks) * 100;
          let grade = "F";
          if (percentage >= 90) grade = "A+";
          else if (percentage >= 80) grade = "A";
          else if (percentage >= 70) grade = "B+";
          else if (percentage >= 60) grade = "B";
          else if (percentage >= 50) grade = "C+";
          else if (percentage >= 40) grade = "C";
          else if (percentage >= 33) grade = "D";

          mockMarks[markIndex] = {
            ...mockMarks[markIndex],
            marksObtained,
            grade,
            entryDate: new Date().toISOString().split("T")[0],
          };

          updatedMarks.push(mockMarks[markIndex]);
        }
      } else {
        // Create new mark entry
        const subject = mockSubjects.find((s) => s.id === subjectId);
        const examType = mockExamTypes.find((e) => e.id === examTypeId);

        if (subject && examType) {
          const percentage = (marksObtained / examType.maxMarks) * 100;
          let grade = "F";
          if (percentage >= 90) grade = "A+";
          else if (percentage >= 80) grade = "A";
          else if (percentage >= 70) grade = "B+";
          else if (percentage >= 60) grade = "B";
          else if (percentage >= 50) grade = "C+";
          else if (percentage >= 40) grade = "C";
          else if (percentage >= 33) grade = "D";

          const newMark = {
            id: `mark-${mockMarks.length + 1}`,
            studentId,
            subjectId,
            examTypeId,
            marksObtained,
            maxMarks: examType.maxMarks,
            grade,
            entryDate: new Date().toISOString().split("T")[0],
          };

          mockMarks.push(newMark);
          updatedMarks.push(newMark);
        }
      }
    }

    const response: MarksResponse = {
      success: true,
      data: updatedMarks,
      message: `Updated ${updatedMarks.length} mark entries`,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<any> = {
      success: false,
      data: null,
      error: "Failed to update marks",
    };
    res.status(500).json(response);
  }
};

export const deleteMarks: RequestHandler = (req, res) => {
  try {
    const { studentId, subjectId, examTypeId } = req.query;

    if (!studentId || !subjectId || !examTypeId) {
      const response: ApiResponse<any> = {
        success: false,
        data: null,
        error: "Missing required parameters",
      };
      return res.status(400).json(response);
    }

    const markIndex = mockMarks.findIndex(
      (m) =>
        m.studentId === studentId &&
        m.subjectId === subjectId &&
        m.examTypeId === examTypeId,
    );

    if (markIndex === -1) {
      const response: ApiResponse<any> = {
        success: false,
        data: null,
        error: "Mark entry not found",
      };
      return res.status(404).json(response);
    }

    const deletedMark = mockMarks.splice(markIndex, 1)[0];

    const response: ApiResponse<any> = {
      success: true,
      data: deletedMark,
      message: "Mark entry deleted successfully",
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<any> = {
      success: false,
      data: null,
      error: "Failed to delete mark entry",
    };
    res.status(500).json(response);
  }
};
