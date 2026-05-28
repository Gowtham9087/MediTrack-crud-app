import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const downloadMedicinePDF = (medicine) => {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("Medicine Report", 14, 20);

  doc.setFontSize(12);

  autoTable(doc, {
    startY: 35,
    head: [["Field", "Value"]],
    body: [
      ["Medicine Name", medicine.name],
      ["Category", medicine.category],
      ["Stock", medicine.stock],
      ["Price", `Rs. ${medicine.price}`],
      ["Total Value", `Rs. ${medicine.stock * medicine.price}`],
      ["Status", medicine.stock <= 10 ? "Low Stock" : "In Stock"],
      ["Expiry Date", medicine.expiryDate],
    ],
  });

  doc.save(`${medicine.name}.pdf`);
};