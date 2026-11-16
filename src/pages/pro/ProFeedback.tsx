import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ProFeedback = () => {
  const isEnglish = new URLSearchParams(window.location.search).get("lang") === "en";
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async () => {
    if (rating < 1) { toast.error(isEnglish ? "Please pick a rating" : "Choisissez une note"); return; }
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error(isEnglish ? "Please log in first" : "Connectez-vous d'abord"); window.location.href = "/login?redirect=/pro-feedback"; return; }
      const { error } = await supabase.from("pro_satisfaction_feedback").insert({
        user_id: user.id, email: user.email, rating, comment: comment.trim().slice(0, 2000) || null,
      });
      if (error) throw error;
      setIsSent(true);
    } catch (error) {
      console.error("❌ pro feedback failed:", error);
      toast.error(isEnglish ? "Could not send, try again" : "Envoi impossible, réessayez");
    } finally { setIsSubmitting(false); }
  };

  return (
    <main className="min-h-screen bg-editorial-beige flex items-center justify-center px-4 py-12">
      <Helmet><title>{isEnglish ? "Your feedback · Mariable Pro" : "Votre avis · Mariable Pro"}</title><meta name="robots" content="noindex" /></Helmet>
      <section className="w-full max-w-lg bg-background border border-border p-8 rounded-none">
        <p className="text-xs tracking-[0.2em] uppercase text-wedding-olive mb-4">Mariable Pro</p>
        {isSent ? (
          <h1 className="font-serif text-2xl" role="alert">{isEnglish ? "Thank you! Your feedback helps us improve." : "Merci ! Votre retour nous aide à nous améliorer."}</h1>
        ) : (<>
          <h1 className="font-serif text-2xl mb-2">{isEnglish ? "How was your experience?" : "Comment s'est passée votre expérience ?"}</h1>
          <p className="text-muted-foreground mb-6">{isEnglish ? "One click is enough, a comment if you wish." : "Un clic suffit, un commentaire si vous le souhaitez."}</p>
          <div className="flex gap-2 mb-6" role="radiogroup" aria-label={isEnglish ? "Rating" : "Note"}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button key={value} type="button" role="radio" aria-checked={rating === value} aria-label={`${value}/5`}
                onClick={() => setRating(value)} className="min-h-[44px] min-w-[44px] flex items-center justify-center">
                <Star className={`h-9 w-9 ${value <= rating ? "fill-wedding-olive text-wedding-olive" : "text-muted-foreground"}`} />
              </button>
            ))}
          </div>
          <Textarea value={comment} onChange={(e) => setComment(e.target.value)} maxLength={2000} rows={4} className="rounded-none mb-6 text-base"
            placeholder={isEnglish ? "Your comment (optional)" : "Votre commentaire (facultatif)"} />
          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full rounded-none bg-wedding-olive hover:bg-wedding-olive/90 text-primary-foreground min-h-[44px]">
            {isEnglish ? "Send my feedback" : "Envoyer mon avis"}
          </Button>
        </>)}
      </section>
    </main>
  );
};
export default ProFeedback;
