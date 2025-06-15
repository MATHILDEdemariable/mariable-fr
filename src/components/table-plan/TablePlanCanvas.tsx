
import React, { useState } from "react";
import GuestListInput from "./GuestListInput";
import GuestTableAssignment from "./GuestTableAssignment";

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
        <button
          onClick={() => exportAssignmentsToCSV(guests, assignments)}
          className="mt-4 bg-wedding-olive text-white px-4 py-2 rounded hover:bg-wedding-olive/90 text-sm w-full"
        >
          Exporter liste assignée (CSV)
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center min-h-[500px] bg-muted rounded border border-dashed border-gray-300 text-gray-500">
        <span>
          {/* Placeholder: ici viendra le canevas visuel (tables, chaises...). */}
          Canevas interactif et agencement graphique à venir ici.
        </span>
      </div>
    </div>
  );
};

export default TablePlanCanvas;
