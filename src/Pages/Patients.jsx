import { useEffect, useRef, useState } from "react";
import { API_URL } from "../api";
import { Users, Plus, Search, X } from "lucide-react";

import PatientTable from "../components/tables/PatientTable";
import AddPatientForm from "../components/patients/AddPatientForm";
import EditPatientModal from "../components/patients/EditPatientModal";
import DeletePatientModal from "../components/patients/DeletePatientModal";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [newPatient, setNewPatient] = useState({
    name: "", email: "", contact: "", age: "", gender: "", address: "", problem: ""
  });
  const [addLoading, setAddLoading] = useState(false);

  const [editData, setEditData] = useState({
    name: "", email: "", contact: "", address: "", age: "", gender: "", problem: ""
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
      if (!res.ok) return;
      setPatients(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    refreshPatients();
  }, []);

  const handleNewPatientChange = (e) => {
    const { name, value } = e.target;
    setNewPatient({ ...newPatient, [name]: value });
  };

  const handleAddPatientSubmit = async (e) => {
    e.preventDefault();
    if (newPatient.contact.length !== 10) {
      showToast("Contact must be 10 digits ❌");
      return;
    }
    setAddLoading(true);
    try {
      const res = await fetch(`${API_URL}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newPatient),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Patient added! ✔️");
        setIsAddOpen(false);
        setNewPatient({ name: "", email: "", contact: "", age: "", gender: "", address: "", problem: "" });
        refreshPatients();
      } else {
        showToast(data.message || "Failed to add patient ❌");
      }
    } catch (err) {
      showToast("Error adding patient ❌");
    } finally {
      setAddLoading(false);
    }
  };

  const startEdit = (patient) => {
    setEditId(patient.id);
    setEditData({
      name: patient.name, email: patient.email, contact: patient.contact, address: patient.address, age: patient.age, gender: patient.gender, problem: patient.problem,
    });
  };

  const updatePatient = async () => {
    if (editData.contact.length !== 10) {
      showToast("Contact number must be 10 digits ❌");
      return;
    }
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
      setDeleteId(null);
      refreshPatients();
    } catch (err) {
      console.log(err);
      showToast("Delete failed ❌");
    }
  };

  const filteredPatients = patients.filter((p) =>
    `${p.name} ${p.email} ${p.contact} ${p.problem}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-white px-6 py-5 relative">
      {toast && (
        <div className="fixed top-28 right-6 z-[99999] bg-[#0f172a] border border-[#1e293b] text-white px-5 py-4 rounded-2xl shadow-2xl font-semibold">
          {toast}
        </div>
      )}

      <div className="max-w-[1650px] mx-auto">

        {/* --- ROW 1: HEADER & TOOLBAR --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">

          {/* LEFT: Main Title Only */}
          <div>
            <p className="text-blue-500 font-bold mb-1 text-sm">Patient Management</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Patients</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm max-w-sm">Manage all patient records safely.</p>
          </div>

          {/* RIGHT: Search & Add Button */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="w-full sm:w-[320px] h-12 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] flex items-center px-4 gap-3 shadow-sm">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white text-sm"
              />
            </div>
            <button
              onClick={() => setIsAddOpen(true)}
              className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-blue-400 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 transition-all text-sm shrink-0"
            >
              <Plus size={18} /> Add Patient
            </button>
          </div>
        </div>

        {/* --- ROW 2: SMALL TOTAL PATIENTS INDICATOR --- */}
        <div className="mb-3 pl-1">
          <div className="inline-flex items-center gap-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] px-3.5 py-1.5 rounded-xl shadow-sm">
            <Users size={14} className="text-blue-500" />
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Total Patients</span>
              <span className="text-sm font-black text-slate-900 dark:text-white leading-none">{patients.length}</span>
            </div>
          </div>
        </div>

        {/* --- ROW 3: CENTERED TABLE WRAPPER --- */}
        <div className="rounded-3xl border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0f172a] shadow-sm overflow-hidden w-full h-auto mx-auto">
          <PatientTable
            patients={filteredPatients}
            startEdit={startEdit}
            setDeleteId={setDeleteId}
          />
        </div>

      </div>

      {/* Add Patient Modal */}
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
            <AddPatientForm
              patient={newPatient}
              setPatient={setNewPatient}
              handleChange={handleNewPatientChange}
              addPatient={handleAddPatientSubmit}
              loading={addLoading}
            />
          </div>
        </div>
      )}

      <EditPatientModal
        editId={editId}
        editData={editData}
        setEditData={setEditData}
        setEditId={setEditId}
        updatePatient={updatePatient}
      />

      <DeletePatientModal
        deleteId={deleteId}
        setDeleteId={setDeleteId}
        deletePatient={deletePatient}
      />
    </div>
  );
}

export default Patients;