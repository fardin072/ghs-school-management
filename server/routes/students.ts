import { RequestHandler } from "express";
import {
  StudentsResponse,
  StudentResponse,
  CreateStudentRequest,
  ClassSectionsResponse,
} from "@shared/types";
import {
  mockStudents,
  mockClassSections,
  getStudentsByClass,
} from "../data/mockData";

export const getAllStudents: RequestHandler = (req, res) => {
  try {
    const { class: className, section, search } = req.query;

    let filteredStudents = mockStudents;

    // Filter by class
    if (className) {
      filteredStudents = filteredStudents.filter((s) => s.class === className);
    }

    // Filter by section
    if (section) {
      filteredStudents = filteredStudents.filter((s) => s.section === section);
    }

    // Filter by search term
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredStudents = filteredStudents.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm) ||
          s.rollNo.includes(searchTerm) ||
          s.fatherName.toLowerCase().includes(searchTerm),
      );
    }

    // Sort by roll number
    filteredStudents.sort((a, b) => parseInt(a.rollNo) - parseInt(b.rollNo));

    const response: StudentsResponse = {
      success: true,
      data: filteredStudents,
      message: `Found ${filteredStudents.length} students`,
    };

    res.json(response);
  } catch (error) {
    const response: StudentsResponse = {
      success: false,
      data: [],
      error: "Failed to fetch students",
    };
    res.status(500).json(response);
  }
};

export const getStudentById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const student = mockStudents.find((s) => s.id === id);

    if (!student) {
      const response: StudentResponse = {
        success: false,
        data: {} as any,
        error: "Student not found",
      };
      return res.status(404).json(response);
    }

    const response: StudentResponse = {
      success: true,
      data: student,
    };

    res.json(response);
  } catch (error) {
    const response: StudentResponse = {
      success: false,
      data: {} as any,
      error: "Failed to fetch student",
    };
    res.status(500).json(response);
  }
};

export const getClassSections: RequestHandler = (req, res) => {
  try {
    const response: ClassSectionsResponse = {
      success: true,
      data: mockClassSections,
    };

    res.json(response);
  } catch (error) {
    const response: ClassSectionsResponse = {
      success: false,
      data: [],
      error: "Failed to fetch class sections",
    };
    res.status(500).json(response);
  }
};

export const createStudent: RequestHandler = (req, res) => {
  try {
    const studentData: CreateStudentRequest = req.body;

    // Generate new student ID
    const newId = `student-${mockStudents.length + 1}`;

    // Check if roll number already exists
    const existingStudent = mockStudents.find(
      (s) => s.rollNo === studentData.rollNo,
    );
    if (existingStudent) {
      const response: StudentResponse = {
        success: false,
        data: {} as any,
        error: "Roll number already exists",
      };
      return res.status(400).json(response);
    }

    const newStudent = {
      id: newId,
      admissionDate: new Date().toISOString().split("T")[0],
      ...studentData,
    };

    // In a real app, this would save to database
    mockStudents.push(newStudent);

    const response: StudentResponse = {
      success: true,
      data: newStudent,
      message: "Student created successfully",
    };

    res.status(201).json(response);
  } catch (error) {
    const response: StudentResponse = {
      success: false,
      data: {} as any,
      error: "Failed to create student",
    };
    res.status(500).json(response);
  }
};

export const updateStudent: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const studentIndex = mockStudents.findIndex((s) => s.id === id);
    if (studentIndex === -1) {
      const response: StudentResponse = {
        success: false,
        data: {} as any,
        error: "Student not found",
      };
      return res.status(404).json(response);
    }

    // Update student
    mockStudents[studentIndex] = {
      ...mockStudents[studentIndex],
      ...updateData,
    };

    const response: StudentResponse = {
      success: true,
      data: mockStudents[studentIndex],
      message: "Student updated successfully",
    };

    res.json(response);
  } catch (error) {
    const response: StudentResponse = {
      success: false,
      data: {} as any,
      error: "Failed to update student",
    };
    res.status(500).json(response);
  }
};

export const deleteStudent: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    const studentIndex = mockStudents.findIndex((s) => s.id === id);
    if (studentIndex === -1) {
      const response: StudentResponse = {
        success: false,
        data: {} as any,
        error: "Student not found",
      };
      return res.status(404).json(response);
    }

    // Remove student
    const deletedStudent = mockStudents.splice(studentIndex, 1)[0];

    const response: StudentResponse = {
      success: true,
      data: deletedStudent,
      message: "Student deleted successfully",
    };

    res.json(response);
  } catch (error) {
    const response: StudentResponse = {
      success: false,
      data: {} as any,
      error: "Failed to delete student",
    };
    res.status(500).json(response);
  }
};
