import { X, Save } from "lucide-react";

function EditDoctorModal({ editId, setEditId, editDoctor, setEditDoctor, updateDoctor }) {
  if (!editId) return null;

  const inputClass = "w-full bg-[#f8fafc] dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 px-5 h-[56px] rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm";

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="fixed inset-0" onClick={() => setEditId(null)}></div>

      <div className="relative bg-white dark:bg-[#111827] text-slate-900 dark:text-white p-6 sm:p-8 rounded-[2.5rem] w-full max-w-2xl shadow-2xl transition-all border border-slate-200 dark:border-slate-800">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black">Edit Doctor</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Update the doctor's information below.</p>
          </div>
          <button onClick={() => setEditId(null)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* ⚡️ Fixed "Dr." Prefix Input Group for the Edit Modal */}
          <div className="relative w-full">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 font-extrabold text-sm pointer-events-none">
              Dr.
            </span>
            <input
              name="name" id="edit-name"
              value={editDoctor.name}
              onChange={(e) => setEditDoctor({ ...editDoctor, name: e.target.value })}
              placeholder="First & Last Name"
              className={`${inputClass} !pl-12`}
            />
          </div>

          <input
            name="specialization" id="edit-spec"
            value={editDoctor.specialization}
            onChange={(e) => setEditDoctor({ ...editDoctor, specialization: e.target.value })}
            placeholder="Specialization"
            className={inputClass}
          />
          <input
            name="email" id="edit-email" type="email"
            value={editDoctor.email}
            onChange={(e) => setEditDoctor({ ...editDoctor, email: e.target.value })}
            placeholder="Email Address"
            className={inputClass}
          />
          <input
            name="phone" id="edit-phone" type="tel"
            value={editDoctor.phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 10) setEditDoctor({ ...editDoctor, phone: value });
            }}
            placeholder="Phone Number"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
          <button onClick={() => setEditId(null)} className="px-6 py-3 rounded-xl font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            Cancel
          </button>
          <button onClick={updateDoctor} className="flex items-center justify-center gap-2 bg-blue-400 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all">
            <Save size={18} />
            Update Doctor
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditDoctorModal;