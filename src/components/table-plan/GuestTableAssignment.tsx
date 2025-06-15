
import React from "react";

interface GuestTableAssignmentProps {
  guests: string[];
  assignments: Record<string, string>;
  onAssign: (guest: string, table: string) => void;
  tables: string[];
  onTableChange: (tables: string[]) => void;
}

const GuestTableAssignment: React.FC<GuestTableAssignmentProps> = ({
  guests,
  assignments,
  onAssign,
  tables,
  onTableChange
}) => {
  const [newTable, setNewTable] = React.useState("");

  const handleAddTable = () => {
    if (newTable.trim() && !tables.includes(newTable.trim())) {
      onTableChange([...tables, newTable.trim()]);
      setNewTable("");
    }
  };

  return (
    <div className="bg-white rounded p-3 shadow-sm border border-gray-100">
      <div className="mb-2 flex flex-wrap gap-2 items-center">
        <label className="font-semibold">Tables :</label>
        {tables.map((t) => (
          <span
            key={t}
            className="bg-wedding-olive text-white px-2 py-0.5 rounded text-xs">{t}</span>
        ))}
        <input
          type="text"
          placeholder="Nouvelle table"
          className="ml-2 px-2 py-1 border rounded text-sm"
          value={newTable}
          onChange={(e) => setNewTable(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAddTable()}
        />
        <button
          onClick={handleAddTable}
          className="bg-wedding-olive px-3 py-1 text-white rounded text-xs hover:bg-wedding-olive/90"
        >
          Ajouter table
        </button>
      </div>
      <div>
        {guests.length === 0 && <div className="text-sm text-gray-400 italic">Ajoutez des invités d'abord.</div>}
        {guests.length > 0 &&
          <table className="w-full text-xs table-auto">
            <thead>
              <tr>
                <th className="text-left pb-1">Invité</th>
                <th className="text-left pb-1">Table</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest) => (
                <tr key={guest}>
                  <td className="py-1">{guest}</td>
                  <td>
                    <select
                      value={assignments[guest] || ""}
                      onChange={(e) => onAssign(guest, e.target.value)}
                      className="border rounded px-1 py-0.5"
                    >
                      <option value="">Non assigné</option>
                      {tables.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
    </div>
  );
};

export default GuestTableAssignment;
