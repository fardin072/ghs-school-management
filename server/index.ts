import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getAllStudents,
  getStudentById,
  getClassSections,
  createStudent,
  updateStudent,
  deleteStudent,
} from "./routes/students";
import {
  getAllSubjects,
  getAllExamTypes,
  getMarksByClassSubject,
  getStudentMarks,
  updateMarks,
  deleteMarks,
} from "./routes/marks";
import {
  generateMarksheet,
  getMarksheet,
  generateBulkMarksheets,
} from "./routes/marksheets";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Students API routes
  app.get("/api/students", getAllStudents);
  app.get("/api/students/:id", getStudentById);
  app.post("/api/students", createStudent);
  app.put("/api/students/:id", updateStudent);
  app.delete("/api/students/:id", deleteStudent);
  app.get("/api/class-sections", getClassSections);

  // Marks API routes
  app.get("/api/subjects", getAllSubjects);
  app.get("/api/exam-types", getAllExamTypes);
  app.get("/api/marks", getMarksByClassSubject);
  app.get("/api/marks/student/:studentId", getStudentMarks);
  app.post("/api/marks", updateMarks);
  app.delete("/api/marks", deleteMarks);

  // Marksheets API routes
  app.post("/api/marksheets/generate", generateMarksheet);
  app.get("/api/marksheets", getMarksheet);
  app.post("/api/marksheets/bulk", generateBulkMarksheets);

  return app;
}
