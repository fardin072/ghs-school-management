import { forwardRef } from "react";
import { Marksheet, Student } from "@shared/types";

interface MarksheetPDFProps {
  marksheet: Marksheet;
  student: Student;
}

export const MarksheetPDF = forwardRef<HTMLDivElement, MarksheetPDFProps>(
  ({ marksheet, student }, ref) => {
    const currentDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    return (
      <div
        ref={ref}
        className="bg-white p-8 max-w-4xl mx-auto"
        style={{
          minHeight: "297mm",
          width: "210mm",
          fontFamily: "Arial, sans-serif",
          fontSize: "12px",
          lineHeight: "1.4",
        }}
      >
        {/* Header */}
        <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">GHS</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                GUZIA HIGH SCHOOL
              </h1>
              <p className="text-sm text-gray-600">
                Affiliated to State Board of Education
              </p>
              <p className="text-xs text-gray-500">
                School Code: GHS001 | UDISE Code: 12345678901
              </p>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-blue-600 mt-2">
            ACADEMIC TRANSCRIPT
          </h2>
        </div>

        {/* Student Information */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div className="space-y-2">
            <div className="flex">
              <span className="font-semibold w-32">Student Name:</span>
              <span className="border-b border-gray-300 flex-1 pl-2">
                {student.name}
              </span>
            </div>
            <div className="flex">
              <span className="font-semibold w-32">Father's Name:</span>
              <span className="border-b border-gray-300 flex-1 pl-2">
                {student.fatherName}
              </span>
            </div>
            <div className="flex">
              <span className="font-semibold w-32">Mother's Name:</span>
              <span className="border-b border-gray-300 flex-1 pl-2">
                {student.motherName}
              </span>
            </div>
            <div className="flex">
              <span className="font-semibold w-32">Date of Birth:</span>
              <span className="border-b border-gray-300 flex-1 pl-2">
                {new Date(student.dateOfBirth).toLocaleDateString("en-IN")}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex">
              <span className="font-semibold w-32">Roll Number:</span>
              <span className="border-b border-gray-300 flex-1 pl-2">
                {student.rollNo}
              </span>
            </div>
            <div className="flex">
              <span className="font-semibold w-32">Class:</span>
              <span className="border-b border-gray-300 flex-1 pl-2">
                {marksheet.class}-{marksheet.section}
              </span>
            </div>
            <div className="flex">
              <span className="font-semibold w-32">Examination:</span>
              <span className="border-b border-gray-300 flex-1 pl-2">
                {marksheet.examType}
              </span>
            </div>
            <div className="flex">
              <span className="font-semibold w-32">Academic Year:</span>
              <span className="border-b border-gray-300 flex-1 pl-2">
                {marksheet.academicYear}
              </span>
            </div>
          </div>
        </div>

        {/* Marks Table */}
        <div className="mb-6">
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-gray-400 p-2 text-left">S.No.</th>
                <th className="border border-gray-400 p-2 text-left">
                  Subject
                </th>
                <th className="border border-gray-400 p-2 text-center">
                  Maximum Marks
                </th>
                <th className="border border-gray-400 p-2 text-center">
                  Marks Obtained
                </th>
                <th className="border border-gray-400 p-2 text-center">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody>
              {marksheet.subjects.map((subject, index) => (
                <tr key={subject.subjectId}>
                  <td className="border border-gray-400 p-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-400 p-2">
                    {subject.subjectName}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {subject.maxMarks}
                  </td>
                  <td className="border border-gray-400 p-2 text-center font-semibold">
                    {subject.marksObtained}
                  </td>
                  <td className="border border-gray-400 p-2 text-center font-semibold">
                    {subject.grade}
                  </td>
                </tr>
              ))}
              {/* Total Row */}
              <tr className="bg-blue-50 font-semibold">
                <td className="border border-gray-400 p-2 text-center"></td>
                <td className="border border-gray-400 p-2">TOTAL</td>
                <td className="border border-gray-400 p-2 text-center">
                  {marksheet.totalMaxMarks}
                </td>
                <td className="border border-gray-400 p-2 text-center">
                  {marksheet.totalMarks}
                </td>
                <td className="border border-gray-400 p-2 text-center">
                  {marksheet.overallGrade}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Results Summary */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div className="space-y-2">
            <div className="flex">
              <span className="font-semibold w-32">Total Marks:</span>
              <span className="font-bold">
                {marksheet.totalMarks} / {marksheet.totalMaxMarks}
              </span>
            </div>
            <div className="flex">
              <span className="font-semibold w-32">Percentage:</span>
              <span className="font-bold">{marksheet.percentage}%</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-32">Grade:</span>
              <span className="font-bold text-lg">
                {marksheet.overallGrade}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            {marksheet.rank && (
              <div className="flex">
                <span className="font-semibold w-32">Class Rank:</span>
                <span className="font-bold">{marksheet.rank}</span>
              </div>
            )}
            <div className="flex">
              <span className="font-semibold w-32">Result:</span>
              <span
                className={`font-bold ${
                  marksheet.percentage >= 33 ? "text-green-600" : "text-red-600"
                }`}
              >
                {marksheet.percentage >= 33 ? "PASS" : "FAIL"}
              </span>
            </div>
            <div className="flex">
              <span className="font-semibold w-32">Remarks:</span>
              <span className="italic">{marksheet.remarks}</span>
            </div>
          </div>
        </div>

        {/* Grading Scale */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Grading Scale:</h3>
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div>A+ (90-100%): Outstanding</div>
            <div>A (80-89%): Excellent</div>
            <div>B+ (70-79%): Very Good</div>
            <div>B (60-69%): Good</div>
            <div>C+ (50-59%): Satisfactory</div>
            <div>C (40-49%): Acceptable</div>
            <div>D (33-39%): Needs Improvement</div>
            <div>F (Below 33%): Fail</div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-800 pt-4 mt-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="border-t border-gray-400 pt-2 mt-12">
                <p className="font-semibold">Class Teacher</p>
              </div>
            </div>
            <div>
              <div className="border-t border-gray-400 pt-2 mt-12">
                <p className="font-semibold">Principal</p>
              </div>
            </div>
            <div>
              <div className="border-t border-gray-400 pt-2 mt-12">
                <p className="font-semibold">Date: {currentDate}</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-6 text-xs text-gray-500">
            <p>
              This is a computer-generated document. No signature is required.
            </p>
            <p>Generated on: {marksheet.generatedDate}</p>
          </div>
        </div>
      </div>
    );
  },
);

MarksheetPDF.displayName = "MarksheetPDF";
