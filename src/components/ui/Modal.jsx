function Modal({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = "Confirm",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#111827] shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {title}
          </h2>
        </div>

        <div className="px-6 py-6">{children}</div>

        <div className="px-6 py-5 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-2xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;