
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
  const guestObjRefs = useRef<Record<string, any>>({});

  useEffect(() => {
    if (!canvasRef.current) return;

    if (fabricRef.current) fabricRef.current.dispose();

    const fabricCanvas = new Canvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: "#f5f5f5",
      selection: true,
    });
    fabricRef.current = fabricCanvas;
    guestObjRefs.current = {};

    // ZONE PARKING À GAUCHE (pour invités non assignés)
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
        objectCaching: false,
      }) as any;
      group.set("objectType", "guest");
      group.set("objectId", guest.name);
      guestObjRefs.current[guest.name] = group;
      fabricCanvas.add(group);

      group.on("mousedown", () => {
        setSelectedObjectId(guest.name);
      });
    });

    // RENDU DES TABLES
    tables.forEach((table) => {
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

      const label = new FabricText(table.name, {
        left: (table.type === "rectangle") ? (table.left + 60) : (table.left + 54),
        top: (table.type === "rectangle") ? (table.top + 20) : (table.top + 25),
        fontSize: 16,
        fill: "#395d2d",
        fontWeight: "bold",
        originX: "center",
        originY: "center",
      });

      const info = new FabricText(
        `${assignedGuests.filter(g => g.assignedTableId === table.id).length}/${table.seats}`,
        {
          left: (table.type === "rectangle") ? (table.left + 60) : (table.left + 54),
          top: (table.type === "rectangle") ? (table.top + 57) : (table.top + 70),
          fontSize: 11,
          fill: "#15643a",
          originX: "center",
          originY: "center",
        }
      );

      const tableGroup = new Group([tableShape, label, info], {
        left: table.left,
        top: table.top,
        selectable: true,
        objectCaching: false,
      }) as any;
      tableGroup.set("objectType", "table");
      tableGroup.set("objectId", table.id);
      tableGroup.on("mousedown", () => setSelectedObjectId(table.id));
      fabricCanvas.add(tableGroup);
    });

    // RENDU INVITÉS ASSIGNÉS SUR LES TABLES
    tables.forEach((table) => {
      const assigned = assignedGuests.filter(g => g.assignedTableId === table.id);
      const nSeats = table.seats;
      assigned.forEach((guest, seatIndex) => {
        let seatX = 0, seatY = 0;
        if (table.type === "rectangle") {
          const angle = (seatIndex - (nSeats - 1) / 2) * (Math.PI / (nSeats));
          seatX = table.left + 60 + Math.cos(angle) * 50;
          seatY = table.top - 20 + Math.sin(angle) * 8;
        } else {
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
          objectCaching: false,
        }) as any;
        group.set("objectType", "guest-assigned");
        group.set("objectId", guest.name);
        group.on("mousedown", () => setSelectedObjectId(guest.name));
        fabricCanvas.add(group);
      });
    });

    // INTERACTIONS - suppression via touche Del/Suppr
    const handleKeydown = (ev: KeyboardEvent) => {
      if (["Delete", "Backspace"].includes(ev.key) && fabricCanvas.getActiveObject()) {
        const obj = fabricCanvas.getActiveObject() as any;
        // Retrieve type/id
        const objectType = obj?.get("objectType");
        const objectId = obj?.get("objectId");

        if (objectType === "table") {
          // Remove table by ID
          const newTables = tables.filter(t => t.id !== objectId);
          setTables(newTables);
        }
        else if (objectType === "guest") {
          // Remove guest by name
          const newGuests = guests.filter(g => g.name !== objectId);
          setGuests(newGuests);
        }
        else if (objectType === "guest-assigned") {
          // Move guest back to parking zone
          const newGuests = guests.map(g =>
            g.name === objectId
              ? { ...g, assignedTableId: undefined, x: 28, y: 60 + 38 * guests.length }
              : g
          );
          setGuests(newGuests);
        }

        setSelectedObjectId(null);
        fabricCanvas.discardActiveObject();
        fabricCanvas.renderAll();
      }
    };
    document.addEventListener("keydown", handleKeydown);

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
