
import React, { useEffect, useRef } from "react";
import { Canvas, Rect, Circle as FabricCircle, Group, Text as FabricText } from "fabric";
import { useToast } from "@/hooks/use-toast";
import type { TableItem, GuestItem } from "./TablePlanCanvas";

interface InteractiveTablePlanCanvasProps {
  guests: GuestItem[];
  tables: TableItem[];
  setGuests: (g: GuestItem[]) => void;
  setTables: (t: TableItem[]) => void;
  selectedObjectId: string | null;
  setSelectedObjectId: (id: string | null) => void;
}

const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 500;

const InteractiveTablePlanCanvas: React.FC<InteractiveTablePlanCanvasProps> = ({
  guests, tables, setGuests, setTables, selectedObjectId, setSelectedObjectId,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const { toast } = useToast();

  // List of all guests currently assigned (name -> guest object)
  const assignedGuests = guests.filter(g => g.assignedTableId);
  const parkingGuests = guests.filter(g => !g.assignedTableId);

  // Pour garder ref sur objets invités pour déplacement
  // { [name]: FabricObject }
  const guestObjRefs = useRef<Record<string, any>>({});

  useEffect(() => {
    if (!canvasRef.current) return;

    // Nettoyer s'il y avait un canvas
    if (fabricRef.current) fabricRef.current.dispose();

    // Créer le canvas fabric
    const fabricCanvas = new Canvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: "#f5f5f5",
      selection: true,
    });
    fabricRef.current = fabricCanvas;
    guestObjRefs.current = {};

    // ZONE PARKING À GAUCHE (pour invités non assignés, y = distribué)
    parkingGuests.forEach((guest, ix) => {
      const y = 70 + ix * 38;
      const x = 22;
      const circle = new FabricCircle({
        left: x,
        top: y,
        radius: 15,
        fill: "#FFFED2",
        stroke: "#888", strokeWidth: 1.2,
        hasBorders: false,
        hasControls: false,
        selectable: true,
        name: guest.name,
      });
      const label = new FabricText(
        guest.name.length > 9 ? guest.name.slice(0, 8) + "…" : guest.name,
        {
          left: x + 0,
          top: y + 33,
          fontSize: 13,
          fill: "#444",
          originX: "center",
          originY: "top",
        }
      );
      const group = new Group([circle, label], {
        left: x,
        top: y,
        selectable: true,
        name: guest.name,
        id: guest.name,
        objectCaching: false,
      });
      guestObjRefs.current[guest.name] = group;
      fabricCanvas.add(group);

      // Drag end/desaffichage
      group.on("moving", (e: any) => {
        // Si dans la zone des tables, tenter placement à la volée
        // Si relâché loin du parking, assigner avec table detection plus bas
      });

      group.on("mousedown", () => {
        setSelectedObjectId(guest.name);
      });
    });

    // RENDU DES TABLES
    tables.forEach((table, idx) => {
      // Rectangle ou ronde
      let tableShape;
      if (table.type === "rectangle") {
        tableShape = new Rect({
          left: table.left,
          top: table.top,
          width: 120,
          height: 62,
          fill: "#7E9B6B",
          rx: 16,
          ry: 16,
          stroke: "#1e3321",
          strokeWidth: 2.3,
        });
      } else {
        tableShape = new FabricCircle({
          left: table.left + 14,
          top: table.top + 14,
          radius: 40,
          fill: "#DAFFE4",
          stroke: "#41794b",
          strokeWidth: 2.3,
        });
      }

      // Label table
      const label = new FabricText(table.name, {
        left: (table.type === "rectangle") ? (table.left + 60) : (table.left + 54),
        top: (table.type === "rectangle") ? (table.top + 20) : (table.top + 25),
        fontSize: 16,
        fill: "#395d2d",
        fontWeight: "bold",
        originX: "center",
        originY: "center",
      });

      // Label nombre de places
      const info = new FabricText(
        table.type === "rectangle"
          ? `${assignedGuests.filter(g => g.assignedTableId === table.id).length}/${table.seats}`
          : `${assignedGuests.filter(g => g.assignedTableId === table.id).length}/${table.seats}`,
        {
          left: (table.type === "rectangle") ? (table.left + 60) : (table.left + 54),
          top: (table.type === "rectangle") ? (table.top + 57) : (table.top + 70),
          fontSize: 11,
          fill: "#15643a",
          originX: "center",
          originY: "center",
        }
      );

      // Group Fabric
      const tableGroup = new Group([tableShape, label, info], {
        left: table.left,
        top: table.top,
        selectable: true,
        name: table.id,
        id: table.id,
        objectCaching: false,
      });
      tableGroup.on("mousedown", () => setSelectedObjectId(table.id));
      fabricCanvas.add(tableGroup);
    });

    // RENDU INVITÉS ASSIGNÉS SUR LES TABLES
    tables.forEach((table, idx) => {
      const assigned = assignedGuests.filter(g => g.assignedTableId === table.id);
      const nSeats = table.seats;
      assigned.forEach((guest, seatIndex) => {
        // Placement en arc ou cercle selon forme
        let seatX = 0; let seatY = 0;
        if (table.type === "rectangle") {
          // Répartition semi-circulaire au-dessus
          const angle = (seatIndex - (nSeats - 1) / 2) * (Math.PI / (nSeats));
          seatX = table.left + 60 + Math.cos(angle) * 50;
          seatY = table.top - 20 + Math.sin(angle) * 8;
        } else {
          // Ronde : distribution sur cercle autour du centre
          const angle = ((2 * Math.PI) / nSeats) * seatIndex - Math.PI / 2;
          seatX = table.left + 54 + Math.cos(angle) * 52;
          seatY = table.top + 54 + Math.sin(angle) * 52;
        }
        const circle = new FabricCircle({
          left: seatX - 12,
          top: seatY - 12,
          radius: 12,
          fill: "#FFEEDD",
          stroke: "#888",
          strokeWidth: 1.2,
          hasBorders: false,
          hasControls: false,
          selectable: true,
          name: guest.name,
        });
        const label = new FabricText(
          guest.name.length > 7 ? guest.name.slice(0, 6) + "…" : guest.name,
          {
            left: seatX,
            top: seatY + 14,
            fontSize: 10,
            fill: "#333",
            originX: "center",
            originY: "top",
          }
        );
        const group = new Group([circle, label], {
          left: seatX - 7,
          top: seatY - 15,
          selectable: true,
          name: guest.name,
          id: guest.name,
          objectCaching: false,
        });
        group.on("mousedown", () => setSelectedObjectId(guest.name));
        // Drag pour remettre le guest en parking
        group.on("mouseup", () => {
          // Si drag ending hors table, le remettre au parking
          // Ici simplification: double clic ou touche del pour enlever (plus facile)
        });
        fabricCanvas.add(group);
      });
    });

    // INTERACTIONS - suppression via touche Del/Suppr
    const handleKeydown = (ev: KeyboardEvent) => {
      if (["Delete", "Backspace"].includes(ev.key) && (fabricCanvas.getActiveObject())) {
        const obj = fabricCanvas.getActiveObject();
        // Si table
        if (tables.some(t => t.id === obj?.name)) {
          setTables(ts => ts.filter(t => t.id !== obj.name));
        }
        // Si guest en parking
        else if (parkingGuests.some(g => g.name === obj?.name)) {
          setGuests(gs => gs.filter(g => g.name !== obj.name));
        }
        // Si guest sur table
        else if (assignedGuests.some(g => g.name === obj?.name)) {
          setGuests(gs => gs.map(g =>
            g.name === obj.name ? { ...g, assignedTableId: undefined, x: 28, y: 60 + 38 * gs.length } : g
          ));
        }
        setSelectedObjectId(null);
        fabricCanvas.discardActiveObject();
        fabricCanvas.renderAll();
      }
    };
    document.addEventListener("keydown", handleKeydown);

    // Clean up
    return () => {
      fabricCanvas.dispose();
      document.removeEventListener("keydown", handleKeydown);
    };
  // eslint-disable-next-line
  }, [guests, tables]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        tabIndex={0}
        aria-label="Canvas plan de table"
        style={{ background: "#f5f5f5", outline: "none" }}
      />
      <div className="absolute top-2 left-2 text-sm text-gray-500 bg-white px-2 py-1 rounded shadow border">
        <b>Conseils :</b> Sélectionnez une table ou un invité, puis supprimez avec la touche <kbd>Suppr</kbd> ou le bouton «Supprimer».
        <br />
        Faites glisser les invités (parking à gauche) sur les tables.<br />
        Ajoutez des tables avec la barre d’outils.
      </div>
    </div>
  );
};

export default InteractiveTablePlanCanvas;
