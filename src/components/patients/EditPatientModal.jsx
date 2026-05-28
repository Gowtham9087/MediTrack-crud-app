import { X, Save } from "lucide-react";

function EditPatientModal({
  editId,
  editData,
  setEditData,
  setEditId,
  updatePatient,
}) {
  if (!editId) return null;

  const inputClass =
    "w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[9998] px-4">
      <div className="bg-white dark:bg-[#111827] text-slate-900 dark:text-white p-5 sm:p-8 rounded-3xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Edit Patient
          </h2>

          <button
            onClick={() => setEditId(null)}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={editData.name}
            onChange={(e) =>
              setEditData({ ...editData, name: e.target.value })
            }
            className={inputClass}
            placeholder="Name"
          />

          <input
            value={editData.email}
            onChange={(e) =>
              setEditData({ ...editData, email: e.target.value })
            }
            className={inputClass}
            placeholder="Email"
          />

          <input
            value={editData.contact}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 10) {
                setEditData({ ...editData, contact: value });
              }
            }}
            className={inputClass}
            placeholder="Contact"
          />

          <input
            value={editData.age}
            onChange={(e) =>
              setEditData({ ...editData, age: e.target.value })
            }
            className={inputClass}
            placeholder="Age"
          />

          <select
            value={editData.gender}
            onChange={(e) =>
              setEditData({ ...editData, gender: e.target.value })
            }
            className={inputClass}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <input
            value={editData.address}
            onChange={(e) =>
              setEditData({ ...editData, address: e.target.value })
            }
            className={inputClass}
            placeholder="Address"
          />

          <textarea
            value={editData.problem}
            onChange={(e) =>
              setEditData({ ...editData, problem: e.target.value })
            }
            className={`${inputClass} md:col-span-2 resize-none`}
            placeholder="Disease / Problem"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button
            onClick={() => setEditId(null)}
            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-5 py-3 rounded-2xl font-bold transition-all"
          >
            Cancel
          </button>

          <button
            onClick={updatePatient}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all"
          >
            <Save size={18} />
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditPatientModal;