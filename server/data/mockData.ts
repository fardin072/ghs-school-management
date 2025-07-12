import {
  Student,
  Subject,
  ExamType,
  StudentMarks,
  ClassSection,
} from "@shared/types";

// Mock data for Indian names
const maleFirstNames = [
  "Aarav",
  "Vivaan",
  "Aditya",
  "Arjun",
  "Sai",
  "Reyansh",
  "Atharv",
  "Aryan",
  "Krish",
  "Rudra",
  "Ishaan",
  "Shaurya",
  "Dhruv",
  "Vihaan",
  "Karthik",
  "Arnav",
  "Shivansh",
  "Kabir",
  "Darsh",
  "Yash",
  "Ayush",
  "Advait",
  "Aadhya",
  "Ansh",
  "Pranav",
  "Ritik",
  "Samarth",
  "Harsh",
  "Dev",
  "Nikhil",
  "Rohan",
  "Varun",
  "Aakash",
  "Abhinav",
  "Akash",
  "Aman",
  "Ankit",
  "Ashish",
  "Deepak",
  "Gaurav",
];

const femaleFirstNames = [
  "Saanvi",
  "Diya",
  "Aadhya",
  "Kiara",
  "Anika",
  "Prisha",
  "Anaya",
  "Kavya",
  "Riya",
  "Myra",
  "Sara",
  "Pari",
  "Avni",
  "Ira",
  "Ishika",
  "Tara",
  "Zara",
  "Aditi",
  "Aradhya",
  "Siya",
  "Pihu",
  "Anvi",
  "Arya",
  "Navya",
  "Mahika",
  "Shanaya",
  "Kashvi",
  "Inaya",
  "Sana",
  "Vanya",
  "Priya",
  "Shreya",
  "Pooja",
  "Sneha",
  "Neha",
  "Asha",
  "Nisha",
  "Kavita",
  "Sunita",
  "Meera",
];

