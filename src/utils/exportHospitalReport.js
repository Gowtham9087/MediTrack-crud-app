import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportHospitalReport = (analyticsData) => {
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric"
  });

  // Dark title banner matching the dark theme layout concept
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 40, "F");

  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("MediTrack Hospital Management Systems", 14, 25);

  doc.setFontSize(10);
  doc.setTextColor(140);
  doc.text(`Report Generated: ${dateStr}`, 14, 48);
  doc.text("Scope: Live Platform Analytics & System Performance Ledgers", 14, 54);

  const stats = analyticsData?.summary || {};
  const perf = analyticsData?.performance || {};

  autoTable(doc, {
    startY: 65,
    head: [["Metric Segment", "Aggregated Database Value", "Status Index"]],
    body: [
      ["Total Patient Registrations", stats.patients || "0", "Synchronized"],
      ["Total Appointments Managed", stats.appointments || "0", "Processed"],
      ["Gross Revenue Accumulated", `Rs. ${stats.revenue || "0"}`, "Settled"],
      ["Quarterly Performance Growth", stats.growth || "+0%", "Progressive"],
      ["Patient Growth Index", `${perf.patientGrowth || 0}%`, "Optimal"],
      ["Appointment Completion Rate", `${perf.appointmentCompletion || 0}%`, "Stable"],
      ["Revenue Target Efficiency", `${perf.revenueTarget || 0}%`, "On Track"],
      ["Feedback Satisfaction Score", `${perf.feedbackSatisfaction || 0}%`, "Excellent"]
    ],
    theme: "striped",
    headStyles: { fillColor: [37, 99, 235], fontStyle: "bold" },
    styles: { fontSize: 11, cellPadding: 6 }
  });

  doc.save(`MediTrack_Global_Analytics_${new Date().toISOString().split('T')[0]}.pdf`);
};