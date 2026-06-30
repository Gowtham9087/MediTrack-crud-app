import { Save, UserRoundPlus } from "lucide-react";

function AddDoctorForm({ doctor, setDoctor, addDoctor, loading }) {
  const inputClass =
    "w-full bg-[#f8fafc] dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 " +
    "text-slate-900 dark:text-white placeholder-slate-400 px-5 h-[56px] rounded-2xl " +
    "outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm";

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-400 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
          <UserRoundPlus size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Register Doctor</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Fill the details to add a doctor.
          </p>
        </div>
      </div>

      <form onSubmit={addDoctor} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="relative w-full">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 font-extrabold text-sm pointer-events-none">
            Dr.
          </span>
          <input
            value={doctor.name}
            onChange={(e) => setDoctor({ ...doctor, name: e.target.value })}
            placeholder="First & Last Name"
            required
            className={`${inputClass} !pl-12`}
          />
        </div>

        {/* Specialization */}
        <input
          value={doctor.specialization}
          onChange={(e) => setDoctor({ ...doctor, specialization: e.target.value })}
          placeholder="Specialization"
          required
          className={inputClass}
        />

        {/* Email */}
        <input
          type="email"
          value={doctor.email}
          onChange={(e) => setDoctor({ ...doctor, email: e.target.value })}
          placeholder="Email Address"
          required
          className={inputClass}
        />

        {/* Phone */}
        <input
          type="tel"
          value={doctor.phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            if (value.length <= 10) setDoctor({ ...doctor, phone: value });
          }}
          placeholder="Phone Number (used as password)"
          required
          className={inputClass}
        />

        {/* Credentials Hint */}
        <div className="md:col-span-2 flex items-center gap-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl px-5 py-3.5">
          <span className="text-blue-500 text-xl">🔑</span>
          <p className="text-sm text-blue-700 dark:text-blue-300 font-semibold">
            Doctor login credentials:{" "}
            <span className="font-black">Email</span> as username &amp;{" "}
            <span className="font-black">Phone number</span> as password.
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 w-full h-[56px] mt-2 bg-blue-400 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
        >
          <Save size={20} />
          {loading ? "Saving..." : "Add Doctor"}
        </button>
      </form>
    </div>
  );
}

export default AddDoctorForm;