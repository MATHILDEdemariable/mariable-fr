import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, Send, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import mathildePortrait from "@/assets/mathilde-portrait.jpg";

interface ContactProModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultSubject?: string;
}

const EMAIL = "mathilde@mariable.fr";
const PHONE_DISPLAY = "+33 7 60 10 81 89";
const WHATSAPP_URL = "https://wa.me/33760108189";

const ContactProModal = ({ open, onOpenChange, defaultSubject }: ContactProModalProps) => {
  const { t } = useTranslation("partenariat");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ email: "", phone: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) {
      toast({
        title: t("modal.incomplete"),
        description: t("modal.required"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const messagePrefix = defaultSubject ? `[${defaultSubject}] ` : "";
      const { error } = await supabase.from("contact_requests").insert({
        type: "prestataire",
        email: formData.email.trim(),
        phone: formData.phone?.trim() || null,
        message: `${messagePrefix}${formData.message.trim()}`,
      });
      if (error) throw error;

      // Email notification to Mathilde (non-blocking)
      supabase.functions
        .invoke("notify-partenariat-contact", {
          body: {
            email: formData.email.trim(),
            phone: formData.phone?.trim() || null,
            message: formData.message.trim(),
            subject: defaultSubject || null,
          },
        })
        .catch((err) => console.error("notify-partenariat-contact invoke error:", err));

      toast({
        title: t("modal.successTitle"),
        description: t("modal.successBody"),
      });
      setFormData({ email: "", phone: "", message: "" });
      onOpenChange(false);
    } catch (err) {
      console.error("ContactProModal submit error:", err);
      toast({
        title: t("modal.errorTitle"),
        description: t("modal.errorBody"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-none">
        <div className="grid md:grid-cols-2">
          {/* Left — form */}
          <div className="p-6 md:p-8 bg-white">
            <DialogHeader className="mb-4 text-left">
              <DialogTitle className="font-serif text-2xl text-editorial-noir">
                {t("modal.title")}
              </DialogTitle>
              <DialogDescription className="text-editorial-noir/70">
                {defaultSubject
                  ? t("modal.subjectPrefix", { subject: defaultSubject })
                  : t("modal.defaultDescription")}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-editorial-noir">
                  {t("modal.emailLabel")} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    placeholder={t("modal.emailPlaceholder")}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-editorial-noir">
                  {t("modal.phoneLabel")}
                </label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    placeholder={t("modal.phonePlaceholder")}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-editorial-noir">
                  {t("modal.messageLabel")} <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                  placeholder={t("modal.messagePlaceholder")}
                  rows={5}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-editorial-noir hover:bg-editorial-noir/90 text-white rounded-none"
              >
                {isSubmitting ? (
                  t("modal.submitting")
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" /> {t("modal.submit")}
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Right — direct contact */}
          <div className="p-6 md:p-8 bg-editorial-beige/40 flex flex-col">
            <div className="flex flex-col items-center text-center">
              <img
                src={mathildePortrait}
                alt={t("modal.founderName")}
                className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full mb-4"
                loading="lazy"
              />
              <p className="font-serif text-xl text-editorial-noir">{t("modal.founderName")}</p>
              <p className="text-sm text-editorial-noir/60 mb-6">{t("modal.founderRole")}</p>
            </div>

            <div className="space-y-3 mt-auto">
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-3 p-3 bg-white border border-editorial-noir/10 hover:border-editorial-noir transition-colors"
              >
                <Mail className="w-5 h-5 text-premium-sage shrink-0" />
                <div className="text-left">
                  <p className="text-xs uppercase tracking-widest text-editorial-noir/50">
                    {t("modal.directEmail")}
                  </p>
                  <p className="text-sm text-editorial-noir">{EMAIL}</p>
                </div>
              </a>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white border border-editorial-noir/10 hover:border-editorial-noir transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-premium-sage shrink-0" />
                <div className="text-left">
                  <p className="text-xs uppercase tracking-widest text-editorial-noir/50">
                    {t("modal.directPhone")}
                  </p>
                  <p className="text-sm text-editorial-noir">{PHONE_DISPLAY}</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactProModal;
