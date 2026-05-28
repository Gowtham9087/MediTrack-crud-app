import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Edit2, Trash2 } from "lucide-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([AllCommunityModule]);

function AppointmentTable({ appointments = [], startEdit, setDeleteId }) {

  const StatusCellRenderer = (params) => {
    const status = params.value || "Booked";
    let bgClass = "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400";
    if (status === "Completed") bgClass = "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    if (status === "Cancelled") bgClass = "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400";
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
    { headerName: "Patient", valueGetter: p => p.data?.Patient?.name || "Deleted Patient", flex: 1.5, minWidth: 160, cellClass: "flex items-center text-sm font-bold text-slate-900 dark:text-white" },
    { headerName: "Doctor", valueGetter: p => p.data?.Doctor?.name ? `Dr. ${p.data.Doctor.name}` : "Unknown Doctor", flex: 1.5, minWidth: 160, cellClass: "flex items-center text-sm text-slate-700 dark:text-slate-300" },
    { headerName: "Specialization", valueGetter: p => p.data?.Doctor?.specialization || "-", width: 140, cellClass: "flex items-center text-sm text-slate-600 dark:text-slate-400 capitalize" },
    { headerName: "Date", field: "appointmentDate", width: 120, cellClass: "flex items-center font-mono text-sm text-slate-600 dark:text-slate-300" },
    { headerName: "Time", field: "appointmentTime", width: 100, cellClass: "flex items-center font-mono text-sm text-slate-600 dark:text-slate-300" },
    { headerName: "Status", field: "status", width: 120, cellRenderer: StatusCellRenderer },
    { headerName: "Action", width: 110, resizable: false, cellRenderer: ActionsCellRenderer }
  ], [startEdit, setDeleteId]);

  const defaultColDef = useMemo(() => ({
    sortable: false, filter: false, resizable: true, suppressMovable: true,
  }), []);

  return (
    <div className="ag-theme-quartz w-full custom-appt-grid" style={{ "--ag-font-family": "Inter, system-ui, sans-serif", "--ag-font-size": "14.5px" }}>
      <style>{`
        .custom-appt-grid {
          --ag-background-color: transparent; --ag-header-background-color: transparent;
          --ag-border-color: #e2e8f0; --ag-row-hover-color: #f8fafc;
          --ag-foreground-color: #0f172a; --ag-header-foreground-color: #64748b;
        }
        html.dark .custom-appt-grid, .dark .custom-appt-grid {
          --ag-border-color: #1e293b; --ag-row-hover-color: #1e293b;
          --ag-foreground-color: #ffffff; --ag-header-foreground-color: #94a3b8;
        }
        .custom-appt-grid .ag-root-wrapper { 
          border-radius: 24px !important; 
          overflow: hidden !important; 
          background-color: transparent !important; 
          border: none !important; 
        }
        .custom-appt-grid .ag-row { 
          border-bottom: 1px solid var(--ag-border-color) !important; 
        }

        /* ⚡️ FIXED: Added flex-wrap, center alignment, and auto-height for mobile */
        .custom-appt-grid .ag-paging-panel { 
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
        rowData={appointments}
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

export default AppointmentTable;