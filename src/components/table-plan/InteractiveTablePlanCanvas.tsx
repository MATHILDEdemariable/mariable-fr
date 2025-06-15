import React, { useEffect, useRef } from "react";
import { Canvas, Rect, Group, Circle, Text as FabricText } from "fabric";
import { Button } from "@/components/ui/button";
import { exportDashboardToPDF } from "@/services/pdfExportService";

interface InteractiveTablePlanCanvasProps {
  guests: string[];
  assignments: Record<string, string>;
  tables: string[];
}

// Utilitaire simple pour assigner une couleur par table
const tableColors = [
  "#7E9B6B", "#E1B382", "#E07A5F", "#3D405B", "#81B29A", "#F4F1DE", "#22223B", "#9A8C98"
];

const CANVAS_ID = "plan-table-canvas-container";

const InteractiveTablePlanCanvas: React.FC<InteractiveTablePlanCanvasProps> = ({
  guests, assignments, tables
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);

  // Mount Fabric.js canvas
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

    // Add basic drag&drop for new tables (demo: add 2 tables)
    tables.forEach((table, idx) => {
      const groupName = table;
      const color = tableColors[idx % tableColors.length];

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
      // Ajout du label
      const label = new FabricText(table, {
        left: t.left! + t.width!/2,
        top: t.top! + t.height!/2,
        fontSize: 17,
        fill: "#fff",
        fontWeight: "bold",
        originX: "center", originY: "center"
      });
      const g = new Group([t, label], {
        left: t.left,
        top: t.top,
      });
      g.set("name", groupName);
      fabricCanvas.add(g);
    });

    // Ajout des invités sur les tables
    tables.forEach((table, idx) => {
      // Filtrer les invités assignés à cette table
      const assigned = guests.filter(g => assignments[g] === table);
      assigned.forEach((guest, i) => {
        // Position autour de la table (faire un "arc" dessus)
        const ang = Math.PI/ assigned.length; // On répartit
        const offsetY = -38;
        const angle = (i - (assigned.length-1)/2) * 0.7; // Pour placer sur l'arc
        const centerX = 100 + idx * 170 + 55;
        const centerY = 130 + 30;
        const x = centerX + Math.cos(angle) * 55;
        const y = centerY + offsetY;

        const circle = new Circle({
          left: x - 14, // rayon invité
          top: y - 14,
          radius: 14,
          fill: "#FFFED2",
          stroke: "#444", strokeWidth: 1.5,
        });
        const nameText = new FabricText(guest, {
          left: x,
          top: y+18,
          fontSize: 11,
          fill: "#444",
          originX: "center", originY: "top"
        });
        fabricCanvas.add(circle);
        fabricCanvas.add(nameText);
      });
    });

    // Resize on mount
    fabricCanvas.setDimensions({ width: 700, height: 500 });
    fabricCanvas.renderAll();

    // Clean up on unmount
    return () => {
      fabricCanvas.dispose();
    };
    // eslint-disable-next-line
  }, [tables, guests, assignments]);

  // Export PDF (rapide : capture le container, pas le pur canvas)
  const handleExport = async () => {
    // On fait un wrapper autour du canvas pour l'export
    // Mettre le canvas dans un div avec id CANVAS_ID pour pdfExportService
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
        <canvas ref={canvasRef} width={700} height={500} className="border" />
        <div className="text-xs text-gray-500 mt-2">
          Faites vos modifications puis cliquez pour exporter en PDF
        </div>
      </div>
      <Button
        variant="wedding"
        onClick={handleExport}
        className="mt-4 w-full"
      >
        Exporter ce plan (PDF)
      </Button>
    </div>
  );
};

export default InteractiveTablePlanCanvas;
