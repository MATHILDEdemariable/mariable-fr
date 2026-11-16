import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

type ProFeedbackRow = { id: string; email: string | null; rating: number; comment: string | null; created_at: string };

const ProFeedbackAdminSection = () => {
  const [rows, setRows] = useState<ProFeedbackRow[]>([]);
  useEffect(() => {
    supabase.from("pro_satisfaction_feedback").select("id, email, rating, comment, created_at")
      .order("created_at", { ascending: false }).limit(200)
      .then(({ data, error }) => { if (error) console.error("❌ pro feedback load failed:", error); setRows(data || []); });
  }, []);
  const average = rows.length ? (rows.reduce((sum, row) => sum + row.rating, 0) / rows.length).toFixed(1) : "—";
  return (
    <Card>
      <CardHeader><CardTitle>Retours Pros ({rows.length}) · moyenne {average}/5</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {rows.length === 0 && <p className="text-muted-foreground">Aucun retour pour le moment.</p>}
        {rows.map((row) => (
          <div key={row.id} className="border-b border-border pb-3">
            <p className="text-sm"><span className="text-wedding-olive">{"★".repeat(row.rating)}{"☆".repeat(5 - row.rating)}</span> · {row.email || "—"} · {new Date(row.created_at).toLocaleDateString("fr-FR")}</p>
            {row.comment && <p className="text-sm mt-1 whitespace-pre-wrap">{row.comment}</p>}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
export default ProFeedbackAdminSection;
