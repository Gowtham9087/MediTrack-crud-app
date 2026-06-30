import { X, Save } from "lucide-react";

function EditAppointmentModal({ editId, setEditId, editData, setEditData, patients, doctors, updateAppointment }) {
  if (!editId) return null;
  const inputClass = "w-full bg-[#f8fafc] dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 px-5 h-[56px] rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm";

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="fixed inset-0" onClick={() => setEditId(null)}></div>
      <div className="relative bg-white dark:bg-[#111827] text-slate-900 dark:text-white p-6 sm:p-8 rounded-[2.5rem] w-full max-w-2xl shadow-2xl transition-all border border-slate-200 dark:border-slate-800">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black">Edit Appointment</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Update schedule or status.</p>
          </div>
          <button onClick={() => setEditId(null)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <select value={editData.patientId} onChange={(e) => setEditData({ ...editData, patientId: e.target.value })} className={`${inputClass} appearance-none`}>
            {patients.map((p) => (<option key={p.id} value={p.id}>{p.name} - {p.problem}</option>))}
          </select>

          <select value={editData.doctorId} onChange={(e) => setEditData({ ...editData, doctorId: e.target.value })} className={`${inputClass} appearance-none`}>
            {doctors.map((d) => (<option key={d.id} value={d.id}>{d.name} - {d.specialization}</option>))}
          </select>

          <input type="date" value={editData.appointmentDate} onChange={(e) => setEditData({ ...editData, appointmentDate: e.target.value })} className={inputClass} />
          <input type="time" value={editData.appointmentTime} onChange={(e) => setEditData({ ...editData, appointmentTime: e.target.value })} className={inputClass} />

          <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })} className={`${inputClass} appearance-none md:col-span-2 font-bold`}>
            <option value="Booked">Booked</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <textarea value={editData.reason} onChange={(e) => setEditData({ ...editData, reason: e.target.value })} className={`${inputClass} md:col-span-2 h-auto py-4 resize-none`} rows="2" placeholder="Reason" />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
          <button onClick={() => setEditId(null)} className="px-6 py-3 rounded-xl font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">Cancel</button>
          <button onClick={updateAppointment} className="flex items-center justify-center gap-2 bg-blue-400 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all">
            <Save size={18} /> Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditAppointmentModal;