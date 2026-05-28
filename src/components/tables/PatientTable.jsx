import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Edit2, Trash2 } from "lucide-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([AllCommunityModule]);

function PatientTable({ patients = [], startEdit, setDeleteId }) {
  
  const IdCellRenderer = (params) => {
    const rowNumber = params.node.rowIndex !== undefined ? params.node.rowIndex + 1 : 1;
    return (
      <span className="font-mono font-bold text-slate-400 dark:text-slate-500 flex items-center h-full text-sm">
        PT{String(rowNumber).padStart(3, "0")}
      </span>
    );
  };

  const ActionsCellRenderer = (params) => {
    const data = params.data;
    if (!data) return null;
    return (
      <div className="flex items-center gap-2 h-full">
        <button type="button" onClick={() => startEdit(data)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#020817] border border-slate-200 dark:border-[#1e293b] text-slate-500 dark:text-slate-400 hover:text-amber-500 transition-all cursor-pointer">
          <Edit2 size={14} />
        </button>
        <button type="button" onClick={() => setDeleteId(data.id)} className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer">
          <Trash2 size={14} />
        </button>
      </div>
    );
  };

  const columnDefs = useMemo(() => [
    { headerName: "Patient ID", width: 120, cellRenderer: IdCellRenderer },
    { headerName: "Patient Name", field: "name", flex: 1.5, minWidth: 180, cellClass: "flex items-center text-sm font-bold text-slate-900 dark:text-white" },
    { headerName: "Age", field: "age", width: 90, cellClass: "flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300" },
    { headerName: "Gender", field: "gender", width: 110, cellClass: "flex items-center text-sm text-slate-600 dark:text-slate-400 capitalize" },
    { headerName: "Phone", field: "contact", width: 150, cellClass: "flex items-center font-mono text-sm text-slate-600 dark:text-slate-300" },
    { headerName: "Problem", field: "problem", flex: 1.2, minWidth: 160, cellClass: "flex items-center text-sm text-slate-600 dark:text-slate-300 truncate" },
    { headerName: "Action", width: 110, resizable: false, cellRenderer: ActionsCellRenderer }
  ], [startEdit, setDeleteId]);

  const defaultColDef = useMemo(() => ({
    sortable: false, filter: false, resizable: true, suppressMovable: true,
  }), []);

  return (
    <div className="ag-theme-quartz w-full custom-patient-grid" style={{ "--ag-font-family": "Inter, system-ui, sans-serif", "--ag-font-size": "14.5px" }}>
      <style>{`
        .custom-patient-grid {
          --ag-background-color: transparent; --ag-header-background-color: transparent;
          --ag-border-color: #e2e8f0; --ag-row-hover-color: #f8fafc;
          --ag-foreground-color: #0f172a; --ag-header-foreground-color: #64748b;
        }
        html.dark .custom-patient-grid, .dark .custom-patient-grid {
          --ag-border-color: #1e293b; --ag-row-hover-color: #1e293b;
          --ag-foreground-color: #ffffff; --ag-header-foreground-color: #94a3b8;
        }
        .custom-patient-grid .ag-root-wrapper { 
          border-radius: 24px !important; 
          overflow: hidden !important; 
          background-color: transparent !important; 
          border: none !important; 
        }
        .custom-patient-grid .ag-row { 
          border-bottom: 1px solid var(--ag-border-color) !important; 
        }
        .custom-patient-grid .ag-row:last-child { 
          border-bottom: none !important; 
        }
        
        /* ⚡️ FIXED: Added mobile responsive wrap and auto height to pagination */
        .custom-patient-grid .ag-paging-panel { 
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
        rowData={patients}
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

export default PatientTable;