import { useEffect, useRef, useState } from "react";
import { API_URL } from "../api";

function Appointments() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [toast, setToast] = useState("");

  const toastTimer = useRef(null);

  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);

  const [appointment, setAppointment] = useState({
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  });

  const [editData, setEditData] = useState({
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    status: "",
  });

  const token = localStorage.getItem("token");

  const inputClass =
    "w-full bg-white/15 border border-white/15 text-white placeholder-slate-300 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white/20 transition-all";

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  };

  const fetchData = async () => {
    try {
      const patientRes = await fetch(`${API_URL}/patients`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const doctorRes = await fetch(`${API_URL}/appointments/doctors`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const appointmentRes = await fetch(`${API_URL}/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPatients(await patientRes.json());
      setDoctors(await doctorRes.json());
      setAppointments(await appointmentRes.json());
    } catch (error) {
      console.log(error);
      showToast("Failed to fetch data ❌");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchData();
    };

    fetchData();

    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const bookAppointment = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(appointment),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Appointment booking failed ❌");
        return;
      }

      showToast("Appointment booked successfully ✔️");

      setAppointment({
        patientId: "",
        doctorId: "",
        appointmentDate: "",
        appointmentTime: "",
        reason: "",
      });

      fetchData();
    } catch (error) {
      console.log(error);
      showToast("Appointment booking failed ❌");
    }
  };

  const startEdit = (a) => {
    setEditId(a.id);
    setEditData({
      patientId: a.patientId || "",
      doctorId: a.doctorId || "",
      appointmentDate: a.appointmentDate || "",
      appointmentTime: a.appointmentTime || "",
      reason: a.reason || "",
      status: a.status || "Booked",
    });
  };

  const updateAppointment = async () => {
    try {
      const res = await fetch(`${API_URL}/appointments/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Appointment update failed ❌");
        return;
      }

      showToast("Appointment updated successfully ✔️");
      setEditId(null);
      fetchData();
    } catch (error) {
      console.log(error);
      showToast("Appointment update failed ❌");
    }
  };

  const deleteAppointment = async (id) => {
    try {
      const res = await fetch(`${API_URL}/appointments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Delete failed ❌");
        return;
      }

      showToast("Appointment deleted successfully ✔️");
      setDeleteId(null);
      fetchData();
    } catch (error) {
      console.log(error);
      showToast("Delete failed ❌");
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-80px)] relative overflow-hidden px-4 sm:px-6 py-10"
      style={{
        backgroundImage: "url('/doctor5.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[#020617]/75 backdrop-blur-[3px]" />

      {toast && (
        <div className="fixed top-24 right-4 left-4 sm:left-auto sm:right-6 z-[99999] bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-5 py-4 rounded-2xl shadow-2xl font-semibold text-center">
          {toast}
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <p className="inline-block mb-3 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-200 text-sm font-semibold">
            Appointment Management
          </p>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            Appointment Booking
          </h1>

          <p className="text-cyan-100 mt-3 text-sm sm:text-base">
            Book, update and monitor patient appointments
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl border border-white/15 p-5 sm:p-8 rounded-3xl text-white shadow-2xl mb-8">
          <h2 className="text-2xl font-bold mb-6">Book Appointment</h2>

          <form
            onSubmit={bookAppointment}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <select
              value={appointment.patientId}
              onChange={(e) =>
                setAppointment({ ...appointment, patientId: e.target.value })
              }
              required
              className={inputClass}
            >
              <option value="" className="text-black">
                Select Patient
              </option>

              {patients.map((p) => (
                <option key={p.id} value={p.id} className="text-black">
                  {p.name} - {p.problem}
                </option>
              ))}
            </select>

            <select
              value={appointment.doctorId}
              onChange={(e) =>
                setAppointment({ ...appointment, doctorId: e.target.value })
              }
              required
              className={inputClass}
            >
              <option value="" className="text-black">
                Select Doctor
              </option>

              {doctors.map((d) => (
                <option key={d.id} value={d.id} className="text-black">
                  {d.name} - {d.specialization}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={appointment.appointmentDate}
              onChange={(e) =>
                setAppointment({
                  ...appointment,
                  appointmentDate: e.target.value,
                })
              }
              required
              className={inputClass}
            />

            <input
              type="time"
              value={appointment.appointmentTime}
              onChange={(e) =>
                setAppointment({
                  ...appointment,
                  appointmentTime: e.target.value,
                })
              }
              required
              className={inputClass}
            />

            <textarea
              value={appointment.reason}
              onChange={(e) =>
                setAppointment({ ...appointment, reason: e.target.value })
              }
              placeholder="Reason for appointment"
              required
              className={`${inputClass} md:col-span-2 resize-none`}
            />

            <button className="md:col-span-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 py-4 rounded-2xl font-bold hover:-translate-y-1 active:scale-[0.98] transition-all">
              Book Appointment
            </button>
          </form>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl border border-white/15 p-5 sm:p-8 rounded-3xl text-white shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Appointment List</h2>
            <p className="text-cyan-200 font-semibold">
              Total: {appointments.length}
            </p>
          </div>

          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-[1150px] border-separate border-spacing-y-3 text-left">
              <thead>
                <tr className="bg-white/10 text-cyan-300">
                  <th className="p-4 rounded-l-2xl">Patient</th>
                  <th className="p-4">Doctor</th>
                  <th className="p-4">Specialization</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Time</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 rounded-r-2xl">Action</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((a) => (
                  <tr
                    key={a.id}
                    className="bg-white/5 hover:bg-cyan-500/10 transition-all"
                  >
                    <td className="p-4 rounded-l-2xl">
                      {a.Patient?.name || "Deleted Patient"}
                    </td>

                    <td className="p-4">{a.Doctor?.name}</td>
                    <td className="p-4">{a.Doctor?.specialization}</td>
                    <td className="p-4">{a.appointmentDate}</td>
                    <td className="p-4">{a.appointmentTime}</td>
                    <td className="p-4">{a.reason}</td>

                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-200 text-sm">
                        {a.status}
                      </span>
                    </td>

                    <td className="p-4 rounded-r-2xl">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(a)}
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 rounded-xl text-white font-semibold hover:scale-105 transition-all"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => setDeleteId(a.id)}
                          className="bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 rounded-xl text-white font-semibold hover:scale-105 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {appointments.map((a, i) => (
              <div
                key={a.id}
                className="bg-white/10 border border-white/10 rounded-3xl p-5 shadow-xl"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-xs text-cyan-300 font-semibold">
                      Appointment #{i + 1}
                    </p>

                    <h2 className="text-xl font-bold mt-1">
                      {a.Patient?.name || "Deleted Patient"}
                    </h2>

                    <p className="text-cyan-200">
                      Dr. {a.Doctor?.name || "Doctor"}
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-200 text-xs">
                    {a.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-200">
                  <p>Specialization: {a.Doctor?.specialization}</p>
                  <p>Date: {a.appointmentDate}</p>
                  <p>Time: {a.appointmentTime}</p>
                  <p>Reason: {a.reason}</p>
                </div>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => startEdit(a)}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 rounded-2xl font-semibold"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setDeleteId(a.id)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 px-4 py-3 rounded-2xl font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {appointments.length === 0 && (
            <p className="text-center text-cyan-200 mt-8">
              No appointments found
            </p>
          )}
        </div>
      </div>

      {editId && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex justify-center items-center z-[9998] px-4">
          <div className="bg-[#0B1120]/90 backdrop-blur-2xl border border-white/15 text-white p-5 sm:p-8 rounded-3xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
              Edit Appointment
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={editData.patientId}
                onChange={(e) =>
                  setEditData({ ...editData, patientId: e.target.value })
                }
                className={inputClass}
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id} className="text-black">
                    {p.name} - {p.problem}
                  </option>
                ))}
              </select>

              <select
                value={editData.doctorId}
                onChange={(e) =>
                  setEditData({ ...editData, doctorId: e.target.value })
                }
                className={inputClass}
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id} className="text-black">
                    {d.name} - {d.specialization}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={editData.appointmentDate}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    appointmentDate: e.target.value,
                  })
                }
                className={inputClass}
              />

              <input
                type="time"
                value={editData.appointmentTime}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    appointmentTime: e.target.value,
                  })
                }
                className={inputClass}
              />

              <select
                value={editData.status}
                onChange={(e) =>
                  setEditData({ ...editData, status: e.target.value })
                }
                className={inputClass}
              >
                <option value="Booked" className="text-black">
                  Booked
                </option>
                <option value="Completed" className="text-black">
                  Completed
                </option>
                <option value="Cancelled" className="text-black">
                  Cancelled
                </option>
              </select>

              <textarea
                value={editData.reason}
                onChange={(e) =>
                  setEditData({ ...editData, reason: e.target.value })
                }
                className={`${inputClass} md:col-span-2 resize-none`}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
              <button
                onClick={() => setEditId(null)}
                className="bg-slate-600 hover:bg-slate-500 px-5 py-3 rounded-2xl"
              >
                Cancel
              </button>

              <button
                onClick={updateAppointment}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 px-5 py-3 rounded-2xl font-semibold"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex justify-center items-center z-[9998] px-4">
          <div className="bg-[#0B1120]/90 backdrop-blur-2xl border border-white/15 text-white p-6 sm:p-8 rounded-3xl w-full max-w-md text-center shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Confirm Delete
            </h2>

            <p className="mb-6 text-slate-300">
              Are you sure you want to delete this appointment?
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="bg-slate-600 hover:bg-slate-500 px-5 py-3 rounded-2xl"
              >
                Cancel
              </button>

              <button
                onClick={() => deleteAppointment(deleteId)}
                className="bg-gradient-to-r from-red-500 to-pink-500 px-5 py-3 rounded-2xl font-semibold"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointments;