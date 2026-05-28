import { useEffect, useState, useMemo } from "react";
import { API_URL } from "../../api";
import { Pill, Download } from "lucide-react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import EmptyState from "../../components/ui/EmptyState";

ModuleRegistry.registerModules([AllCommunityModule]);

function UserPharmacy() {
  const [medicines, setMedicines] = useState([]);
  const token = localStorage.getItem("token");
  const currentUser = localStorage.getItem("userName"); // e.g., "Gowtham G"

  useEffect(() => {
    fetch(`${API_URL}/pharmacy`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        // ⚡️ Strictly filter to only show this specific user's purchases
        const myMeds = data.filter(med => med.patient === currentUser || med.patientName === currentUser);
        setMedicines(myMeds);
      })
      .catch(err => console.log(err));
  }, [token, currentUser]);

  const ActionsRenderer = () => (
    <div className="flex items-center h-full">
      <button className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all cursor-pointer">
        <Download size={14} />
      </button>
    </div>
  );

  const columnDefs = useMemo(() => [
    { headerName: "ID", valueGetter: p => `PHM-${String(p.node.rowIndex + 1).padStart(3, '0')}`, width: 120 },
    { headerName: "Medicine Name", field: "medicineName", flex: 1 },
    { headerName: "Category", field: "category", width: 150 },
    { headerName: "Qty", field: "quantity", width: 100 },
    { headerName: "Amount", valueGetter: p => `₹${p.data.amount || 0}`, width: 120, cellClass: "font-black" },
    { headerName: "Date", field: "date", width: 150 },
    { headerName: "Receipt", width: 100, cellRenderer: ActionsRenderer }
  ], []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] px-6 py-5">
      <div className="max-w-[1650px] mx-auto">
        <div className="mb-6">
          <p className="text-blue-500 font-bold text-sm">Patient Portal</p>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">My Pharmacy Orders</h1>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0f172a] p-5 shadow-sm">
          {medicines.length > 0 ? (
            <div className="ag-theme-quartz custom-lab-grid h-[500px]" style={{ "--ag-font-family": "Inter, sans-serif" }}>
              <AgGridReact rowData={medicines} columnDefs={columnDefs} rowHeight={56} headerHeight={48} />
            </div>
          ) : (
            <EmptyState title="No Pharmacy Records" description="You have not purchased any medicines yet." />
          )}
        </div>
      </div>
    </div>
  );
}
export default UserPharmacy;