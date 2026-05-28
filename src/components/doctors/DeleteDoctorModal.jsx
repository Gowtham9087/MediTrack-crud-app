function DeleteDoctorModal({ deleteId, setDeleteId, deleteDoctor }) {
  if (!deleteId) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={() => setDeleteId(null)}></div>
      
      {/* Shadcn style Card */}
      <div className="relative w-full max-w-[425px] rounded-xl bg-white dark:bg-[#0f172a] p-6 text-left shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
          Are you absolutely sure?
        </h2>
        
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          This action cannot be undone. This will permanently delete the doctor's record and remove their data from our servers.
        </p>

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2">
          <button
            type="button"
            onClick={() => setDeleteId(null)}
            className="mt-2 sm:mt-0 px-4 py-2 text-sm font-medium rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-transparent text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={() => deleteDoctor(deleteId)}
            className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm flex items-center justify-center"
          >
            Continue
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default DeleteDoctorModal;