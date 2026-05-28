import { Clock, CalendarPlus } from "lucide-react";

const TIME_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
];

// ⚡️ ADDED: 'existingAppointments' to the props
function AddAppointmentForm({ appointment, setAppointment, patients, doctors, bookAppointment, existingAppointments = [] }) {
  const inputClass =
    "w-full bg-[#f8fafc] dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 px-5 h-[56px] rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm";

  // ⚡️ 1. Get today's date string (YYYY-MM-DD) formatted for the user's local timezone
  const getTodayDateString = () => {
    const today = new Date();
    // Adjusting for timezone offset to ensure the date doesn't roll backward
    const offset = today.getTimezoneOffset() * 60000;
    return new Date(today.getTime() - offset).toISOString().split("T")[0];
  };

  const todayStr = getTodayDateString();

  // ⚡️ 2. Logic to filter out booked slots
  let availableSlots = [...TIME_SLOTS];

  // Only filter if both a doctor and a date have been selected
  if (appointment.doctorId && appointment.appointmentDate) {
    // Find all appointments that match the chosen doctor and date
    const bookedSlots = existingAppointments
      .filter((app) => 
        String(app.doctorId) === String(appointment.doctorId) && 
        app.appointmentDate === appointment.appointmentDate
      )
      .map((app) => app.appointmentTime); // Extract just the time string

    // Filter our master list to only keep slots that are NOT booked
    availableSlots = TIME_SLOTS.filter((slot) => !bookedSlots.includes(slot));
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
          <CalendarPlus size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Book Appointment</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Select a patient and schedule a time.</p>
        </div>
      </div>

      <form onSubmit={bookAppointment} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient */}
        <select
          name="patientId"
          value={appointment.patientId}
          onChange={(e) => setAppointment({ ...appointment, patientId: e.target.value })}
          required
          className={`${inputClass} appearance-none`}
        >
          <option value="" disabled>Select Patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.name} - {p.problem}</option>
          ))}
        </select>

        {/* Doctor */}
        <select
          name="doctorId"
          value={appointment.doctorId}
          onChange={(e) => {
            // Reset time slot when changing doctor so they don't accidentally book a newly blocked slot
            setAppointment({ ...appointment, doctorId: e.target.value, appointmentTime: "" });
          }}
          required
          className={`${inputClass} appearance-none`}
        >
          <option value="" disabled>Select Doctor</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>{d.name} - {d.specialization}</option>
          ))}
        </select>

        {/* Date */}
        <input
          type="date"
          name="appointmentDate"
          value={appointment.appointmentDate}
          // Reset time slot when changing date so they don't accidentally book a newly blocked slot
          onChange={(e) => setAppointment({ ...appointment, appointmentDate: e.target.value, appointmentTime: "" })}
          required
          min={todayStr} // ⚡️ Disables all past dates!
          className={inputClass}
        />

        {/* Time — AM/PM slot picker */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
            Select Time Slot
          </label>
          
          <div className="grid grid-cols-4 gap-2">
            {/* ⚡️ Now iterating over availableSlots instead of the full TIME_SLOTS */}
            {availableSlots.length > 0 ? (
              availableSlots.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setAppointment({ ...appointment, appointmentTime: slot })}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    appointment.appointmentTime === slot
                      ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-slate-50 dark:bg-[#0f172a] border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500"
                  }`}
                >
                  {slot}
                </button>
              ))
            ) : (
               // If a doctor and date are selected but no slots are left, show a message
              <div className="col-span-4 text-center py-2 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-200 dark:border-red-900">
                 {appointment.doctorId && appointment.appointmentDate 
                  ? "Fully Booked" 
                  : "Select Doctor & Date First"}
              </div>
            )}
          </div>
          {/* Hidden input to satisfy form required validation */}
          <input
            type="hidden"
            name="appointmentTime"
            value={appointment.appointmentTime || ""}
            required
          />
          {!appointment.appointmentTime && availableSlots.length > 0 && (
            <p className="text-[11px] text-slate-400 ml-1">No slot selected</p>
          )}
        </div>

        {/* Reason */}
        <textarea
          name="reason"
          value={appointment.reason}
          onChange={(e) => setAppointment({ ...appointment, reason: e.target.value })}
          placeholder="Reason for appointment"
          rows="3"
          required
          className={`${inputClass} md:col-span-2 h-auto py-4 resize-none`}
        />

        {/* Submit */}
        <button
          type="submit"
          className="md:col-span-2 w-full h-[56px] mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
        >
          <Clock size={20} />
          Book Appointment
        </button>
      </form>
    </div>
  );
}

export default AddAppointmentForm;