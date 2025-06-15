import React, { useState, useRef } from "react";
import GuestListInput from "./GuestListInput";
import GuestTableAssignment from "./GuestTableAssignment";
import InteractiveTablePlanCanvas from "./InteractiveTablePlanCanvas";
import DraggableGuestList from "./DraggableGuestList";

interface TableMeta {
  name: string;
  seats: number; // Number of seats for this table
}

const DEFAULT_SEATS = 8;

const TablePlanCanvas: React.FC = () => {
  const [guests, setGuests] = useState<string[]>([]);
  const [tables, setTables] = useState<string[]>(["Table 1", "Table 2"]);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [tableSeats, setTableSeats] = useState<Record<string, number>>({
    "Table 1": DEFAULT_SEATS,
    "Table 2": DEFAULT_SEATS,
  });

  // Suppression de currentDragGuest

  const handleAssign = (guest: string, table: string) => {
    setAssignments((prev) => ({ ...prev, [guest]: table }));
  };

  // Nouveau: drop géré via guest transmis par dataTransfer
  const handleDropOnTable = (guest: string, table: string) => {
    const countAtTable = Object.values(assignments).filter((t) => t === table).length;
    if (countAtTable < (tableSeats[table] || DEFAULT_SEATS)) {
      setAssignments((prev) => ({ ...prev, [guest]: table }));
    } else {
      // Feedback toast géré dans le canvas!
    }
  };

  const handleTableChange = (newTables: string[]) => {
    setTables(newTables);
    setTableSeats((prev) => {
      const next = { ...prev };
      newTables.forEach((t) => {
        if (!(t in next)) next[t] = DEFAULT_SEATS;
      });
      Object.keys(next).forEach((t) => {
        if (!newTables.includes(t)) delete next[t];
      });
      return next;
    });
  };

  const handleTableSeatChange = (table: string, seats: number) => {
    setTableSeats((prev) => ({
      ...prev,
      [table]: seats,
    }));
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-4">
      {/* LEFT: Input, Table assignment, Draggable */}
      <div className="w-full md:w-1/3 flex flex-col gap-3">
        <GuestListInput guests={guests} onChange={setGuests} />
        <GuestTableAssignment
          guests={guests}
          assignments={assignments}
          onAssign={handleAssign}
          tables={tables}
          onTableChange={handleTableChange}
        />
        {/* Contrôler le nombre de places/table */}
        <div className="mb-2 max-w-md p-2 bg-white rounded border shadow-sm">
          <div className="font-semibold mb-1 text-sm">Places par table :</div>
          {tables.map((t) => (
            <div key={t} className="flex gap-2 items-center mb-1">
              <div className="text-xs w-[78px] truncate">{t}</div>
              <input
                type="number"
                min={1}
                max={24}
                value={tableSeats[t] ?? DEFAULT_SEATS}
                onChange={(e) =>
                  handleTableSeatChange(t, Math.max(1, parseInt(e.target.value) || DEFAULT_SEATS))
                }
                className="w-12 border rounded px-1 py-0.5 text-xs ring-0"
              />{" "}
              <span className="text-xs text-gray-400">places</span>
            </div>
          ))}
        </div>
        {/* Liste drag & drop */}
        <DraggableGuestList
          guests={guests}
          assignments={assignments}
        />
      </div>
      {/* RIGHT: Canvas */}
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <InteractiveTablePlanCanvas
          guests={guests}
          assignments={assignments}
          tables={tables}
          tableSeats={tableSeats}
          onDropGuest={handleDropOnTable}
        />
      </div>
    </div>
  );
};

export default TablePlanCanvas;
