import { Pill, Save } from "lucide-react";

function AddMedicineForm({
  medicine,
  setMedicine,
  addMedicine,
  medicineData,
}) {
  const medicineOptions = Object.keys(medicineData);

  const inputClass =
    "w-full bg-[#f8fafc] dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 px-5 h-[56px] rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm";

  // ⚡️ Get today's date string to prevent selecting past expiry dates
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
          <Pill size={24} />
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Add Medicine
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Add new medicine inventory.
          </p>
        </div>
      </div>

      <form
        onSubmit={addMedicine}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <select
          value={medicine.medicineName}
          onChange={(e) => {
            const selectedMedicine = e.target.value;
            setMedicine({
              ...medicine,
              medicineName: selectedMedicine,
              category: medicineData[selectedMedicine]?.category || "",
              price: medicineData[selectedMedicine]?.price || "",
            });
          }}
          required
          className={`${inputClass} appearance-none`}
        >
          <option value="">Select Medicine</option>
          {medicineOptions.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Category"
          value={medicine.category}
          readOnly
          className={inputClass}
        />

        <input
          type="number"
          placeholder="Stock"
          value={medicine.stock}
          onChange={(e) =>
            setMedicine({
              ...medicine,
              stock: e.target.value,
            })
          }
          required
          className={inputClass}
        />

        <input
          type="number"
          placeholder="Price"
          value={medicine.price}
          readOnly
          className={inputClass}
        />

        {/* ⚡️ Applied min attribute to block past dates */}
        <input
          type="date"
          value={medicine.expiryDate}
          onChange={(e) =>
            setMedicine({
              ...medicine,
              expiryDate: e.target.value,
            })
          }
          required
          min={todayStr}
          className={inputClass}
        />

        {/* ⚡️ Restored the original Medicine Value block */}
        <div className="rounded-2xl bg-blue-50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700 p-5 flex items-center justify-between">
          <p className="text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-sm">
            Medicine Value
          </p>
          <h2 className="text-3xl font-black text-blue-600 dark:text-white">
            ₹{Number(medicine.stock || 0) * Number(medicine.price || 0)}
          </h2>
        </div>

        <button
          type="submit"
          className="md:col-span-2 w-full h-[56px] mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
        >
          <Save size={20} />
          Add Medicine
        </button>
      </form>
    </div>
  );
}

export default AddMedicineForm;