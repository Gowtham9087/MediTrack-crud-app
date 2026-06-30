import { X, Save } from "lucide-react";

const STATUS_OPTIONS = ["Pending", "Processing", "Completed"];

function EditLabTestModal({ editId, setEditId, editTest, setEditTest, updateTest, patients = [] }) {
  if (!editId) return null;

  const inputClass =
    "w-full bg-[#f8fafc] dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 px-5 h-[56px] rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm";

  const handleChange = (e) => setEditTest({ ...editTest, [e.target.name]: e.target.value });

  const totalAmount = Number(editTest.amount || 0) * Number(editTest.quantity || 1);

  // ⚡️ 1. Get today's date string
  const getTodayDateString = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    return new Date(today.getTime() - offset).toISOString().split("T")[0];
  };

  const todayStr = getTodayDateString();

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="fixed inset-0" onClick={() => setEditId(null)} />

      <div className="relative bg-white dark:bg-[#111827] text-slate-900 dark:text-white p-6 sm:p-8 rounded-[2.5rem] w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black">Edit Lab Test</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Modify lab test details.</p>
          </div>
          <button
            onClick={() => setEditId(null)}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Patient */}
          <select
            name="patientName"
            value={editTest.patientName}
            onChange={handleChange}
            className={`${inputClass} appearance-none`}
          >
            <option value="">Select Patient</option>
            {patients.map((p) => {
              const name = p.name || p.patientName || p.fullName || `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim();
              return <option key={p.id} value={name}>{name}</option>;
            })}
            {editTest.patientName && !patients.some((p) => {
              const n = p.name || p.patientName || p.fullName || `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim();
              return n === editTest.patientName;
            }) && <option value={editTest.patientName}>{editTest.patientName}</option>}
          </select>

          <input
            name="testName"
            value={editTest.testName}
            onChange={handleChange}
            placeholder="Test Name"
            className={inputClass}
          />

          {/* Status */}
          <select
            name="status"
            value={editTest.status}
            onChange={handleChange}
            className={`${inputClass} appearance-none`}
          >
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* ⚡️ 2. Apply min attribute here */}
          <input
            name="date"
            type="date"
            value={editTest.date}
            onChange={handleChange}
            min={todayStr}
            className={inputClass}
          />

          {/* Quantity */}
          <input
            name="quantity"
            type="number"
            min="1"
            value={editTest.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            className={inputClass}
          />

          {/* Amount read-only display */}
          <div className={`${inputClass} flex items-center pointer-events-none text-slate-400`}>
            {editTest.amount ? `₹${editTest.amount} per test` : "Amount"}
          </div>

          {/* Total Amount — full width info bar */}
          <div className="md:col-span-2 rounded-2xl bg-blue-50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
            <p className="text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-sm">Total Amount</p>
            <p className="text-xl font-black text-blue-600 dark:text-white">₹{totalAmount}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
          <button
            onClick={() => setEditId(null)}
            className="px-6 py-3 rounded-xl font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={updateTest}
            className="flex items-center justify-center gap-2 bg-blue-400 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all"
          >
            <Save size={18} />
            Update Test
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditLabTestModal;