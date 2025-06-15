import React, { useState } from "react";
import GuestListInput from "./GuestListInput";
import GuestTableAssignment from "./GuestTableAssignment";
import InteractiveTablePlanCanvas from "./InteractiveTablePlanCanvas";

function exportAssignmentsToCSV(
  guests: string[],
  assignments: Record<string, string>
) {
  let rows = [["Invité", "Table"]];
  for (const guest of guests) {
    rows.push([guest, assignments[guest] || "Non assigné"]);
  }
  const csvContent =
    "data:text/csv;charset=utf-8," +
    rows.map((e) => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);

  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "plan_de_table_mariable.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const TablePlanCanvas: React.FC = () => {
  const [guests, setGuests] = useState<string[]>([]);
  const [tables, setTables] = useState<string[]>(["Table 1", "Table 2"]);
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  const handleAssign = (guest: string, table: string) => {
    setAssignments((prev) => ({ ...prev, [guest]: table }));
  };

  // Pour le PDF, on exporte le canvas + la liste courante d'assignation
  return (
    <div className="w-full flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-1/3">
        <GuestListInput guests={guests} onChange={setGuests} />
        <GuestTableAssignment
          guests={guests}
          assignments={assignments}
          onAssign={handleAssign}
          tables={tables}
          onTableChange={setTables}
        />
        {/* Le bouton export PDF */}
        <InteractiveTablePlanCanvas
          guests={guests}
          assignments={assignments}
          tables={tables}
        />
      </div>
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        {/* Le canevas interactif est géré via InteractiveTablePlanCanvas */}
      </div>
    </div>
  );
};

export default TablePlanCanvas;
