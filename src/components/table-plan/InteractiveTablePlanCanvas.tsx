import React, { useEffect, useRef } from "react";
import { Canvas, Rect, Group, Circle, Text as FabricText } from "fabric";
import { Button } from "@/components/ui/button";
import { exportDashboardToPDF } from "@/services/pdfExportService";
import { useToast } from "@/hooks/use-toast";

interface InteractiveTablePlanCanvasProps {
  guests: string[];
  assignments: Record<string, string>;
  tables: string[];
  tableSeats: Record<string, number>;
  onDropGuest: (guest: string, table: string) => void;
}

const tableColors = [
  "#7E9B6B", "#E1B382", "#E07A5F", "#3D405B", "#81B29A", "#F4F1DE", "#22223B", "#9A8C98"
];

const CANVAS_ID = "plan-table-canvas-container";

const InteractiveTablePlanCanvas: React.FC<InteractiveTablePlanCanvasProps> = ({
  guests, assignments, tables, tableSeats, onDropGuest,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const tableGroupsRef = useRef<{ [key: string]: Group }>({});
  const { toast } = useToast();

  useEffect(() => {
    if (!canvasRef.current) return;
    if (fabricRef.current) {
      fabricRef.current.dispose();
    }
    const fabricCanvas = new Canvas(canvasRef.current, {
      width: 700,
      height: 500,
      backgroundColor: "#f5f5f5",
      selection: true,
    });
    fabricRef.current = fabricCanvas;
    tableGroupsRef.current = {};

    // --- Table rendering ---
    tables.forEach((table, idx) => {
      const color = tableColors[idx % tableColors.length];
      const seats = tableSeats[table] || 8;

      const t = new Rect({
        left: 100 + idx * 170,
        top: 130,
        width: 110,
        height: 60,
        fill: color,
        rx: 16,
        ry: 16,
        stroke: "#222",
        strokeWidth: 2,
        hasControls: true,
        hasBorders: true,
        selectable: true,
      });

      // Label (Table name)
      const label = new FabricText(table, {
        left: t.left! + t.width!/2,
        top: t.top! + 18,
        fontSize: 17,
        fill: "#fff",
        fontWeight: "bold",
        originX: "center", originY: "center"
      });

      // Places (show assigned/total)
      const numAss = guests.filter(g => assignments[g] === table).length;
      const placeLabel = new FabricText(
        `(${numAss}/${seats} places)`,
        {
          left: t.left! + t.width!/2,
          top: t.top! + t.height! - 14,
          fontSize: 11,
          fill: "#fff",
          originX: "center", originY: "center"
        }
      );

      // Table group (used for drop detection)
      const g = new Group([t, label, placeLabel], {
        left: t.left,
        top: t.top,
      });
      g.set("name", table);
      fabricCanvas.add(g);
      tableGroupsRef.current[table] = g;
    });

    // Draw guests on tables: as circles + names
    tables.forEach((table, idx) => {
      const assigned = guests.filter(g => assignments[g] === table);
      const seats = tableSeats[table] || 8;
      assigned.forEach((guest, i) => {
        // Arrange in a semicircle above table (simple visual)
        const angle = (i - (seats-1)/2) * (Math.PI / seats);
        const centerX = 100 + idx * 170 + 55;
        const centerY = 130 + 9;
        const radius = 55;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY - 33 + Math.sin(angle)*9;

        // Seat circle
        const circle = new Circle({
          left: x - 13, top: y - 13,
          radius: 13,
          fill: "#FFFED2",
          stroke: "#444", strokeWidth: 1.3,
        });
        // Name label (shorten long names)
        const nameText = new FabricText(
          guest.length > 9 ? guest.slice(0, 8) + '…' : guest,
          {
            left: x, top: y+16,
            fontSize: 11,
            fill: "#444",
            originX: "center", originY: "top"
          }
        );
        fabricCanvas.add(circle);
        fabricCanvas.add(nameText);
      });
      // Draw available seats if not full (empty slots, faded)
      for(let i=assigned.length; i<seats; i++) {
        const angle = (i - (seats-1)/2) * (Math.PI / seats);
        const centerX = 100 + idx * 170 + 55;
        const centerY = 130 + 9;
        const radius = 55;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY - 33 + Math.sin(angle)*9;
        const circle = new Circle({
          left: x - 13, top: y - 13,
          radius: 13,
          fill: "#eeeeee",
          stroke: "#bbb", strokeWidth: 1.1,
          opacity: 0.5,
        });
        fabricCanvas.add(circle);
      }
    });

    fabricCanvas.setDimensions({ width: 700, height: 500 });
    fabricCanvas.renderAll();

    // --- Native DOM Drag & Drop events for the canvas ---
    // (Invisible overlay for capturing events)
    const canvasDom = canvasRef.current;
    if (canvasDom) {
      canvasDom.ondragover = (e) => {
        e.preventDefault();
        // Optionnel : highlight, non fait ici (bonus possible)
      };
      canvasDom.ondrop = (e) => {
        e.preventDefault();
        // Récupérer l’invité depuis dataTransfer
        const guest = e.dataTransfer.getData("text/plain");
        if (!guest) return;
        // Convertir les coords 
        const rect = canvasDom.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // Hit test tables
        let dropped = false;
        for (const table of tables) {
          const g = tableGroupsRef.current[table];
          if (!g) continue;
          if (g.left != null && g.top != null) {
            const gx = g.left as number;
            const gy = g.top as number;
            const width = 110;
            const height = 60;
            if (
              x >= gx &&
              x <= gx + width &&
              y >= gy &&
              y <= gy + height
            ) {
              // Vérifier capacité:
              const nbAssigned = guests.filter(gst => assignments[gst] === table).length;
              const nbMax = tableSeats[table] || 8;
              if (nbAssigned >= nbMax) {
                toast({
                  title: "Table complète",
                  description: "Cette table a atteint sa capacité maximale.",
                  variant: "destructive",
                });
              } else {
                onDropGuest(guest, table);
                // Optionnel: toast de succès léger
                toast({
                  title: "Ajouté !",
                  description: `${guest} assigné à ${table}`,
                  variant: "success",
                });
              }
              fabricCanvas && fabricCanvas.renderAll();
              dropped = true;
              break;
            }
          }
        }
        if (!dropped) {
          // Option: toast d'échec
          toast({
            title: "Aucune table sélectionnée",
            description: "Déposez l'invité sur une table.",
            variant: "destructive",
          });
        }
      };
      // Clean up on unmount
      return () => {
        canvasDom.ondragover = null;
        canvasDom.ondrop = null;
        fabricCanvas.dispose();
      };
    }
    return () => {
      fabricCanvas.dispose();
    };
    // eslint-disable-next-line
  }, [tables, guests, assignments, tableSeats, onDropGuest, toast]);

  // Export PDF
  const handleExport = async () => {
    await exportDashboardToPDF(
      CANVAS_ID,
      "plan_de_table.pdf",
      "landscape",
      "Plan de table"
    );
  };

  return (
    <div>
      <div id={CANVAS_ID} className="flex flex-col gap-2 items-center bg-white shadow-lg rounded p-3 border">
        <canvas 
          ref={canvasRef} 
          width={700} 
          height={500} 
          className="border"
          tabIndex={0}
          aria-label="Canvas plan de table"
        />
        <div className="text-xs text-gray-500 mt-2">
          Faites glisser les invités vers une table.<br/>
          Faites vos modifications puis cliquez pour exporter en PDF.
        </div>
      </div>
      <Button
        variant="wedding"
        onClick={async () => {
          await exportDashboardToPDF(
            CANVAS_ID,
            "plan_de_table.pdf",
            "landscape",
            "Plan de table"
          );
        }}
        className="mt-4 w-full"
      >
        Exporter ce plan (PDF)
      </Button>
    </div>
  );
};

export default InteractiveTablePlanCanvas;
