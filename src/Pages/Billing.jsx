import { useEffect, useRef, useState } from "react";
import { API_URL } from "../api";
import { CreditCard, Plus, Search, X } from "lucide-react";

import AddInvoiceForm from "../components/billing/AddInvoiceForm";
import EditInvoiceModal from "../components/billing/EditInvoiceModal";
import DeleteInvoiceModal from "../components/billing/DeleteInvoiceModal";
import BillingTable from "../components/tables/BillingTable";

function Billing() {
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  const toastTimer = useRef(null);

  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [invoice, setInvoice] = useState({
    patientName: "", doctorName: "", consultationFee: 500, medicineFee: "", labFee: "", otherFee: "", status: "Pending", invoiceDate: "",
  });

  const [editInvoice, setEditInvoice] = useState({
    patientName: "", doctorName: "", consultationFee: 500, medicineFee: "", labFee: "", otherFee: "", status: "Pending", invoiceDate: "",
  });

  const token = localStorage.getItem("token");

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  };

  const fetchBillingData = async () => {
    try {
      const invoiceRes = await fetch(`${API_URL}/billing`, { headers: { Authorization: `Bearer ${token}` } });
      const patientRes = await fetch(`${API_URL}/patients`, { headers: { Authorization: `Bearer ${token}` } });
      const doctorRes = await fetch(`${API_URL}/appointments/doctors`, { headers: { Authorization: `Bearer ${token}` } });

      const invoiceData = await invoiceRes.json();
      const patientData = await patientRes.json();
      const doctorData = await doctorRes.json();

      if (!invoiceRes.ok) return showToast(invoiceData.message || "Failed to fetch invoices ❌");
      if (!patientRes.ok) return showToast(patientData.message || "Failed to fetch patients ❌");
      if (!doctorRes.ok) return showToast(doctorData.message || "Failed to fetch doctors ❌");

      setInvoices(Array.isArray(invoiceData) ? invoiceData : []);
      setPatients(Array.isArray(patientData) ? patientData : []);
      setDoctors(Array.isArray(doctorData) ? doctorData : []);
    } catch (error) {
      console.log(error);
      showToast("Failed to fetch billing data ❌");
    }
  };

  useEffect(() => {
    fetchBillingData();
    return () => { if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, []);

  const addInvoice = async (e) => {
    e.preventDefault();
    
    // Calculate total and force numbers to prevent MongoDB 500 crashes
    const calculatedTotal = 
      500 + 
      (Number(invoice.medicineFee) || 0) + 
      (Number(invoice.labFee) || 0) + 
      (Number(invoice.otherFee) || 0);

    const payload = { 
      ...invoice, 
      consultationFee: 500,
      medicineFee: Number(invoice.medicineFee) || 0,
      labFee: Number(invoice.labFee) || 0,
      otherFee: Number(invoice.otherFee) || 0,
      totalAmount: calculatedTotal
    };

    try {
      const res = await fetch(`${API_URL}/billing`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Backend Error:", data); 
        return showToast(data.message || "Invoice creation failed ❌");
      }

      showToast("Invoice added successfully ✔️");
      setInvoice({ patientName: "", doctorName: "", consultationFee: 500, medicineFee: "", labFee: "", otherFee: "", status: "Pending", invoiceDate: "" });
      setIsAddOpen(false);
      fetchBillingData();
    } catch (error) {
      console.log(error);
      showToast("Invoice creation failed ❌");
    }
  };

  const startEdit = (invoice) => {
    setEditId(invoice.id);
    setEditInvoice({
      patientName: invoice.patientName || "", doctorName: invoice.doctorName || "", consultationFee: invoice.consultationFee || 500,
      medicineFee: invoice.medicineFee || "", labFee: invoice.labFee || "", otherFee: invoice.otherFee || "", status: invoice.status || "Pending", invoiceDate: invoice.invoiceDate || "",
    });
  };

  const updateInvoice = async () => {
    // Calculate total and force numbers for the update payload too
    const calculatedTotal = 
      500 + 
      (Number(editInvoice.medicineFee) || 0) + 
      (Number(editInvoice.labFee) || 0) + 
      (Number(editInvoice.otherFee) || 0);

    const payload = { 
      ...editInvoice, 
      consultationFee: 500,
      medicineFee: Number(editInvoice.medicineFee) || 0,
      labFee: Number(editInvoice.labFee) || 0,
      otherFee: Number(editInvoice.otherFee) || 0,
      totalAmount: calculatedTotal
    };

    try {
      const res = await fetch(`${API_URL}/billing/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) return showToast(data.message || "Invoice update failed ❌");

      showToast("Invoice updated successfully ✔️");
      setEditId(null);
      fetchBillingData();
    } catch (error) {
      console.log(error);
      showToast("Invoice update failed ❌");
    }
  };

  const deleteInvoice = async (id) => {
    try {
      const res = await fetch(`${API_URL}/billing/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) return showToast(data.message || "Invoice delete failed ❌");

      showToast("Invoice deleted successfully ✔️");
      setDeleteId(null);
      fetchBillingData();
    } catch (error) {
      console.log(error);
      showToast("Invoice delete failed ❌");
    }
  };

  const filteredInvoices = invoices.filter((invoice) =>
    `${invoice.invoiceNumber} ${invoice.patientName} ${invoice.doctorName} ${invoice.status}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = invoices.filter((item) => item.status === "Paid").reduce((sum, item) => sum + Number(item.totalAmount || 0), 0);
  const pendingPayments = invoices.filter((item) => item.status === "Pending").reduce((sum, item) => sum + Number(item.totalAmount || 0), 0);
  const paidInvoices = invoices.filter((item) => item.status === "Paid").length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-white px-6 py-5 relative">
      {toast && (
        <div className="fixed top-28 right-6 z-[99999] bg-[#0f172a] border border-[#1e293b] text-white px-5 py-4 rounded-2xl shadow-2xl font-semibold">
          {toast}
        </div>
      )}

      <div className="max-w-[1650px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div>
            <p className="text-blue-500 font-bold mb-1 text-sm">Billing Management</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Billing & Payments</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm max-w-sm">Manage invoices, payments and hospital billing records.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="w-full sm:w-[320px] h-12 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] flex items-center px-4 gap-3 shadow-sm">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search invoices..." className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white text-sm" />
            </div>
            
            <button 
              onClick={() => setIsAddOpen(true)} 
              className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 transition-all text-sm shrink-0"
            >
              <Plus size={18} /> New Invoice
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <div className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] p-6 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">Total Revenue</p>
            <h2 className="text-3xl font-black mt-2">₹{totalRevenue}</h2>
          </div>
          <div className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] p-6 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">Pending Payments</p>
            <h2 className="text-3xl font-black mt-2 text-orange-500 dark:text-orange-400">₹{pendingPayments}</h2>
          </div>
          <div className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] p-6 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">Paid Invoices</p>
            <h2 className="text-3xl font-black mt-2 text-emerald-500 dark:text-emerald-400">{paidInvoices}</h2>
          </div>
          <div className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] p-6 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">Total Invoices</p>
            <h2 className="text-3xl font-black mt-2">{invoices.length}</h2>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0f172a] shadow-sm overflow-hidden w-full h-auto mx-auto">
          {filteredInvoices.length > 0 ? (
            <BillingTable invoices={filteredInvoices} startEdit={startEdit} setDeleteId={setDeleteId} />
          ) : (
            <div className="py-20 text-center">
              <CreditCard size={42} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <h2 className="text-2xl font-black">No Invoices Found</h2>
              <p className="text-slate-500 mt-2">Create invoices to see billing records here.</p>
            </div>
          )}
        </div>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9998] px-4">
          <div className="fixed inset-0" onClick={() => setIsAddOpen(false)} />
          <div className="relative bg-white dark:bg-[#111827] w-full max-w-3xl rounded-[2.5rem] p-8 sm:p-10 shadow-2xl z-10 border border-slate-200 dark:border-slate-800">
            <button onClick={() => setIsAddOpen(false)} className="absolute top-6 right-6 w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer text-slate-500 hover:text-slate-900 dark:hover:text-white"><X size={20} /></button>
            <AddInvoiceForm invoice={invoice} setInvoice={setInvoice} addInvoice={addInvoice} patients={patients} doctors={doctors} />
          </div>
        </div>
      )}

      <EditInvoiceModal editId={editId} setEditId={setEditId} editInvoice={editInvoice} setEditInvoice={setEditInvoice} updateInvoice={updateInvoice} />
      <DeleteInvoiceModal deleteId={deleteId} setDeleteId={setDeleteId} deleteInvoice={deleteInvoice} />
    </div>
  );
}

export default Billing;