// Patients.jsx

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

  const showToast = (msg) => {
    setToast(msg);

    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    toastTimer.current = setTimeout(() => {
      setToast("");
    }, 3000);
  };

  const refreshPatients = async () => {
    try {
      const res = await fetch(`${API_URL}/patients`);
      const data = await res.json();
      setPatients(data);
    } catch (err) {
      console.log(err);
      showToast("Failed to fetch patients ❌");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await refreshPatients();
    };

    fetchData();

    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  const deletePatient = async (id) => {
    try {
      await fetch(`${API_URL}/patients/${id}`, {
        method: "DELETE",
      });

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
        },
        body: JSON.stringify(editData),
      });

      if (!res.ok) {
        showToast("Update failed ❌");
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

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      <div
        className="fixed inset-0 -z-20"
        style={{
          backgroundImage: "url('/bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] -z-10"></div>

      {toast && (
        <div className="fixed top-24 right-6 z-[9999] bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-4 rounded-xl shadow-2xl font-semibold">
          {toast}
        </div>
      )}

      <div className="relative z-10 px-6 py-10">
        <h1 className="text-5xl font-bold text-center mb-3 text-white tracking-wide">
          Patient List
        </h1>

        <p className="text-center text-cyan-200 mb-10">
          Manage and monitor all patient records efficiently
        </p>

        <div className="max-w-7xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-[0_0_40px_rgba(59,130,246,0.25)] text-white">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <p className="text-cyan-200 font-medium">
              Showing {filteredPatients.length} entries
            </p>

            <div className="flex items-center gap-3">
              <label className="font-semibold text-white">Search:</label>
              <input
                placeholder="Search patient..."
                className="bg-white/20 border border-white/20 px-4 py-3 rounded-xl outline-none text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="bg-white/10 text-cyan-300">
                  <th className="px-4 py-4 rounded-l-xl">#</th>
                  <th className="px-4 py-4">Name</th>
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4">Contact</th>
                  <th className="px-4 py-4">Address</th>
                  <th className="px-4 py-4">Age</th>
                  <th className="px-4 py-4">Gender</th>
                  <th className="px-4 py-4">Problem</th>
                  <th className="px-4 py-4 rounded-r-xl">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredPatients.map((p, i) => (
                  <tr
                    key={p.id}
                    className="bg-white/5 hover:bg-cyan-500/10 transition-all duration-300"
                  >
                    <td className="px-4 py-4 rounded-l-xl">{i + 1}</td>
                    <td className="px-4 py-4 font-semibold">{p.name}</td>
                    <td className="px-4 py-4">{p.email}</td>
                    <td className="px-4 py-4">{p.contact}</td>
                    <td className="px-4 py-4">{p.address}</td>
                    <td className="px-4 py-4">{p.age}</td>
                    <td className="px-4 py-4">{p.gender}</td>
                    <td className="px-4 py-4">{p.problem}</td>

                    <td className="px-4 py-4 rounded-r-xl">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(p)}
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 transition-all duration-300 text-white px-4 py-2 rounded-xl cursor-pointer shadow-lg"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => setDeleteId(p.id)}
                          className="bg-gradient-to-r from-red-500 to-pink-500 hover:scale-105 transition-all duration-300 text-white px-4 py-2 rounded-xl cursor-pointer shadow-lg"
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

          {filteredPatients.length === 0 && (
            <div className="text-center mt-10">
              <p className="text-2xl text-cyan-200 mb-2">
                No Patients Found
              </p>

              <p className="text-gray-300">
                Add patients to see records here
              </p>
            </div>
          )}
        </div>

        {editId && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[9998] px-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white p-8 rounded-3xl w-full max-w-3xl shadow-[0_0_40px_rgba(59,130,246,0.35)]">
              <h2 className="text-3xl font-bold mb-6 text-center">
                Edit Patient
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="p-4 bg-white/20 border border-white/20 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400"
                />

                <input
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                  className="p-4 bg-white/20 border border-white/20 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400"
                />

                <input
                  value={editData.contact}
                  onChange={(e) =>
                    setEditData({ ...editData, contact: e.target.value })
                  }
                  className="p-4 bg-white/20 border border-white/20 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400"
                />

                <input
                  value={editData.age}
                  onChange={(e) =>
                    setEditData({ ...editData, age: e.target.value })
                  }
                  className="p-4 bg-white/20 border border-white/20 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400"
                />

                <select
                  value={editData.gender}
                  onChange={(e) =>
                    setEditData({ ...editData, gender: e.target.value })
                  }
                  className="p-4 bg-white/20 border border-white/20 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400"
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
                  className="p-4 bg-white/20 border border-white/20 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400"
                />

                <textarea
                  value={editData.problem}
                  onChange={(e) =>
                    setEditData({ ...editData, problem: e.target.value })
                  }
                  className="md:col-span-2 p-4 bg-white/20 border border-white/20 rounded-xl outline-none resize-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setEditId(null)}
                  className="bg-gray-500/80 hover:bg-gray-500 px-5 py-3 rounded-xl cursor-pointer transition-all duration-300"
                >
                  Cancel
                </button>

                <button
                  onClick={updatePatient}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:scale-105 transition-all duration-300 px-5 py-3 rounded-xl cursor-pointer"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteId && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[9998] px-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white p-8 rounded-3xl w-full max-w-md text-center shadow-[0_0_40px_rgba(239,68,68,0.35)]">
              <h2 className="text-3xl font-bold mb-4">Confirm Delete</h2>

              <p className="mb-6 text-gray-300">
                Are you sure you want to delete this patient?
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setDeleteId(null)}
                  className="bg-gray-500/80 hover:bg-gray-500 px-5 py-3 rounded-xl cursor-pointer transition-all duration-300"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    deletePatient(deleteId);
                    setDeleteId(null);
                  }}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:scale-105 transition-all duration-300 px-5 py-3 rounded-xl cursor-pointer"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Patients;