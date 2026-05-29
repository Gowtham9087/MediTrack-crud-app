import { X, Save } from "lucide-react";

function EditInvoiceModal({ editId, setEditId, editInvoice, setEditInvoice, updateInvoice }) {
  if (!editId) return null;
  const inputClass = "w-full bg-[#f8fafc] dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 px-5 h-[56px] rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm";
  const numberInputClass = `${inputClass} no-spinner`;

  const total = Number(editInvoice.consultationFee || 0) + Number(editInvoice.medicineFee || 0) + Number(editInvoice.labFee || 0) + Number(editInvoice.otherFee || 0);

  const handleChange = (e) => {
    // ⚡️ FIXED: Just basic state updating now. No forced constants.
    setEditInvoice({ ...editInvoice, [e.target.name]: e.target.value });
  };

  // ⚡️ 1. Get today's date string to prevent moving an invoice to a past date
  const getTodayDateString = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    return new Date(today.getTime() - offset).toISOString().split("T")[0];
  };

  const todayStr = getTodayDateString();

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="fixed inset-0" onClick={() => setEditId(null)}></div>
      <div className="relative bg-white dark:bg-[#111827] text-slate-900 dark:text-white p-6 sm:p-8 rounded-[2.5rem] w-full max-w-2xl shadow-2xl transition-all border border-slate-200 dark:border-slate-800">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black">Edit Invoice</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Modify billing record details.</p>
          </div>
          <button onClick={() => setEditId(null)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input name="patientName" value={editInvoice.patientName} onChange={handleChange} placeholder="Patient Name" className={inputClass} />
          <input name="doctorName" value={editInvoice.doctorName} onChange={handleChange} placeholder="Doctor Name" className={inputClass} />
          
          {/* ⚡️ FIXED: All inputs are now fully typable */}
          <input name="consultationFee" type="number" inputMode="numeric" value={editInvoice.consultationFee || ""} onChange={handleChange} placeholder="Consultation Fee" className={numberInputClass} />
          <input name="medicineFee" type="number" inputMode="numeric" value={editInvoice.medicineFee || ""} onChange={handleChange} placeholder="Medicine Fee" className={numberInputClass} />
          <input name="labFee" type="number" inputMode="numeric" value={editInvoice.labFee || ""} onChange={handleChange} placeholder="Lab Fee" className={numberInputClass} />
          <input name="otherFee" type="number" inputMode="numeric" value={editInvoice.otherFee || ""} onChange={handleChange} placeholder="Other Fee" className={numberInputClass} />
          
          <input 
            name="invoiceDate" 
            type="date" 
            value={editInvoice.invoiceDate} 
            onChange={handleChange} 
            min={todayStr} 
            className={inputClass} 
          />

          <select name="status" value={editInvoice.status} onChange={handleChange} className={`${inputClass} appearance-none font-bold`}>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Refunded">Refunded</option>
          </select>

          <div className="md:col-span-2 mt-2 rounded-2xl bg-blue-50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700 p-5 flex items-center justify-between">
            <p className="text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-sm">Total Amount</p>
            <h2 className="text-3xl font-black text-blue-600 dark:text-white">₹{total}</h2>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
          <button onClick={() => setEditId(null)} className="px-6 py-3 rounded-xl font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">Cancel</button>
          <button onClick={updateInvoice} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all">
            <Save size={18} /> Update Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditInvoiceModal;