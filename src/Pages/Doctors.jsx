import { useEffect, useRef, useState } from "react";
import { API_URL } from "../api";
import { Stethoscope, Plus, Search, X } from "lucide-react";

import AddDoctorForm from "../components/doctors/AddDoctorForm";
import EditDoctorModal from "../components/doctors/EditDoctorModal";
import DeleteDoctorModal from "../components/doctors/DeleteDoctorModal";
import DoctorTable from "../components/tables/DoctorTable";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [doctor, setDoctor] = useState({ name: "", specialization: "", email: "", phone: "" });
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [editDoctor, setEditDoctor] = useState({ name: "", specialization: "", email: "", phone: "" });

  // ✅ Read both keys — works whether logged in fresh or from old session
  const token = localStorage.getItem("admin_token") || localStorage.getItem("token");

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
      if (!res.ok) {
        showToast(data.message || "Failed to fetch doctors ❌");
        return;
      }
      setDoctors(data);
    } catch (error) {
      console.log(error);
      showToast("Failed to fetch doctors ❌");
    }
  };

  useEffect(() => {
    fetchDoctors();
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
      setDoctor({ name: "", specialization: "", email: "", phone: "" });
      setIsAddOpen(false);
      fetchDoctors();
    } catch (error) {
      console.log(error);
      showToast("Doctor add failed ❌");
    }
  };

  const startEdit = (doc) => {
    setEditId(doc.id);
    setEditDoctor({
      name: doc.name,
      specialization: doc.specialization,
      email: doc.email,
      phone: doc.phone,
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

  const filteredDoctors = doctors.filter((d) =>
    `${d.name} ${d.specialization} ${d.email} ${d.phone}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-white px-6 py-5 relative">

      {/* Toast */}
      {toast && (
        <div className="fixed top-28 right-6 z-[99999] bg-[#0f172a] border border-[#1e293b] text-white px-5 py-4 rounded-2xl shadow-2xl font-semibold">
          {toast}
        </div>
      )}

      <div className="max-w-[1650px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div>
            <p className="text-blue-500 font-bold mb-1 text-sm">Doctor Management</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Doctors</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm max-w-sm">
              Add, update and manage hospital doctor records.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="w-full sm:w-[320px] h-12 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] flex items-center px-4 gap-3 shadow-sm">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search doctors..."
                className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white text-sm"
              />
            </div>

            <button
              onClick={() => setIsAddOpen(true)}
              className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 transition-all text-sm shrink-0"
            >
              <Plus size={18} /> Add Doctor
            </button>
          </div>
        </div>

        <div className="mb-3 pl-1">
          <div className="inline-flex items-center gap-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] px-3.5 py-1.5 rounded-xl shadow-sm">
            <Stethoscope size={14} className="text-blue-500" />
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                Total Doctors
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white leading-none">
                {doctors.length}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0f172a] shadow-sm overflow-hidden w-full h-auto mx-auto">
          <DoctorTable
            doctors={filteredDoctors}
            startEdit={startEdit}
            setDeleteId={setDeleteId}
          />
        </div>
      </div>

      {/* Add Doctor Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9998] px-4">
          <div className="fixed inset-0" onClick={() => setIsAddOpen(false)} />
          <div className="relative bg-white dark:bg-[#111827] w-full max-w-3xl rounded-[2.5rem] p-8 sm:p-10 shadow-2xl z-10 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X size={20} />
            </button>
            <AddDoctorForm doctor={doctor} setDoctor={setDoctor} addDoctor={addDoctor} />
          </div>
        </div>
      )}

      <EditDoctorModal
        editId={editId}
        setEditId={setEditId}
        editDoctor={editDoctor}
        setEditDoctor={setEditDoctor}
        updateDoctor={updateDoctor}
      />

      <DeleteDoctorModal
        deleteId={deleteId}
        setDeleteId={setDeleteId}
        deleteDoctor={deleteDoctor}
      />
    </div>
  );
}

export default Doctors;