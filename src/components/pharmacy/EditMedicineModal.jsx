import { X, Save } from "lucide-react";

function EditMedicineModal({
  editId,
  setEditId,
  editMedicine,
  setEditMedicine,
  updateMedicine,
}) {
  if (!editId) return null;

  const inputClass =
    "w-full bg-[#f8fafc] dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 px-5 h-[56px] rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm";

  // ⚡️ Get today's date string
  const getTodayDateString = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    return new Date(today.getTime() - offset).toISOString().split("T")[0];
  };

  const todayStr = getTodayDateString();

  // ⚡️ Restored the total calculation
  const total =
    Number(editMedicine.stock || 0) * Number(editMedicine.price || 0);

  const handleChange = (e) => {
    setEditMedicine({
      ...editMedicine,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div
        className="fixed inset-0"
        onClick={() => setEditId(null)}
      />

      <div className="relative bg-white dark:bg-[#111827] text-slate-900 dark:text-white p-6 sm:p-8 rounded-[2.5rem] w-full max-w-2xl shadow-2xl transition-all border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black">Edit Medicine</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Modify medicine inventory details.
            </p>
          </div>

          <button
            onClick={() => setEditId(null)}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            name="medicineName"
            value={editMedicine.medicineName}
            onChange={handleChange}
            placeholder="Medicine Name"
            className={inputClass}
          />

          <input
            name="category"
            value={editMedicine.category}
            onChange={handleChange}
            placeholder="Category"
            className={inputClass}
          />

          <input
            name="stock"
            type="number"
            value={editMedicine.stock}
            onChange={handleChange}
            placeholder="Stock"
            className={inputClass}
          />

          <input
            name="price"
            type="number"
            value={editMedicine.price}
            onChange={handleChange}
            placeholder="Price"
            className={inputClass}
          />

          {/* ⚡️ Applied min attribute to block past dates */}
          <input
            name="expiryDate"
            type="date"
            value={editMedicine.expiryDate}
            onChange={handleChange}
            min={todayStr}
            className={inputClass}
          />

          {/* ⚡️ Restored the original Medicine Value block */}
          <div className="rounded-2xl bg-blue-50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700 p-5 flex items-center justify-between">
            <p className="text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-sm">
              Medicine Value
            </p>
            <h2 className="text-3xl font-black text-blue-600 dark:text-white">
              ₹{total}
            </h2>
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
            onClick={updateMedicine}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all"
          >
            <Save size={18} />
            Update Medicine
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditMedicineModal;