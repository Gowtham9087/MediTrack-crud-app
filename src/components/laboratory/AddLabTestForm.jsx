import { FlaskConical, Save } from "lucide-react";

const STATUS_OPTIONS = ["Pending", "Processing", "Completed"];

function AddLabTestForm({ test, setTest, addTest, labTestData, patients = [] }) {
  const testOptions = Object.keys(labTestData);
  
  const inputClass = "w-full bg-[#f8fafc] dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 px-5 h-[56px] rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm";
  
  const totalAmount = Number(test.amount || 0) * Number(test.quantity || 1);

  // ⚡️ 1. Get today's date string to prevent selecting past dates
  const getTodayDateString = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    return new Date(today.getTime() - offset).toISOString().split("T")[0];
  };

  const todayStr = getTodayDateString();

  const handleSubmit = (e) => {
    e.preventDefault();
    addTest({ ...test, totalAmount });
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
          <FlaskConical size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Add Lab Test</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Add a new laboratory test record.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <select 
          name="patientName" id="patientName" 
          value={test.patientName} 
          onChange={(e) => setTest({ ...test, patientName: e.target.value })} 
          required 
          className={`${inputClass} appearance-none`}
        >
          <option value="">Select Patient</option>
          {patients.map((p) => {
            const name = p.name || p.patientName || p.fullName || `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim();
            return <option key={p.id} value={name}>{name}</option>;
          })}
        </select>

        <select 
          name="testName" id="testName" 
          value={test.testName} 
          onChange={(e) => { 
            const sel = e.target.value; 
            setTest({ ...test, testName: sel, amount: labTestData[sel]?.amount || "" }); 
          }} 
          required 
          className={`${inputClass} appearance-none`}
        >
          <option value="">Select Test</option>
          {testOptions.map((item, i) => <option key={i} value={item}>{item}</option>)}
        </select>

        <select 
          name="status" id="status" 
          value={test.status} 
          onChange={(e) => setTest({ ...test, status: e.target.value })} 
          className={`${inputClass} appearance-none`}
        >
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* ⚡️ 2. Apply min attribute here */}
        <input 
          type="date" name="date" id="date" 
          value={test.date} 
          onChange={(e) => setTest({ ...test, date: e.target.value })} 
          required 
          min={todayStr} 
          className={inputClass} 
        />
        
        <input 
          type="number" name="quantity" id="quantity" 
          min="1" 
          value={test.quantity} 
          onChange={(e) => setTest({ ...test, quantity: e.target.value })} 
          placeholder="Quantity" 
          required 
          className={inputClass} 
        />

        <div className={`${inputClass} flex items-center pointer-events-none text-slate-400`}>
          {test.amount ? `₹${test.amount} per test` : "Amount (auto-filled)"}
        </div>

        <div className="md:col-span-2 rounded-2xl bg-blue-50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
          <p className="text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-sm">Total Amount</p>
          <p className="text-xl font-black text-blue-600 dark:text-white">₹{totalAmount}</p>
        </div>

        <button type="submit" className="md:col-span-2 w-full h-[56px] bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md shadow-blue-500/20">
          <Save size={20} /> Add Test
        </button>
      </form>
    </div>
  );
}

export default AddLabTestForm;