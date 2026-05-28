import { useEffect, useRef, useState } from "react";
import { API_URL } from "../api";

import {
  Pill,
  Plus,
  Search,
  X,
} from "lucide-react";

import AddMedicineForm from "../components/pharmacy/AddMedicineForm";
import EditMedicineModal from "../components/pharmacy/EditMedicineModal";
import DeleteMedicineModal from "../components/pharmacy/DeleteMedicineModal";
import PharmacyTable from "../components/tables/PharmacyTable";

import medicineData from "../data/medicineData";

function Pharmacy() {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  const toastTimer = useRef(null);

  const [isAddOpen, setIsAddOpen] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);

  const [medicine, setMedicine] = useState({
    medicineName: "",
    category: "",
    stock: "",
    price: "",
    expiryDate: "",
  });

  const [editMedicine, setEditMedicine] = useState({
    medicineName: "",
    category: "",
    stock: "",
    price: "",
    expiryDate: "",
  });

  const token = localStorage.getItem("token");

  const showToast = (msg) => {
    setToast(msg);

    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    toastTimer.current = setTimeout(() => {
      setToast("");
    }, 3000);
  };

  const fetchMedicines = async () => {
    try {
      const res = await fetch(`${API_URL}/pharmacy`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        return showToast(data.message || "Failed to fetch medicines ❌");
      }

      setMedicines(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
      showToast("Failed to fetch medicines ❌");
    }
  };

  useEffect(() => {
    fetchMedicines();

    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  const addMedicine = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...medicine,
        stock: Number(medicine.stock),
        price: Number(medicine.price),
      };

      const res = await fetch(`${API_URL}/pharmacy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        return showToast(data.message || "Medicine add failed ❌");
      }

      showToast("Medicine added successfully ✔️");

      setMedicine({
        medicineName: "",
        category: "",
        stock: "",
        price: "",
        expiryDate: "",
      });

      setIsAddOpen(false);

      fetchMedicines();
    } catch (error) {
      console.log(error);
      showToast("Medicine add failed ❌");
    }
  };

  const startEdit = (medicine) => {
    setEditId(medicine.id);

    setEditMedicine({
      medicineName: medicine.medicineName || "",
      category: medicine.category || "",
      stock: medicine.stock || "",
      price: medicine.price || "",
      expiryDate: medicine.expiryDate || "",
    });
  };

  const updateMedicine = async () => {
    try {
      const payload = {
        ...editMedicine,
        stock: Number(editMedicine.stock),
        price: Number(editMedicine.price),
      };

      const res = await fetch(`${API_URL}/pharmacy/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        return showToast(data.message || "Medicine update failed ❌");
      }

      showToast("Medicine updated successfully ✔️");

      setEditId(null);

      fetchMedicines();
    } catch (error) {
      console.log(error);
      showToast("Medicine update failed ❌");
    }
  };

  const deleteMedicine = async (id) => {
    try {
      const res = await fetch(`${API_URL}/pharmacy/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        return showToast(data.message || "Medicine delete failed ❌");
      }

      showToast("Medicine deleted successfully ✔️");

      setDeleteId(null);

      fetchMedicines();
    } catch (error) {
      console.log(error);
      showToast("Medicine delete failed ❌");
    }
  };

  // ⚡️ Removed the totalValue calculation

  const lowStock = medicines.filter((item) => item.stock <= 10).length;

  const expired = medicines.filter((item) => {
    return new Date(item.expiryDate) < new Date();
  }).length;

  const filteredMedicines = medicines.filter((item) =>
    `${item.medicineName} ${item.category}`
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div>
            <p className="text-blue-500 font-bold mb-1 text-sm">
              Pharmacy Management
            </p>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Medicine Inventory
            </h1>

            <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm max-w-sm">
              Manage medicine stock, categories and expiry tracking.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="w-full sm:w-[320px] h-12 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] flex items-center px-4 gap-3 shadow-sm">
              <Search
                size={18}
                className="text-slate-400 shrink-0"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search medicine..."
                className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white text-sm"
              />
            </div>

            <button
              onClick={() => setIsAddOpen(true)}
              className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 transition-all text-sm shrink-0"
            >
              <Plus size={18} />
              Add Medicine
            </button>
          </div>
        </div>

        {/* ⚡️ Changed lg:grid-cols-4 to lg:grid-cols-3 to evenly balance the 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          <div className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] p-6 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">
              Total Medicines
            </p>

            <h2 className="text-3xl font-black mt-2">
              {medicines.length}
            </h2>
          </div>

          <div className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] p-6 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">
              Low Stock
            </p>

            <h2 className="text-3xl font-black mt-2 text-orange-500 dark:text-orange-400">
              {lowStock}
            </h2>
          </div>

          <div className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] p-6 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">
              Expired
            </p>

            <h2 className="text-3xl font-black mt-2 text-red-500 dark:text-red-400">
              {expired}
            </h2>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0f172a] shadow-sm overflow-hidden w-full h-auto mx-auto">
          {filteredMedicines.length > 0 ? (
            <PharmacyTable
              medicines={filteredMedicines}
              startEdit={startEdit}
              setDeleteId={setDeleteId}
            />
          ) : (
            <div className="py-20 text-center">
              <Pill
                size={42}
                className="mx-auto text-slate-300 dark:text-slate-600 mb-4"
              />

              <h2 className="text-2xl font-black">
                No Medicines Found
              </h2>

              <p className="text-slate-500 mt-2">
                Add medicines to see records here.
              </p>
            </div>
          )}
        </div>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9998] px-4">
          <div
            className="fixed inset-0"
            onClick={() => setIsAddOpen(false)}
          />

          <div className="relative bg-white dark:bg-[#111827] w-full max-w-3xl rounded-[2.5rem] p-8 sm:p-10 shadow-2xl z-10 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X size={20} />
            </button>

            <AddMedicineForm
              medicine={medicine}
              setMedicine={setMedicine}
              addMedicine={addMedicine}
              medicineData={medicineData}
            />
          </div>
        </div>
      )}

      <EditMedicineModal
        editId={editId}
        setEditId={setEditId}
        editMedicine={editMedicine}
        setEditMedicine={setEditMedicine}
        updateMedicine={updateMedicine}
      />

      <DeleteMedicineModal
        deleteId={deleteId}
        setDeleteId={setDeleteId}
        deleteMedicine={deleteMedicine}
      />
    </div>
  );
}

export default Pharmacy;