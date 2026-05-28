import { Save, UserPlus } from "lucide-react";

function AddPatientForm({ patient, setPatient, handleChange, addPatient, loading }) {
  
  // ⚡️ This string holds all the styling to make the inputs tall, rounded, and soft-gray
  const inputClass = "w-full bg-[#f8fafc] dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 px-5 h-[56px] rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm";

  return (
    <div className="w-full">
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
          <UserPlus size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Patient Information</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Fill all required fields carefully.</p>
        </div>
      </div>

      <form onSubmit={addPatient} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input 
          name="name" 
          value={patient.name} 
          placeholder="Patient Name" 
          onChange={handleChange} 
          required 
          className={inputClass} 
        />
        
        <input 
          name="email" 
          type="email" 
          value={patient.email} 
          placeholder="Email Address" 
          onChange={handleChange} 
          required 
          className={inputClass} 
        />
        
        <input 
          name="contact" 
          type="tel" 
          value={patient.contact} 
          placeholder="Mobile Number" 
          onChange={(e) => { 
            const v = e.target.value.replace(/\D/g, ""); 
            if (v.length <= 10) setPatient({...patient, contact: v}); 
          }} 
          required 
          className={inputClass} 
        />
        
        <input 
          name="age" 
          type="number" 
          value={patient.age} 
          placeholder="Age" 
          onChange={handleChange} 
          required 
          className={inputClass} 
        />
        
        <select 
          name="gender" 
          value={patient.gender} 
          onChange={handleChange} 
          required 
          className={`${inputClass} appearance-none text-slate-600 dark:text-slate-300`}
        >
          <option value="" disabled>Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        
        <input 
          name="address" 
          value={patient.address} 
          placeholder="Address" 
          onChange={handleChange} 
          required 
          className={inputClass} 
        />
        
        <textarea 
          name="problem" 
          value={patient.problem} 
          placeholder="Disease / Problem" 
          onChange={handleChange} 
          required 
          rows="4" 
          className={`${inputClass} md:col-span-2 h-auto py-5 resize-none`} 
        />
        
        <button 
          type="submit" 
          disabled={loading} 
          className="md:col-span-2 w-full h-[56px] mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
        >
          <Save size={20} />
          {loading ? "Adding Patient..." : "Add Patient"}
        </button>
      </form>
    </div>
  );
}

export default AddPatientForm;