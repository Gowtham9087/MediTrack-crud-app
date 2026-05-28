import { useEffect, useRef, useState } from "react";
import { API_URL } from "../api";
import { FlaskConical, Plus, Search, X } from "lucide-react";

import AddLabTestForm from "../components/laboratory/AddLabTestForm";
import EditLabTestModal from "../components/laboratory/EditLabTestModal";
import DeleteLabTestModal from "../components/laboratory/DeleteLabTestModal";
import LaboratoryTable from "../components/tables/LaboratoryTable";
import labTestData from "../data/labTestData";

function Laboratory() {
  const [tests, setTests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);

  const toastTimer = useRef(null);
  const token = localStorage.getItem("token");

  const [test, setTest] = useState({
    patientName: "", testName: "", amount: "", quantity: 1, status: "Pending", date: "",
  });

  const [editTest, setEditTest] = useState({
    patientName: "", testName: "", amount: "", quantity: 1, status: "Pending", date: "",
  });

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  };

  const fetchPatients = async () => {
    try {
      const res = await fetch(`${API_URL}/patients`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setPatients(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
  };

  const fetchTests = async () => {
    try {
      const res = await fetch(`${API_URL}/laboratory`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) return showToast(data.message || "Failed to fetch tests ❌");
      setTests(Array.isArray(data) ? data : []);
    } catch (e) { showToast("Failed to fetch tests ❌"); }
  };

  useEffect(() => { fetchTests(); fetchPatients(); return () => clearTimeout(toastTimer.current); }, []);

  // ⚡️ FIXED: No e.preventDefault() here. Just takes the formatted data and maps it to backend!
  const addTest = async (testData) => {
    const payload = {
      patient: testData.patientName, // Mapped for backend
      test: testData.testName,       // Mapped for backend
      date: testData.date,
      status: testData.status,
      amount: Number(testData.amount) || 0,
      quantity: Number(testData.quantity) || 1,
      totalAmount: Number(testData.totalAmount) || 0,
    };

    try {
      const res = await fetch(`${API_URL}/laboratory`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        console.error("Backend Error:", data);
        return showToast(data.message || "Test add failed ❌");
      }

      showToast("Lab test added successfully ✔️");
      setTest({ patientName: "", testName: "", amount: "", quantity: 1, status: "Pending", date: "" });
      setIsAddOpen(false);
      fetchTests();
    } catch (error) {
      console.error(error);
      showToast("Test add failed ❌");
    }
  };

  const startEdit = (t) => {
    setEditId(t.id);
    setEditTest({
      patientName: t.patient || t.patientName || "",
      testName: t.test || t.testName || "",
      amount: t.amount || "",
      quantity: t.quantity || 1,
      status: t.status || "Pending",
      date: t.date || "",
    });
  };

  const updateTest = async () => {
    const payload = {
      patient: editTest.patientName, // Mapped for backend
      test: editTest.testName,       // Mapped for backend
      date: editTest.date,
      status: editTest.status,
      amount: Number(editTest.amount) || 0,
      quantity: Number(editTest.quantity) || 1,
      totalAmount: (Number(editTest.amount) || 0) * (Number(editTest.quantity) || 1),
    };

    try {
      const res = await fetch(`${API_URL}/laboratory/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return showToast("Test update failed ❌");
      
      showToast("Lab test updated successfully ✔️");
      setEditId(null);
      fetchTests();
    } catch (e) { showToast("Test update failed ❌"); }
  };

  const deleteTest = async (id) => {
    try {
      const res = await fetch(`${API_URL}/laboratory/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return showToast("Test delete failed ❌");
      showToast("Lab test deleted successfully ✔️");
      setDeleteId(null);
      fetchTests();
    } catch (e) { showToast("Test delete failed ❌"); }
  };

  const filteredTests = tests.filter((item) => {
    const pName = item.patient || item.patientName || "";
    const tName = item.test || item.testName || "";
    return `${pName} ${tName}`.toLowerCase().includes(search.toLowerCase());
  });

  const totalTests = tests.length;
  const completed = tests.filter((t) => t.status === "Completed").length;
  const pending = tests.filter((t) => t.status === "Pending").length;
  const processing = tests.filter((t) => t.status === "Processing").length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-white px-6 py-5 relative">
      {toast && (
        <div className="fixed top-28 right-6 z-[99999] bg-[#0f172a] border border-[#1e293b] text-white px-5 py-4 rounded-2xl shadow-2xl font-semibold">
          {toast}
        </div>
      )}

      <div className="max-w-[1650px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div>
            <p className="text-blue-500 font-bold mb-1 text-sm">Laboratory Management</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Laboratory</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm max-w-sm">Manage lab reports, diagnostics and patient tests.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="w-full sm:w-[320px] h-12 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] flex items-center px-4 gap-3 shadow-sm">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tests..." className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white text-sm" />
            </div>

            <button onClick={() => setIsAddOpen(true)} className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 transition-all text-sm shrink-0">
              <Plus size={18} /> Add Test
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <div className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] p-6 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">Total Tests</p>
            <h2 className="text-3xl font-black mt-2">{totalTests}</h2>
          </div>
          <div className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] p-6 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">Completed</p>
            <h2 className="text-3xl font-black mt-2 text-emerald-500 dark:text-emerald-400">{completed}</h2>
          </div>
          <div className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] p-6 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">Pending</p>
            <h2 className="text-3xl font-black mt-2 text-orange-500 dark:text-orange-400">{pending}</h2>
          </div>
          <div className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] p-6 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">Processing</p>
            <h2 className="text-3xl font-black mt-2 text-blue-500 dark:text-blue-400">{processing}</h2>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0f172a] shadow-sm overflow-hidden w-full h-auto mx-auto">
          {filteredTests.length > 0 ? (
            <LaboratoryTable tests={filteredTests} startEdit={startEdit} setDeleteId={setDeleteId} />
          ) : (
            <div className="py-20 text-center">
              <FlaskConical size={42} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <h2 className="text-2xl font-black">No Tests Found</h2>
              <p className="text-slate-500 mt-2">Add lab tests to see records here.</p>
            </div>
          )}
        </div>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9998] px-4">
          <div className="fixed inset-0" onClick={() => setIsAddOpen(false)} />
          <div className="relative bg-white dark:bg-[#111827] w-full max-w-3xl rounded-[2.5rem] p-8 sm:p-10 shadow-2xl z-10 border border-slate-200 dark:border-slate-800">
            <button onClick={() => setIsAddOpen(false)} className="absolute top-6 right-6 w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer text-slate-500 hover:text-slate-900 dark:hover:text-white">
              <X size={20} />
            </button>
            <AddLabTestForm test={test} setTest={setTest} addTest={addTest} labTestData={labTestData} patients={patients} />
          </div>
        </div>
      )}

      <EditLabTestModal editId={editId} setEditId={setEditId} editTest={editTest} setEditTest={setEditTest} updateTest={updateTest} patients={patients} labTestData={labTestData} />
      <DeleteLabTestModal deleteId={deleteId} setDeleteId={setDeleteId} deleteTest={deleteTest} />
    </div>
  );
}

export default Laboratory;