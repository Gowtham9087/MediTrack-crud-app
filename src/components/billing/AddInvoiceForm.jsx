import { CreditCard, Save } from "lucide-react";

function AddInvoiceForm({ invoice, setInvoice, addInvoice, patients, doctors }) {
  const inputClass = "w-full bg-[#f8fafc] dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 px-5 h-[56px] rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm";
  const numberInputClass = `${inputClass} no-spinner`;

  const total = Number(invoice.consultationFee || 0) + Number(invoice.medicineFee || 0) + Number(invoice.labFee || 0) + Number(invoice.otherFee || 0);

  const handleChange = (e) => {
    setInvoice({ ...invoice, [e.target.name]: e.target.value, consultationFee: CONSULTATION_FEE });
  };

  // ⚡️ 1. Get today's date string to prevent selecting past dates
  const getTodayDateString = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    return new Date(today.getTime() - offset).toISOString().split("T")[0];
  };

  const todayStr = getTodayDateString();

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
          <CreditCard size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Create Invoice</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Generate a new billing record.</p>
        </div>
      </div>

      <form onSubmit={addInvoice} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <select name="patientName" id="patientName" value={invoice.patientName} onChange={handleChange} required className={`${inputClass} appearance-none`}>
          <option value="" disabled>Select Patient</option>
          {patients.map((p) => (<option key={p.id} value={p.name}>{p.name}</option>))}
        </select>

        <select name="doctorName" id="doctorName" value={invoice.doctorName} onChange={handleChange} required className={`${inputClass} appearance-none`}>
          <option value="" disabled>Select Doctor</option>
          {doctors.map((d) => (<option key={d.id} value={d.name}>Dr. {d.name}</option>))}
        </select>

        <input name="consultationFee" id="consultationFee" type="text" value={`Consultation: ₹${CONSULTATION_FEE}`} readOnly className={`${inputClass} cursor-not-allowed opacity-70 font-semibold`} />
        <input name="medicineFee" id="medicineFee" type="number" inputMode="numeric" value={invoice.medicineFee} onChange={handleChange} placeholder="Medicine Fee" className={numberInputClass} />
        <input name="labFee" id="labFee" type="number" inputMode="numeric" value={invoice.labFee} onChange={handleChange} placeholder="Lab Fee" className={numberInputClass} />
        <input name="otherFee" id="otherFee" type="number" inputMode="numeric" value={invoice.otherFee} onChange={handleChange} placeholder="Other Fee" className={numberInputClass} />
        
        {/* ⚡️ 2. Apply the min attribute here */}
        <input 
          name="invoiceDate" 
          id="invoiceDate" 
          type="date" 
          value={invoice.invoiceDate} 
          onChange={handleChange} 
          required 
          min={todayStr} // Blocks any dates before today
          className={inputClass} 
        />

        <select name="status" id="status" value={invoice.status} onChange={handleChange} className={`${inputClass} appearance-none font-bold`}>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <div className="md:col-span-2 mt-2 rounded-2xl bg-blue-50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700 p-5 flex items-center justify-between">
          <p className="text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-sm">Total Amount</p>
          <h2 className="text-3xl font-black text-blue-600 dark:text-white">₹{total}</h2>
        </div>

        <button type="submit" className="md:col-span-2 w-full h-[56px] mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md shadow-blue-500/20">
          <Save size={20} /> Add Invoice
        </button>
      </form>
    </div>
  );
}

export default AddInvoiceForm;