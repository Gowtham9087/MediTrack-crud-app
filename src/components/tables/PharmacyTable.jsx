import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Edit2, Trash2, Download } from "lucide-react";
import { downloadMedicinePDF } from "../../utils/downloadMedicineReport";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([AllCommunityModule]);

function PharmacyTable({ medicines = [], startEdit, setDeleteId }) {

  const StatusCellRenderer = (params) => {
    const data = params.data;
    if (!data) return null;
    const isExpired = new Date(data.expiryDate) < new Date();
    let status = "", bgClass = "";
    if (isExpired) { status = "Expired"; bgClass = "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400"; }
    else if (data.stock === 0) { status = "Out of Stock"; bgClass = "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400"; }
    else if (data.stock <= 10) { status = `${data.stock} Left`; bgClass = "bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400"; }
    else { status = `${data.stock} In Stock`; bgClass = "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"; }
    return (
      <div className="flex items-center h-full">
        <span className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider ${bgClass}`}>{status}</span>
      </div>
    );
  };

  const ActionsCellRenderer = (params) => {
    const data = params.data;
    if (!data) return null;
    return (
      <div className="flex items-center gap-2 h-full">
        <button type="button" onClick={() => downloadMedicinePDF(data)} className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white transition-all cursor-pointer">
          <Download size={14} />
        </button>
        <button type="button" onClick={() => startEdit(data)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#020817] border border-slate-200 dark:border-[#1e293b] text-slate-500 hover:text-amber-500 transition-all cursor-pointer">
          <Edit2 size={14} />
        </button>
        <button type="button" onClick={() => setDeleteId(data.id)} className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer">
          <Trash2 size={14} />
        </button>
      </div>
    );
  };

  const columnDefs = useMemo(() => [
    { headerName: "ID", valueGetter: p => p.node.rowIndex + 1, width: 80, cellClass: "flex items-center text-sm font-bold text-slate-500" },
    { headerName: "Medicine ID", valueGetter: p => `MED-${String(p.node.rowIndex + 1).padStart(3, "0")}`, width: 140, cellClass: "flex items-center font-mono font-bold text-slate-900 dark:text-white text-sm" },
    { headerName: "Medicine", field: "medicineName", flex: 1.7, minWidth: 220, cellClass: "flex items-center text-sm font-bold text-slate-900 dark:text-white" },
    { headerName: "Category", field: "category", flex: 1.3, minWidth: 160, cellClass: "flex items-center text-sm text-slate-700 dark:text-slate-300" },
    { headerName: "Stock", field: "stock", width: 100, cellClass: "flex items-center font-bold text-sm" },
    { headerName: "Price", valueGetter: p => `₹${p.data.price}`, width: 110, cellClass: "flex items-center text-sm font-bold" },
    { headerName: "Value", valueGetter: p => `₹${p.data.stock * p.data.price}`, width: 130, cellClass: "flex items-center text-sm font-black text-slate-900 dark:text-white" },
    { headerName: "Status", width: 160, cellRenderer: StatusCellRenderer },
    { headerName: "Expiry", field: "expiryDate", width: 130, cellClass: "flex items-center font-mono text-sm text-slate-600 dark:text-slate-400" },
    { headerName: "Action", width: 150, resizable: false, cellRenderer: ActionsCellRenderer }
  ], [startEdit, setDeleteId]);

  const defaultColDef = useMemo(() => ({
    sortable: false, filter: false, resizable: true, suppressMovable: true,
  }), []);

  return (
    <div className="ag-theme-quartz w-full custom-pharmacy-grid" style={{ "--ag-font-family": "Inter, system-ui, sans-serif", "--ag-font-size": "14.5px" }}>
      <style>{`
        .custom-pharmacy-grid {
          --ag-background-color: transparent; --ag-header-background-color: transparent;
          --ag-border-color: #e2e8f0; --ag-row-hover-color: #f8fafc;
          --ag-foreground-color: #0f172a; --ag-header-foreground-color: #64748b;
        }
        html.dark .custom-pharmacy-grid, .dark .custom-pharmacy-grid {
          --ag-border-color: #1e293b; --ag-row-hover-color: #1e293b;
          --ag-foreground-color: #ffffff; --ag-header-foreground-color: #94a3b8;
        }
        .custom-pharmacy-grid .ag-root-wrapper { 
          border-radius: 24px !important; 
          overflow: hidden !important; 
          background-color: transparent !important; 
          border: none !important; 
        }
        .custom-pharmacy-grid .ag-row { 
          border-bottom: 1px solid var(--ag-border-color) !important; 
        }
        
        /* ⚡️ FIXED: Added flex-wrap and auto-height so mobile doesn't squish */
        .custom-pharmacy-grid .ag-paging-panel { 
          border-top: 1px solid var(--ag-border-color) !important; 
          color: var(--ag-foreground-color) !important; 
          padding: 16px 12px !important; 
          height: auto !important; 
          min-height: 52px !important;
          flex-wrap: wrap !important;
          justify-content: center !important;
          gap: 12px !important;
        }
      `}</style>
      <AgGridReact
        rowData={medicines}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowHeight={56}
        headerHeight={48}
        animateRows={true}
        suppressCellFocus={true}
        theme="legacy"
        domLayout="autoHeight"
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 50]}
      />
    </div>
  );
}

export default PharmacyTable;