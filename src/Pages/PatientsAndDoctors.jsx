import { useEffect, useRef, useState } from "react";
import { API_URL } from "../api";
import { Users, Stethoscope, Plus, Search, X } from "lucide-react";

import PatientTable from "../components/tables/PatientTable";
import AddPatientForm from "../components/patients/AddPatientForm";
import EditPatientModal from "../components/patients/EditPatientModal";
import DeletePatientModal from "../components/patients/DeletePatientModal";

import DoctorTable from "../components/tables/DoctorTable";
import AddDoctorForm from "../components/doctors/AddDoctorForm";
import EditDoctorModal from "../components/doctors/EditDoctorModal";
import DeleteDoctorModal from "../components/doctors/DeleteDoctorModal";

function PatientsAndDoctors() {
  const [activeTab, setActiveTab] = useState("patients"); // "patients" | "doctors"

  /* ---------------- SHARED ---------------- */
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);
  const token = localStorage.getItem("token");

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  };

  // Reset search when switching tabs so results don't carry over confusingly
  useEffect(() => {
    setSearch("");
  }, [activeTab]);

  /* ---------------- PATIENTS STATE ---------------- */
  const [patients, setPatients] = useState([]);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [editPatientId, setEditPatientId] = useState(null);
  const [deletePatientId, setDeletePatientId] = useState(null);

  const [newPatient, setNewPatient] = useState({
    name: "", email: "", contact: "", age: "", gender: "", address: "", problem: ""
  });
  const [addPatientLoading, setAddPatientLoading] = useState(false);

  const [editPatientData, setEditPatientData] = useState({
    name: "", email: "", contact: "", address: "", age: "", gender: "", problem: ""
  });

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
    setAddPatientLoading(true);
    try {
      const res = await fetch(`${API_URL}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newPatient),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Patient added! ✔️");
        setIsAddPatientOpen(false);
        setNewPatient({ name: "", email: "", contact: "", age: "", gender: "", address: "", problem: "" });
        refreshPatients();
      } else {
        showToast(data.message || "Failed to add patient ❌");
      }
    } catch (err) {
      showToast("Error adding patient ❌");
    } finally {
      setAddPatientLoading(false);
    }
  };

  const startEditPatient = (patient) => {
    setEditPatientId(patient.id);
    setEditPatientData({
      name: patient.name, email: patient.email, contact: patient.contact,
      address: patient.address, age: patient.age, gender: patient.gender, problem: patient.problem,
    });
  };

  const updatePatient = async () => {
    if (editPatientData.contact.length !== 10) {
      showToast("Contact number must be 10 digits ❌");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/patients/${editPatientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(editPatientData),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Update failed ❌");
        return;
      }
      showToast("Patient updated ✔️");
      setEditPatientId(null);
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
      setDeletePatientId(null);
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

  /* ---------------- DOCTORS STATE ---------------- */
  const [doctors, setDoctors] = useState([]);
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: "", specialization: "", email: "", phone: "" });
  const [editDoctorId, setEditDoctorId] = useState(null);
  const [deleteDoctorId, setDeleteDoctorId] = useState(null);
  const [editDoctorData, setEditDoctorData] = useState({ name: "", specialization: "", email: "", phone: "" });

  const doctorToken = localStorage.getItem("admin_token") || localStorage.getItem("token");

  const fetchDoctors = async () => {
    try {
      const res = await fetch(`${API_URL}/appointments/doctors`, {
        headers: { Authorization: `Bearer ${doctorToken}` },
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

  const addDoctor = async (e) => {
    e.preventDefault();
    if (newDoctor.phone.length !== 10) {
      showToast("Phone number must be 10 digits ❌");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/appointments/doctors`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${doctorToken}` },
        body: JSON.stringify(newDoctor),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Doctor add failed ❌");
        return;
      }
      showToast("Doctor added successfully ✔️");
      setNewDoctor({ name: "", specialization: "", email: "", phone: "" });
      setIsAddDoctorOpen(false);
      fetchDoctors();
    } catch (error) {
      console.log(error);
      showToast("Doctor add failed ❌");
    }
  };

  const startEditDoctor = (doc) => {
    setEditDoctorId(doc.id);
    setEditDoctorData({
      name: doc.name, specialization: doc.specialization, email: doc.email, phone: doc.phone,
    });
  };

  const updateDoctor = async () => {
    if (editDoctorData.phone.length !== 10) {
      showToast("Phone number must be 10 digits ❌");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/appointments/doctors/${editDoctorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${doctorToken}` },
        body: JSON.stringify(editDoctorData),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Doctor update failed ❌");
        return;
      }
      showToast("Doctor updated successfully ✔️");
      setEditDoctorId(null);
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
        headers: { Authorization: `Bearer ${doctorToken}` },
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Doctor delete failed ❌");
        return;
      }
      showToast("Doctor deleted successfully ✔️");
      setDeleteDoctorId(null);
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

  /* ---------------- LOAD ON MOUNT ---------------- */
  useEffect(() => {
    refreshPatients();
    fetchDoctors();
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isPatients = activeTab === "patients";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-white px-6 py-5 relative">
      {toast && (
        <div className="fixed top-28 right-6 z-[99999] bg-[#0f172a] border border-[#1e293b] text-white px-5 py-4 rounded-2xl shadow-2xl font-semibold">
          {toast}
        </div>
      )}

      <div className="max-w-[1650px] mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div>
            <p className="text-blue-500 font-bold mb-1 text-sm">People Management</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">People</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm max-w-sm">
              Manage patient records and doctor profiles in one place.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="w-full sm:w-[320px] h-12 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] flex items-center px-4 gap-3 shadow-sm">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isPatients ? "Search patients..." : "Search doctors..."}
                className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white text-sm"
              />
            </div>
            <button
              onClick={() => (isPatients ? setIsAddPatientOpen(true) : setIsAddDoctorOpen(true))}
              className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-blue-400 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 transition-all text-sm shrink-0"
            >
              <Plus size={18} /> {isPatients ? "Add Patient" : "Add Doctor"}
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-2 mb-5">
          <button
            onClick={() => setActiveTab("patients")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
              isPatients
                ? "bg-blue-400 text-white shadow-lg shadow-blue-500/20"
                : "bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Users size={16} /> Patients
            <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${isPatients ? "bg-white/20" : "bg-slate-100 dark:bg-[#1e293b]"}`}>
              {patients.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("doctors")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
              !isPatients
                ? "bg-blue-400 text-white shadow-lg shadow-blue-500/20"
                : "bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Stethoscope size={16} /> Doctors
            <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${!isPatients ? "bg-white/20" : "bg-slate-100 dark:bg-[#1e293b]"}`}>
              {doctors.length}
            </span>
          </button>
        </div>

        {/* TABLE */}
        <div className="rounded-3xl border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0f172a] shadow-sm overflow-hidden w-full h-auto mx-auto">
          {isPatients ? (
            <PatientTable
              patients={filteredPatients}
              startEdit={startEditPatient}
              setDeleteId={setDeletePatientId}
            />
          ) : (
            <DoctorTable
              doctors={filteredDoctors}
              startEdit={startEditDoctor}
              setDeleteId={setDeleteDoctorId}
            />
          )}
        </div>
      </div>

      {/* Add Patient Modal */}
      {isAddPatientOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9998] px-4">
          <div className="fixed inset-0" onClick={() => setIsAddPatientOpen(false)} />
          <div className="relative bg-white dark:bg-[#111827] w-full max-w-3xl rounded-[2.5rem] p-8 sm:p-10 shadow-2xl z-10 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setIsAddPatientOpen(false)}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X size={20} />
            </button>
            <AddPatientForm
              patient={newPatient}
              setPatient={setNewPatient}
              handleChange={handleNewPatientChange}
              addPatient={handleAddPatientSubmit}
              loading={addPatientLoading}
            />
          </div>
        </div>
      )}

      <EditPatientModal
        editId={editPatientId}
        editData={editPatientData}
        setEditData={setEditPatientData}
        setEditId={setEditPatientId}
        updatePatient={updatePatient}
      />

      <DeletePatientModal
        deleteId={deletePatientId}
        setDeleteId={setDeletePatientId}
        deletePatient={deletePatient}
      />

      {/* Add Doctor Modal */}
      {isAddDoctorOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9998] px-4">
          <div className="fixed inset-0" onClick={() => setIsAddDoctorOpen(false)} />
          <div className="relative bg-white dark:bg-[#111827] w-full max-w-3xl rounded-[2.5rem] p-8 sm:p-10 shadow-2xl z-10 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setIsAddDoctorOpen(false)}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X size={20} />
            </button>
            <AddDoctorForm doctor={newDoctor} setDoctor={setNewDoctor} addDoctor={addDoctor} />
          </div>
        </div>
      )}

      <EditDoctorModal
        editId={editDoctorId}
        setEditId={setEditDoctorId}
        editDoctor={editDoctorData}
        setEditDoctor={setEditDoctorData}
        updateDoctor={updateDoctor}
      />

      <DeleteDoctorModal
        deleteId={deleteDoctorId}
        setDeleteId={setDeleteDoctorId}
        deleteDoctor={deleteDoctor}
      />
    </div>
  );
}

export default PatientsAndDoctors;