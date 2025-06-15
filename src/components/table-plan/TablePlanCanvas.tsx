
import React, { useState } from "react";
import GuestListInput from "./GuestListInput";
import GuestTableAssignment from "./GuestTableAssignment";
import InteractiveTablePlanCanvas from "./InteractiveTablePlanCanvas";
import TablePlanToolbar from "./TablePlanToolbar";

export type TableShape = "rectangle" | "round";

export interface TableItem {
  id: string;
  name: string;
  type: TableShape;
  seats: number;
  left: number;
  top: number;
}

export interface GuestItem {
  name: string;
  x: number;
  y: number;
  assignedTableId?: string;
}

const DEFAULT_RECT_SEATS = 8;
const DEFAULT_ROUND_SEATS = 8;

const TablePlanCanvas: React.FC = () => {
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [tables, setTables] = useState<TableItem[]>([
    {
      id: "table1",
      name: "Table 1",
      type: "rectangle",
      seats: DEFAULT_RECT_SEATS,
      left: 140,
      top: 120,
    },
    {
      id: "table2",
      name: "Table 2",
      type: "rectangle",
      seats: DEFAULT_RECT_SEATS,
      left: 400,
      top: 120,
    }
  ]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  // Ajoute table rectangulaire
  const handleAddRectangleTable = () => {
    setTables(prev => [
      ...prev,
      {
        id: `table${prev.length + 1}_${Math.random().toString(36).slice(2,8)}`,
        name: `Table ${prev.length + 1}`,
        type: "rectangle",
        seats: DEFAULT_RECT_SEATS,
        left: 180 + prev.length * 110,
        top: 150 + prev.length * 30,
      }
    ]);
  };

  // Ajoute table ronde
  const handleAddRoundTable = () => {
    setTables(prev => [
      ...prev,
      {
        id: `table${prev.length + 1}_${Math.random().toString(36).slice(2,8)}`,
        name: `Ronde ${prev.length + 1}`,
        type: "round",
        seats: DEFAULT_ROUND_SEATS,
        left: 220 + prev.length * 130,
        top: 145 + prev.length * 45,
      }
    ]);
  };

  // Suppression d'objet sélectionné (table ou invité)
  const handleDeleteSelected = () => {
    if (!selectedObjectId) return;
    setTables(tables => tables.filter(t => t.id !== selectedObjectId));
    setGuests(guests => guests.filter(g => g.name !== selectedObjectId));
    setSelectedObjectId(null);
  };

  // Ajout/MAJ invités via input
  const handleGuestsChange = (list: string[]) => {
    // Ajoute tout invité inexistant à la zone parking, préserve X/Y si déjà là
    setGuests(old =>
      list.map((n, ix) => {
        const existing = old.find(g => g.name === n);
        return existing
          ? existing
          : { name: n, x: 28, y: 80 + ix * 40 };
      })
    );
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-4">
      {/* LEFT: Input, Table assignment */}
      <div className="w-full md:w-1/3 flex flex-col gap-3">
        <GuestListInput guests={guests.map(g => g.name)} onChange={handleGuestsChange} />
        {/* Ici, GuestTableAssignment peut devenir optionnel ou en lecture seule */}
        <TablePlanToolbar
          onAddRectangle={handleAddRectangleTable}
          onAddRound={handleAddRoundTable}
          onDelete={handleDeleteSelected}
        />
      </div>
      {/* RIGHT: Canvas */}
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <InteractiveTablePlanCanvas
          guests={guests}
          tables={tables}
          setGuests={setGuests}
          setTables={setTables}
          selectedObjectId={selectedObjectId}
          setSelectedObjectId={setSelectedObjectId}
        />
      </div>
    </div>
  );
};

export default TablePlanCanvas;
