import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function generatePDFFromElement(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  try {
    // Configure html2canvas for better quality
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
    });

    // Calculate PDF dimensions (A4 size)
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4");
    let position = 0;

    // Add first page
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Download the PDF
    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF");
  }
}

export function generateMarksheetFilename(
  studentName: string,
  rollNo: string,
  examType: string,
  academicYear: string,
): string {
  // Sanitize filename
  const sanitizedName = studentName.replace(/[^a-zA-Z0-9]/g, "_");
  const sanitizedExam = examType.replace(/[^a-zA-Z0-9]/g, "_");
  const sanitizedYear = academicYear.replace(/[^a-zA-Z0-9]/g, "_");

  return `Marksheet_${sanitizedName}_${rollNo}_${sanitizedExam}_${sanitizedYear}.pdf`;
}

export async function downloadMarksheetPDF(
  marksheetElement: HTMLElement,
  studentName: string,
  rollNo: string,
  examType: string,
  academicYear: string,
): Promise<void> {
  const filename = generateMarksheetFilename(
    studentName,
    rollNo,
    examType,
    academicYear,
  );

  await generatePDFFromElement(marksheetElement, filename);
}

export async function generateBulkPDFs(
  marksheetElements: HTMLElement[],
  studentData: Array<{
    name: string;
    rollNo: string;
    examType: string;
    academicYear: string;
  }>,
): Promise<void> {
  for (let i = 0; i < marksheetElements.length; i++) {
    const element = marksheetElements[i];
    const data = studentData[i];

    if (element && data) {
      const filename = generateMarksheetFilename(
        data.name,
        data.rollNo,
        data.examType,
        data.academicYear,
      );

      await generatePDFFromElement(element, filename);

      // Add delay between downloads to avoid browser blocking
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}
