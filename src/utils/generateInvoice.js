import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoice = (invoice) => {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("MediTrack", 20, 20);

  doc.setFontSize(12);
  doc.text("Hospital Management System", 20, 28);

  doc.line(20, 35, 190, 35);

  doc.setFontSize(14);
  doc.text(`Invoice No: ${invoice.invoiceNumber}`, 20, 48);
  doc.text(`Date: ${invoice.invoiceDate}`, 20, 58);
  doc.text(`Patient: ${invoice.patientName}`, 20, 68);
  doc.text(`Doctor: ${invoice.doctorName}`, 20, 78);
  doc.text(`Status: ${invoice.status}`, 20, 88);

  autoTable(doc, {
    startY: 100,
    head: [["Description", "Amount"]],
    body: [
      ["Consultation Fee", `Rs. ${invoice.consultationFee}`],
      ["Medicine Fee", `Rs. ${invoice.medicineFee}`],
      ["Lab Fee", `Rs. ${invoice.labFee}`],
      ["Other Fee", `Rs. ${invoice.otherFee}`],
      ["Total Amount", `Rs. ${invoice.totalAmount}`],
    ],
  });

  doc.save(`${invoice.invoiceNumber}.pdf`);
};