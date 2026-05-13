import { useEffect, useRef, useState } from "react";
import { API_URL } from "../api";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [editData, setEditData] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    age: "",
    gender: "",
    problem: "",
  });

  const token = localStorage.getItem("token");

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  };

  const refreshPatients = async () => {
    try {
      const res = await fetch(`${API_URL}/patients`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Failed to fetch patients ❌");
        return;
      }

      setPatients(data);
    } catch (err) {
      console.log(err);
      showToast("Failed to fetch patients ❌");
    }
  };

  useEffect(() => {
    const refreshPatients = async () => {
      try {
        const res = await fetch(`${API_URL}/patients`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) {
          showToast(data.message || "Failed to fetch patients ❌");
          return;
        }

        setPatients(data);
      } catch (err) {
        console.log(err);
        showToast("Failed to fetch patients ❌");
      }
    };

    refreshPatients();

    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const deletePatient = async (id) => {
    try {
      const res = await fetch(`${API_URL}/patients/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Delete failed ❌");
        return;
      }

      showToast("Patient deleted ✔️");
      refreshPatients();
    } catch (err) {
      console.log(err);
      showToast("Delete failed ❌");
    }
  };

  const startEdit = (patient) => {
    setEditId(patient.id);
    setEditData({
      name: patient.name,
      email: patient.email,
      contact: patient.contact,
      address: patient.address,
      age: patient.age,
      gender: patient.gender,
      problem: patient.problem,
    });
  };

  const updatePatient = async () => {
    try {
      const res = await fetch(`${API_URL}/patients/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Update failed ❌");
        return;
      }

      showToast("Patient updated ✔️");
      setEditId(null);
      refreshPatients();
    } catch (err) {
      console.log(err);
      showToast("Update failed ❌");
    }
  };

  const filteredPatients = patients.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const inputClass =
    "w-full bg-white/15 border border-white/15 text-white placeholder-slate-300 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white/20 transition-all";

  return (
    <div
      className="min-h-[calc(100vh-80px)] relative overflow-hidden px-4 sm:px-6 py-10"
      style={{
        backgroundImage: "url('/bg.jpg')",
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
            Patient Management
          </p>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            Patient List
          </h1>

          <p className="text-cyan-100 mt-3 text-sm sm:text-base">
            Manage, update and monitor all patient records
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl border border-white/15 p-5 sm:p-8 rounded-3xl shadow-2xl text-white">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div>
              <p className="text-cyan-200 font-semibold">
                Showing {filteredPatients.length} entries
              </p>
              <p className="text-slate-300 text-sm">
                Total patients: {patients.length}
              </p>
            </div>

            <input
              placeholder="Search patient..."
              className="w-full md:w-80 bg-white/15 border border-white/15 px-5 py-3 rounded-2xl outline-none text-white placeholder-slate-300 focus:ring-2 focus:ring-cyan-400 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="bg-white/10 text-cyan-300">
                  <th className="px-4 py-4 rounded-l-2xl">#</th>
                  <th className="px-4 py-4">Name</th>
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4">Contact</th>
                  <th className="px-4 py-4">Address</th>
                  <th className="px-4 py-4">Age</th>
                  <th className="px-4 py-4">Gender</th>
                  <th className="px-4 py-4">Problem</th>
                  <th className="px-4 py-4 rounded-r-2xl">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredPatients.map((p, i) => (
                  <tr
                    key={p.id}
                    className="bg-white/5 hover:bg-cyan-500/10 transition-all"
                  >
                    <td className="px-4 py-4 rounded-l-2xl">{i + 1}</td>
                    <td className="px-4 py-4 font-semibold">{p.name}</td>
                    <td className="px-4 py-4">{p.email}</td>
                    <td className="px-4 py-4">{p.contact}</td>
                    <td className="px-4 py-4">{p.address}</td>
                    <td className="px-4 py-4">{p.age}</td>
                    <td className="px-4 py-4">{p.gender}</td>
                    <td className="px-4 py-4">{p.problem}</td>
                    <td className="px-4 py-4 rounded-r-2xl">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(p)}
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 rounded-xl hover:scale-105 transition-all"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => setDeleteId(p.id)}
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
            {filteredPatients.map((p, i) => (
              <div
                key={p.id}
                className="bg-white/10 border border-white/10 rounded-3xl p-5 shadow-xl"
              >
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <p className="text-xs text-cyan-300 font-semibold">
                      Patient #{i + 1}
                    </p>
                    <h2 className="text-xl font-bold text-white">{p.name}</h2>
                    <p className="text-sm text-slate-300">{p.email}</p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-200 text-xs">
                    {p.gender}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 text-sm">
                  <p>
                    <span className="text-cyan-300">Contact:</span> {p.contact}
                  </p>
                  <p>
                    <span className="text-cyan-300">Age:</span> {p.age}
                  </p>
                  <p>
                    <span className="text-cyan-300">Address:</span> {p.address}
                  </p>
                  <p>
                    <span className="text-cyan-300">Problem:</span> {p.problem}
                  </p>
                </div>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => startEdit(p)}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 rounded-2xl font-semibold"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setDeleteId(p.id)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 px-4 py-3 rounded-2xl font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center mt-10">
              <p className="text-2xl text-cyan-200 mb-2">No Patients Found</p>
              <p className="text-slate-300">Add patients to see records here</p>
            </div>
          )}
        </div>
      </div>

      {editId && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex justify-center items-center z-[9998] px-4">
          <div className="bg-[#0B1120]/90 backdrop-blur-2xl border border-white/15 text-white p-5 sm:p-8 rounded-3xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
              Edit Patient
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className={inputClass}
                placeholder="Name"
              />

              <input
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
                className={inputClass}
                placeholder="Email"
              />

              <input
                value={editData.contact}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 10) {
                    setEditData({ ...editData, contact: value });
                  }
                }}
                className={inputClass}
                placeholder="Contact"
              />

              <input
                value={editData.age}
                onChange={(e) =>
                  setEditData({ ...editData, age: e.target.value })
                }
                className={inputClass}
                placeholder="Age"
              />

              <select
                value={editData.gender}
                onChange={(e) =>
                  setEditData({ ...editData, gender: e.target.value })
                }
                className={inputClass}
              >
                <option className="text-black">Male</option>
                <option className="text-black">Female</option>
                <option className="text-black">Other</option>
              </select>

              <input
                value={editData.address}
                onChange={(e) =>
                  setEditData({ ...editData, address: e.target.value })
                }
                className={inputClass}
                placeholder="Address"
              />

              <textarea
                value={editData.problem}
                onChange={(e) =>
                  setEditData({ ...editData, problem: e.target.value })
                }
                className={`${inputClass} md:col-span-2 resize-none`}
                placeholder="Disease / Problem"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <button
                onClick={() => setEditId(null)}
                className="bg-slate-600 hover:bg-slate-500 px-5 py-3 rounded-2xl transition-all"
              >
                Cancel
              </button>

              <button
                onClick={updatePatient}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 px-5 py-3 rounded-2xl font-semibold hover:scale-105 transition-all"
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
              Are you sure you want to delete this patient?
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="bg-slate-600 hover:bg-slate-500 px-5 py-3 rounded-2xl"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  deletePatient(deleteId);
                  setDeleteId(null);
                }}
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

export default Patients;