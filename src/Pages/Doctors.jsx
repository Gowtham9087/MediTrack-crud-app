import { useEffect, useRef, useState } from "react";
import { API_URL } from "../api";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  const [doctor, setDoctor] = useState({
    name: "",
    specialization: "",
    email: "",
    phone: "",
  });

  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [editDoctor, setEditDoctor] = useState({
    name: "",
    specialization: "",
    email: "",
    phone: "",
  });

  const token = localStorage.getItem("token");

  const inputClass =
    "w-full bg-white/15 border border-white/15 text-white placeholder-slate-300 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white/20 transition-all";

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch(`${API_URL}/appointments/doctors`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setDoctors(data);
    } catch (error) {
      console.log(error);
      showToast("Failed to fetch doctors ❌");
    }
  };

  useEffect(() => {
   const fetchDoctorsData = async () => {
      await fetchDoctors();
    };

    fetchDoctorsData();

    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const addDoctor = async (e) => {
    e.preventDefault();

    if (doctor.phone.length !== 10) {
      showToast("Phone number must be 10 digits ❌");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/appointments/doctors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(doctor),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Doctor add failed ❌");
        return;
      }

      showToast("Doctor added successfully ✔️");

      setDoctor({
        name: "",
        specialization: "",
        email: "",
        phone: "",
      });

      fetchDoctors();
    } catch (error) {
      console.log(error);
      showToast("Doctor add failed ❌");
    }
  };

  const startEdit = (doctor) => {
    setEditId(doctor.id);
    setEditDoctor({
      name: doctor.name,
      specialization: doctor.specialization,
      email: doctor.email,
      phone: doctor.phone,
    });
  };

  const updateDoctor = async () => {
    if (editDoctor.phone.length !== 10) {
      showToast("Phone number must be 10 digits ❌");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/appointments/doctors/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editDoctor),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Doctor update failed ❌");
        return;
      }

      showToast("Doctor updated successfully ✔️");
      setEditId(null);
      fetchDoctors();
    } catch (error) {
      console.log(error);
      showToast("Doctor update failed ❌");
    }
  };

  const deleteDoctor = async (id) => {
    try {
      const res = await fetch(`${API_URL}/appointments/doctors/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Doctor delete failed ❌");
        return;
      }

      showToast("Doctor deleted successfully ✔️");
      setDeleteId(null);
      fetchDoctors();
    } catch (error) {
      console.log(error);
      showToast("Doctor delete failed ❌");
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
            Doctor Management
          </p>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            Doctors
          </h1>

          <p className="text-cyan-100 mt-3 text-sm sm:text-base">
            Add, update and manage hospital doctor records
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl border border-white/15 p-5 sm:p-8 rounded-3xl text-white shadow-2xl mb-8">
          <h2 className="text-2xl font-bold mb-6">Add Doctor</h2>

          <form
            onSubmit={addDoctor}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <input
              value={doctor.name}
              onChange={(e) => setDoctor({ ...doctor, name: e.target.value })}
              placeholder="Doctor Name"
              required
              className={inputClass}
            />

            <input
              value={doctor.specialization}
              onChange={(e) =>
                setDoctor({ ...doctor, specialization: e.target.value })
              }
              placeholder="Specialization"
              required
              className={inputClass}
            />

            <input
              value={doctor.email}
              onChange={(e) => setDoctor({ ...doctor, email: e.target.value })}
              placeholder="Email"
              type="email"
              required
              className={inputClass}
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={doctor.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 10) {
                  setDoctor({ ...doctor, phone: value });
                }
              }}
              required
              className={inputClass}
            />

            <button className="md:col-span-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 py-4 rounded-2xl font-bold hover:-translate-y-1 active:scale-[0.98] transition-all">
              Add Doctor
            </button>
          </form>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl border border-white/15 p-5 sm:p-8 rounded-3xl text-white shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Doctor List</h2>
            <p className="text-cyan-200 font-semibold">
              Total: {doctors.length}
            </p>
          </div>

          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-[900px] border-separate border-spacing-y-3 text-left">
              <thead>
                <tr className="bg-white/10 text-cyan-300">
                  <th className="p-4 rounded-l-2xl">#</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Specialization</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4 rounded-r-2xl">Action</th>
                </tr>
              </thead>

              <tbody>
                {doctors.map((d, i) => (
                  <tr
                    key={d.id}
                    className="bg-white/5 hover:bg-cyan-500/10 transition-all"
                  >
                    <td className="p-4 rounded-l-2xl">{i + 1}</td>
                    <td className="p-4 font-semibold">{d.name}</td>
                    <td className="p-4">{d.specialization}</td>
                    <td className="p-4">{d.email}</td>
                    <td className="p-4">{d.phone}</td>

                    <td className="p-4 rounded-r-2xl">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(d)}
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 rounded-xl hover:scale-105 transition-all"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => setDeleteId(d.id)}
                          className="bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 rounded-xl hover:scale-105 transition-all"
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
            {doctors.map((d, i) => (
              <div
                key={d.id}
                className="bg-white/10 border border-white/10 rounded-3xl p-5 shadow-xl"
              >
                <p className="text-xs text-cyan-300 font-semibold">
                  Doctor #{i + 1}
                </p>

                <h2 className="text-xl font-bold mt-1">{d.name}</h2>
                <p className="text-cyan-200">{d.specialization}</p>

                <div className="mt-4 space-y-2 text-sm text-slate-200">
                  <p>Email: {d.email}</p>
                  <p>Phone: {d.phone}</p>
                </div>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => startEdit(d)}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 rounded-2xl font-semibold"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setDeleteId(d.id)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 px-4 py-3 rounded-2xl font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {doctors.length === 0 && (
            <p className="text-center text-cyan-200 mt-8">
              No doctors found
            </p>
          )}
        </div>
      </div>

      {editId && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex justify-center items-center z-[9998] px-4">
          <div className="bg-[#0B1120]/90 backdrop-blur-2xl border border-white/15 text-white p-5 sm:p-8 rounded-3xl w-full max-w-2xl shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
              Edit Doctor
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                value={editDoctor.name}
                onChange={(e) =>
                  setEditDoctor({ ...editDoctor, name: e.target.value })
                }
                placeholder="Doctor Name"
                className={inputClass}
              />

              <input
                value={editDoctor.specialization}
                onChange={(e) =>
                  setEditDoctor({
                    ...editDoctor,
                    specialization: e.target.value,
                  })
                }
                placeholder="Specialization"
                className={inputClass}
              />

              <input
                value={editDoctor.email}
                onChange={(e) =>
                  setEditDoctor({ ...editDoctor, email: e.target.value })
                }
                placeholder="Email"
                className={inputClass}
              />

              <input
                value={editDoctor.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 10) {
                    setEditDoctor({ ...editDoctor, phone: value });
                  }
                }}
                placeholder="Phone"
                className={inputClass}
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
                onClick={updateDoctor}
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
              Are you sure you want to delete this doctor?
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="bg-slate-600 hover:bg-slate-500 px-5 py-3 rounded-2xl"
              >
                Cancel
              </button>

              <button
                onClick={() => deleteDoctor(deleteId)}
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

export default Doctors;