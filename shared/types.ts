export interface Student {
  id: string;
  rollNo: string;
  name: string;
  fatherName: string;
  motherName: string;
  class: string;
  section: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  admissionDate: string;
  gender: "Male" | "Female";
  bloodGroup?: string;
  email?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  maxMarks: number;
  minMarks: number;
  isOptional: boolean;
}

export interface ExamType {
  id: string;
  name: string;
  weight: number; // percentage weight in final grade
  maxMarks: number;
}

export interface StudentMarks {
  id: string;
  studentId: string;
  subjectId: string;
  examTypeId: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
  remarks?: string;
  entryDate: string;
}

export interface Marksheet {
  id: string;
  studentId: string;
  class: string;
  section: string;
  examType: string;
  academicYear: string;
  subjects: {
    subjectId: string;
    subjectName: string;
    marksObtained: number;
    maxMarks: number;
    grade: string;
  }[];
  totalMarks: number;
  totalMaxMarks: number;
  percentage: number;
  overallGrade: string;
  rank?: number;
  generatedDate: string;
  remarks?: string;
}

export interface ClassSection {
  class: string;
  section: string;
  classTeacher: string;
  studentCount: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface StudentsResponse extends ApiResponse<Student[]> {}
export interface StudentResponse extends ApiResponse<Student> {}
export interface MarksResponse extends ApiResponse<StudentMarks[]> {}
export interface MarksheetResponse extends ApiResponse<Marksheet> {}
export interface SubjectsResponse extends ApiResponse<Subject[]> {}
export interface ExamTypesResponse extends ApiResponse<ExamType[]> {}
export interface ClassSectionsResponse extends ApiResponse<ClassSection[]> {}

// Request types
export interface CreateStudentRequest {
  rollNo: string;
  name: string;
  fatherName: string;
  motherName: string;
  class: string;
  section: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  gender: "Male" | "Female";
  bloodGroup?: string;
  email?: string;
}

export interface UpdateMarksRequest {
  studentId: string;
  subjectId: string;
  examTypeId: string;
  marksObtained: number;
}

export interface GenerateMarksheetRequest {
  studentId: string;
  examTypeId: string;
  academicYear: string;
}
