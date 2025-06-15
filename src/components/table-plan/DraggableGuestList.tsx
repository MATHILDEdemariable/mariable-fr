
import React from "react";
import clsx from "clsx";

interface DraggableGuestListProps {
  guests: string[];
  assignments: Record<string, string>;
  onDragStart: (guest: string) => void;
}

const DraggableGuestList: React.FC<DraggableGuestListProps> = ({
  guests,
  assignments,
  onDragStart,
}) => {
  // Only show unassigned guests for drag
  const unassigned = guests.filter((g) => !assignments[g]);

  if (unassigned.length === 0) {
    return (
      <div className="text-sm text-gray-400 italic py-2 px-4">
        Tous les invités sont assignés à une table.
      </div>
    );
  }

  return (
    <div className="">
      <div className="font-semibold mb-2 px-2">Invités à placer</div>
      <div className="flex flex-wrap gap-2 p-2">
        {unassigned.map((guest) => (
          <div
            key={guest}
            draggable
            onDragStart={() => onDragStart(guest)}
            className={clsx(
              "bg-gray-200 hover:bg-wedding-olive/70 text-gray-700 px-3 py-1 rounded cursor-grab shadow text-xs transition border border-gray-300",
              "active:scale-95"
            )}
            style={{ userSelect: "none" }}
            title="Glisser vers une table"
          >
            {guest}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DraggableGuestList;

