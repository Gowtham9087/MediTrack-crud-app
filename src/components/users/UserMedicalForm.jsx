import {
  HeartPulse,
  Save,
} from "lucide-react";

function UserMedicalForm({
  patient,
  setPatient,
  handleChange,
  savePatient,
  loading,
  inputClass,
}) {
  return (
    <form
      onSubmit={savePatient}
      className="xl:col-span-2 bg-white dark:bg-[#111827] rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-7">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
          <HeartPulse size={22} />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Medical Information
          </h2>

          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Keep your medical details updated.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <input
          name="name"
          value={patient.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className={inputClass}
        />

        <input
          name="email"
          value={patient.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className={inputClass}
        />

        <input
          name="contact"
          value={patient.contact}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");

            if (value.length <= 10) {
              setPatient({
                ...patient,
                contact: value,
              });
            }
          }}
          placeholder="Contact Number"
          required
          className={inputClass}
        />

        <input
          name="age"
          type="number"
          value={patient.age}
          onChange={handleChange}
          placeholder="Age"
          required
          className={inputClass}
        />

        <select
          name="gender"
          value={patient.gender}
          onChange={handleChange}
          required
          className={inputClass}
        >
          <option value="">
            Select Gender
          </option>

          <option value="Male">
            Male
          </option>

          <option value="Female">
            Female
          </option>

          <option value="Other">
            Other
          </option>
        </select>

        <input
          name="address"
          value={patient.address}
          onChange={handleChange}
          placeholder="Address"
          required
          className={inputClass}
        />

        <textarea
          name="problem"
          value={patient.problem}
          onChange={handleChange}
          placeholder="Disease / Problem"
          required
          rows="5"
          className={`${inputClass} md:col-span-2 resize-none`}
        />

        <button
          disabled={loading}
          className="md:col-span-2 flex items-center justify-center gap-2 bg-blue-400 hover:bg-blue-500 active:scale-[0.98] transition-all duration-300 py-4 rounded-2xl text-white font-extrabold cursor-pointer shadow-lg shadow-blue-500/20 disabled:opacity-60"
        >
          <Save size={20} />

          {loading
            ? "Updating..."
            : "Update My Details"}
        </button>
      </div>
    </form>
  );
}

export default UserMedicalForm;