const lastNames = [
  "Sharma",
  "Verma",
  "Gupta",
  "Singh",
  "Kumar",
  "Patel",
  "Jain",
  "Agarwal",
  "Bansal",
  "Mittal",
  "Joshi",
  "Srivastava",
  "Pandey",
  "Mishra",
  "Tiwari",
  "Saxena",
  "Tripathi",
  "Chandra",
  "Yadav",
  "Shah",
  "Mehta",
  "Gandhi",
  "Kapoor",
  "Malhotra",
  "Arora",
  "Chopra",
  "Bhatia",
  "Khanna",
  "Aggarwal",
  "Sethi",
  "Thakur",
  "Bhardwaj",
  "Khurana",
  "Goel",
  "Goyal",
  "Ahuja",
  "Bajaj",
  "Kakkar",
  "Madan",
  "Nair",
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const addresses = [
  "123 MG Road, Gandhi Nagar",
  "456 Park Street, Civil Lines",
  "789 Mall Road, Cantonment",
  "321 Station Road, Railway Colony",
  "654 Church Road, Model Town",
  "987 School Street, Teacher Colony",
  "147 Hospital Road, Medical Colony",
  "258 Market Street, Commercial Area",
  "369 Temple Road, Ram Nagar",
  "741 Garden Street, Green Park",
];

// Subjects for different classes
const subjects: Subject[] = [
  {
    id: "math",
    name: "Mathematics",
    code: "MATH",
    maxMarks: 100,
    minMarks: 33,
    isOptional: false,
  },
  {
    id: "science",
    name: "Science",
    code: "SCI",
    maxMarks: 100,
    minMarks: 33,
    isOptional: false,
  },
  {
    id: "english",
    name: "English",
    code: "ENG",
    maxMarks: 100,
    minMarks: 33,
    isOptional: false,
  },
  {
    id: "hindi",
    name: "Hindi",
    code: "HIN",
    maxMarks: 100,
    minMarks: 33,
    isOptional: false,
  },
  {
    id: "social",
    name: "Social Studies",
    code: "SST",
    maxMarks: 100,
    minMarks: 33,
    isOptional: false,
  },
  {
    id: "computer",
    name: "Computer Science",
    code: "CS",
    maxMarks: 100,
    minMarks: 33,
    isOptional: true,
  },
  {
    id: "drawing",
    name: "Drawing",
    code: "ART",
    maxMarks: 50,
    minMarks: 16,
    isOptional: true,
  },
  {
    id: "physical",
    name: "Physical Education",
    code: "PE",
    maxMarks: 50,
    minMarks: 16,
    isOptional: true,
  },
];

// Exam types
const examTypes: ExamType[] = [
  { id: "unit-test-1", name: "Unit Test 1", weight: 10, maxMarks: 25 },
  { id: "unit-test-2", name: "Unit Test 2", weight: 10, maxMarks: 25 },
  { id: "half-yearly", name: "Half Yearly", weight: 40, maxMarks: 100 },
  { id: "final", name: "Final Examination", weight: 40, maxMarks: 100 },
];

// Class sections
const classSections: ClassSection[] = [
  {
    class: "6",
    section: "A",
    classTeacher: "Mrs. Sunita Sharma",
    studentCount: 50,
  },
  {
    class: "6",
    section: "B",
    classTeacher: "Mr. Rajesh Kumar",
    studentCount: 50,
  },
  {
    class: "7",
    section: "A",
    classTeacher: "Mrs. Priya Gupta",
    studentCount: 50,
  },
  {
    class: "7",
    section: "B",
    classTeacher: "Mr. Amit Singh",
    studentCount: 50,
  },
  {
    class: "8",
    section: "A",
    classTeacher: "Mrs. Neha Patel",
    studentCount: 50,
  },
  {
    class: "8",
    section: "B",
    classTeacher: "Mr. Vikash Jain",
    studentCount: 50,
  },
  {
    class: "9",
    section: "A",
    classTeacher: "Mrs. Kavita Agarwal",
    studentCount: 50,
  },
  {
    class: "9",
    section: "B",
    classTeacher: "Mr. Suresh Bansal",
    studentCount: 50,
  },
  {
    class: "10",
    section: "A",
    classTeacher: "Mrs. Ritu Mittal",
    studentCount: 50,
  },
  {
    class: "10",
    section: "B",
    classTeacher: "Mr. Manoj Joshi",
    studentCount: 50,
  },
];

function generateRandomMarks(maxMarks: number): number {
  // Generate marks with realistic distribution
  const percentage = Math.random();
  if (percentage < 0.1)
    return Math.floor(maxMarks * (0.3 + Math.random() * 0.15)); // 10% poor (30-45%)
  if (percentage < 0.3)
    return Math.floor(maxMarks * (0.45 + Math.random() * 0.15)); // 20% below average (45-60%)
  if (percentage < 0.7)
    return Math.floor(maxMarks * (0.6 + Math.random() * 0.2)); // 40% average (60-80%)
  if (percentage < 0.9)
    return Math.floor(maxMarks * (0.8 + Math.random() * 0.15)); // 20% good (80-95%)
  return Math.floor(maxMarks * (0.9 + Math.random() * 0.1)); // 10% excellent (90-100%)
}

function calculateGrade(marks: number, maxMarks: number): string {
  const percentage = (marks / maxMarks) * 100;
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C+";
  if (percentage >= 40) return "C";
  if (percentage >= 33) return "D";
  return "F";
}

function generateStudents(): Student[] {
  const students: Student[] = [];
  let globalRollNo = 1;

  classSections.forEach(({ class: className, section }) => {
    for (let i = 1; i <= 50; i++) {
      const isGirl = Math.random() < 0.45; // 45% girls, 55% boys
      const firstName = isGirl
        ? femaleFirstNames[Math.floor(Math.random() * femaleFirstNames.length)]
        : maleFirstNames[Math.floor(Math.random() * maleFirstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fatherFirstName =
        maleFirstNames[Math.floor(Math.random() * maleFirstNames.length)];
      const motherFirstName =
        femaleFirstNames[Math.floor(Math.random() * femaleFirstNames.length)];

      // Generate birth year based on class
      const age = parseInt(className) + 5; // Rough age calculation
      const birthYear = new Date().getFullYear() - age;
      const birthMonth = Math.floor(Math.random() * 12) + 1;
      const birthDay = Math.floor(Math.random() * 28) + 1;

      const student: Student = {
        id: `student-${globalRollNo}`,
        rollNo: globalRollNo.toString().padStart(4, "0"),
        name: `${firstName} ${lastName}`,
        fatherName: `${fatherFirstName} ${lastName}`,
        motherName: `${motherFirstName} ${lastName}`,
        class: className,
        section: section,
        dateOfBirth: `${birthYear}-${birthMonth.toString().padStart(2, "0")}-${birthDay.toString().padStart(2, "0")}`,
        address: addresses[Math.floor(Math.random() * addresses.length)],
        phoneNumber: `+91 ${Math.floor(Math.random() * 900000000) + 100000000}`,
        admissionDate: `${birthYear + parseInt(className) - 1}-04-01`, // Admission in class 1
        gender: isGirl ? "Female" : "Male",
        bloodGroup: bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@parent.com`,
      };

      students.push(student);
      globalRollNo++;
    }
  });

  return students;
}

function generateStudentMarks(students: Student[]): StudentMarks[] {
  const marks: StudentMarks[] = [];
  let markId = 1;

  students.forEach((student) => {
    // Get subjects for the student's class
    const coreSubjects = subjects.filter((s) => !s.isOptional);
    const optionalSubjects = subjects.filter((s) => s.isOptional);

    // All students take core subjects, 70% take computer science, 50% take art/PE
    const studentSubjects = [...coreSubjects];
    if (Math.random() < 0.7)
      studentSubjects.push(subjects.find((s) => s.id === "computer")!);
    if (Math.random() < 0.5)
      studentSubjects.push(subjects.find((s) => s.id === "drawing")!);
    if (Math.random() < 0.3)
      studentSubjects.push(subjects.find((s) => s.id === "physical")!);

    studentSubjects.forEach((subject) => {
      examTypes.forEach((examType) => {
        const marksObtained = generateRandomMarks(examType.maxMarks);
        const grade = calculateGrade(marksObtained, examType.maxMarks);

        marks.push({
          id: `mark-${markId}`,
          studentId: student.id,
          subjectId: subject.id,
          examTypeId: examType.id,
          marksObtained,
          maxMarks: examType.maxMarks,
          grade,
          entryDate: new Date().toISOString().split("T")[0],
        });

        markId++;
      });
    });
  });

  return marks;
}

// Generate and export the data
export const mockStudents = generateStudents();
export const mockMarks = generateStudentMarks(mockStudents);
export const mockSubjects = subjects;
export const mockExamTypes = examTypes;
export const mockClassSections = classSections;

// Helper functions for data retrieval
export function getStudentsByClass(
  className: string,
  section?: string,
): Student[] {
  return mockStudents.filter(
    (s) => s.class === className && (section ? s.section === section : true),
  );
}

export function getMarksByStudent(
  studentId: string,
  examTypeId?: string,
): StudentMarks[] {
  return mockMarks.filter(
    (m) =>
      m.studentId === studentId &&
      (examTypeId ? m.examTypeId === examTypeId : true),
  );
}

export function getMarksByClassAndSubject(
  className: string,
  section: string,
  subjectId: string,
  examTypeId: string,
): StudentMarks[] {
  const classStudents = getStudentsByClass(className, section);
  const studentIds = classStudents.map((s) => s.id);

  return mockMarks.filter(
    (m) =>
      studentIds.includes(m.studentId) &&
      m.subjectId === subjectId &&
      m.examTypeId === examTypeId,
  );
}
