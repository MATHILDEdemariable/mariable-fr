
import React from "react";
import { Circle, Square, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TablePlanToolbarProps {
  onAddRectangle: () => void;
  onAddRound: () => void;
  onDelete: () => void;
}

const TablePlanToolbar: React.FC<TablePlanToolbarProps> = ({
  onAddRectangle,
  onAddRound,
  onDelete,
}) => (
  <div className="mb-2 flex gap-3 items-center bg-white rounded border shadow-sm px-3 py-2">
    <Button
      size="sm"
      variant="outline"
      onClick={onAddRectangle}
      title="Ajouter table rectangulaire"
      className="flex gap-1 items-center"
    >
      <Square className="w-5 h-5" />
      Table rect.
    </Button>
    <Button
      size="sm"
      variant="outline"
      onClick={onAddRound}
      title="Ajouter table ronde"
      className="flex gap-1 items-center"
    >
      <Circle className="w-5 h-5" />
      Table ronde
    </Button>
    <Button
      size="sm"
      variant="destructive"
      onClick={onDelete}
      title="Supprimer l'élément sélectionné"
      className="flex gap-1 items-center"
    >
      <Trash2 className="w-5 h-5" />
      Supprimer
    </Button>
  </div>
);

export default TablePlanToolbar;
