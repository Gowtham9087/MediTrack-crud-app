import { useEffect, useState } from "react";
import { API_URL } from "../../api";
import { FileText, Download } from "lucide-react";
import EmptyState from "../../components/ui/EmptyState";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function UserBilling() {
  const [invoices, setInvoices] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);

  const currentUserEmail = localStorage.getItem("userEmail");
  const currentUserName = localStorage.getItem("userName");
  const token = localStorage.getItem("token");

  // Fetch Bills from Backend
  const fetchMyBills = async () => {
    try {
      const res = await fetch(`${API_URL}/billing`, { 
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          // STRICT FILTER: Only keep bills that belong to the logged-in user
          const myBills = data.filter(bill => 
            (bill.Patient && bill.Patient.email === currentUserEmail) || 
            (bill.patientEmail === currentUserEmail) || 
            (bill.patientName === currentUserName) ||
            (bill.Patient && bill.Patient.name === currentUserName)
          );
          setInvoices(myBills);
        }
      }
    } catch (err) {
      console.error("Failed to fetch billing history:", err);
    }
  };

  useEffect(() => {
    fetchMyBills();
    
    // Live polling: Check for new bills every 5 seconds
    const intervalId = setInterval(() => {
      fetchMyBills();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [token, currentUserEmail, currentUserName]);

  // ⚡️ THE FIX: Perfectly scaled A4 PDF Generation
  const handleDownload = async (invoice) => {
    setDownloadingId(invoice.id || invoice.invoiceNo);
    const invoiceNumber = invoice.invoiceNo || `INV-${String(invoice.id).padStart(3, '0')}`;
    
    // Create a temporary, hidden div to hold our receipt layout
    const receiptHTML = document.createElement("div");
    receiptHTML.style.position = "absolute";
    receiptHTML.style.left = "-9999px"; 
    receiptHTML.style.top = "0";
    receiptHTML.style.width = "794px"; // Standard A4 pixel width ratio
    receiptHTML.style.padding = "40px";
    receiptHTML.style.backgroundColor = "white";
    receiptHTML.style.fontFamily = "sans-serif";
    receiptHTML.style.color = "#1e293b";
    
    const dateStr = invoice.date || invoice.createdAt ? new Date(invoice.date || invoice.createdAt).toLocaleDateString('en-GB') : "N/A";
    const desc = invoice.Doctor ? `Consultation - Dr. ${invoice.Doctor.name}` : invoice.description || "Medical Services";
    const amt = invoice.amount || invoice.totalAmount || 0;
    const status = (invoice.status || "PENDING").toUpperCase();

    receiptHTML.innerHTML = `
      <div style="border: 2px solid #e2e8f0; border-radius: 16px; padding: 40px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f1f5f9; padding-bottom: 24px; margin-bottom: 24px;">
          <div>
            <h1 style="color: #2563eb; margin: 0; font-size: 32px; font-weight: 900;">MediTrack</h1>
            <p style="margin: 4px 0 0 0; color: #64748b; font-size: 14px;">Hospital Management System</p>
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0; font-size: 24px; color: #0f172a; font-weight: 900;">INVOICE</h2>
            <p style="margin: 4px 0 0 0; color: #64748b; font-size: 14px; font-weight: 600;">#${invoiceNumber}</p>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
          <div>
            <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase;">Billed To</p>
            <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 700; color: #0f172a;">${currentUserName || currentUserEmail}</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase;">Date of Issue</p>
            <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 700; color: #0f172a;">${dateStr}</p>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
          <thead>
            <tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0;">
              <th style="padding: 12px 16px; text-align: left; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase;">Description</th>
              <th style="padding: 12px 16px; text-align: right; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 16px; font-size: 14px; color: #334155; font-weight: 600;">${desc}</td>
              <td style="padding: 16px; text-align: right; font-size: 14px; color: #0f172a; font-weight: 700;">₹${amt}</td>
            </tr>
          </tbody>
        </table>

        <div style="display: flex; justify-content: space-between; align-items: center; background-color: #f8fafc; padding: 24px; border-radius: 12px;">
          <div>
            <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase;">Payment Status</p>
            <p style="margin: 4px 0 0 0; font-size: 14px; font-weight: 900; color: ${status === 'PAID' ? '#10b981' : status === 'CANCELLED' ? '#ef4444' : '#f59e0b'};">${status}</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase;">Total Due</p>
            <p style="margin: 4px 0 0 0; font-size: 24px; font-weight: 900; color: #2563eb;">₹${amt}</p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 40px; border-top: 2px dashed #e2e8f0; padding-top: 24px;">
          <p style="margin: 0; color: #94a3b8; font-size: 12px;">Thank you for choosing MediTrack for your healthcare needs.</p>
        </div>
      </div>
    `;

    document.body.appendChild(receiptHTML);

    try {
      // 1. Take a high-quality picture
      const canvas = await html2canvas(receiptHTML, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      
      // 2. Create a standard A4 PDF page (portrait, millimeters, a4)
      const pdf = new jsPDF("p", "mm", "a4");
      
      // 3. Calculate the exact width/height to fit on the A4 page without stretching
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // 4. Paste the image onto the PDF and download
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoiceNumber}_MediTrack_Invoice.pdf`);
      
    } catch (error) {
      console.error("Error generating PDF", error);
      alert("Failed to generate PDF invoice.");
    } finally {
      // Clean up the hidden element
      document.body.removeChild(receiptHTML);
      setDownloadingId(null);
    }
  };

  const getStatusStyle = (status) => {
    const s = (status || "PENDING").toLowerCase();
    if (s === "paid" || s === "completed") return "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400";
    if (s === "unpaid" || s === "failed") return "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400";
    return "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400";
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] px-6 py-5 text-slate-900 dark:text-white relative">
      <div className="max-w-[1650px] mx-auto">
        
        {/* HEADER SECTION */}
        <div className="mb-6">
          <p className="text-blue-500 font-bold text-sm">Patient Portal</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">My Billing History</h1>
        </div>

        {/* INVOICE TABLE */}
        {invoices.length > 0 ? (
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-[#1e293b] shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#1e293b] text-slate-900 dark:text-white text-[13px] font-semibold tracking-wide">
                  <th className="px-6 py-5 whitespace-nowrap">Invoice ID</th>
                  <th className="px-6 py-5 whitespace-nowrap">Description</th>
                  <th className="px-6 py-5 whitespace-nowrap">Amount</th>
                  <th className="px-6 py-5 whitespace-nowrap">Status</th>
                  <th className="px-6 py-5 whitespace-nowrap">Date</th>
                  <th className="px-6 py-5 text-center whitespace-nowrap">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, index) => {
                  const isDownloading = downloadingId === (invoice.id || invoice.invoiceNo);
                  return (
                    <tr 
                      key={index} 
                      className="border-b border-slate-100 dark:border-[#1e293b] hover:bg-slate-50 dark:hover:bg-[#020817]/50 transition-colors last:border-0"
                    >
                      <td className="px-6 py-4 font-bold text-[13px] text-slate-900 dark:text-white">
                        {invoice.invoiceNo || `INV-${String(invoice.id || index + 1).padStart(3, '0')}`}
                      </td>
                      <td className="px-6 py-4 text-[13px] font-medium text-slate-700 dark:text-slate-200">
                        {invoice.Doctor ? `Consultation - Dr. ${invoice.Doctor.name}` : invoice.description || "Medical Services"}
                      </td>
                      <td className="px-6 py-4 text-[13px] font-black text-slate-900 dark:text-white">
                        ₹{invoice.amount || invoice.totalAmount || 0}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-md text-[11px] font-black uppercase tracking-wider ${getStatusStyle(invoice.status)}`}>
                          {invoice.status || "PENDING"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-slate-600 dark:text-slate-400">
                        {invoice.date || invoice.createdAt ? new Date(invoice.date || invoice.createdAt).toLocaleDateString('en-GB') : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => handleDownload(invoice)}
                          disabled={isDownloading}
                          className={`p-2 rounded-lg transition-colors ${
                            isDownloading 
                              ? "text-slate-400 bg-slate-100 cursor-not-allowed" 
                              : "text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                          }`}
                          title="Download PDF Invoice"
                        >
                          {isDownloading ? (
                             <div className="w-[18px] h-[18px] border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                          ) : (
                             <Download size={18} />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-[#1e293b] rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
              <FileText size={28} />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">No Billing Records</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">You currently have no generated invoices or payment history.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserBilling;