import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Calculator, Users, Home, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PremiumToolsSection = () => {
  const { t } = useTranslation("home");
  const tools = [
    {
      icon: CheckSquare,
      title: t("tools.items.checklist.title"),
      description: t("tools.items.checklist.description"),
      gradient: "from-premium-sage to-premium-sage-medium",
    },
    {
      icon: Calculator,
      title: t("tools.items.budget.title"),
      description: t("tools.items.budget.description"),
      gradient: "from-premium-sage-medium to-premium-sage-light",
    },
    {
      icon: Users,
      title: t("tools.items.drinks.title"),
      description: t("tools.items.drinks.description"),
      gradient: "from-premium-sage-light to-premium-sage",
    },
    {
      icon: Users,
      title: t("tools.items.rsvp.title"),
      description: t("tools.items.rsvp.description"),
      gradient: "from-premium-sage to-premium-sage-light",
      badge: t("tools.items.rsvp.badge"),
    },
    {
      icon: Home,
      title: t("tools.items.accommodations.title"),
      description: t("tools.items.accommodations.description"),
      gradient: "from-premium-sage-medium to-premium-sage",
    },
    {
      icon: FileText,
      title: t("tools.items.documents.title"),
      description: t("tools.items.documents.description"),
      gradient: "from-premium-sage-light to-premium-sage-medium",
    },
  ];
  return (
    <section className="py-24 bg-premium-base">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-premium-sage-very-light text-premium-sage border-premium-sage-light">
            {t("tools.badge")}
          </Badge>
          <h2 className="text-4xl font-bold text-premium-black mb-6 md:text-4xl">
            {t("tools.title")}
          </h2>
          <p className="text-xl text-premium-charcoal max-w-3xl mx-auto">{t("tools.subtitle")}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tools.map((tool, index) => (
              <Card
                key={index}
                className="feature-card group bg-white shadow-lg border-premium-light section-reveal stagger-item"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${tool.gradient} flex-shrink-0`}>
                      <tool.icon className="feature-icon h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-premium-black mb-2 flex items-center gap-2">
                        {tool.title}
                        {tool.badge && <Badge className="text-xs bg-premium-sage text-white">{tool.badge}</Badge>}
                      </h3>
                      <p className="text-premium-charcoal">{tool.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl border border-premium-light overflow-hidden">
              <div className="bg-gradient-to-r from-premium-sage via-premium-sage-medium to-premium-sage-light p-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                </div>
                <h4 className="text-white font-semibold mt-4">{t("tools.mockup.title")}</h4>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-premium-charcoal">{t("tools.mockup.task1")}</span>
                  <Badge className="ml-auto bg-green-100 text-green-700">{t("tools.mockup.status1")}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-premium-sage rounded"></div>
                  <span className="text-premium-charcoal">{t("tools.mockup.task2")}</span>
                  <Badge className="ml-auto bg-orange-100 text-orange-700">{t("tools.mockup.status2")}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-premium-light rounded"></div>
                  <span className="text-premium-charcoal/60">{t("tools.mockup.task3")}</span>
                  <Badge className="ml-auto bg-gray-100 text-gray-600">{t("tools.mockup.status3")}</Badge>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-premium-gradient-start/10 via-transparent to-premium-gradient-end/10 rounded-2xl pointer-events-none"></div>
          </div>
        </div>

        <div className="text-center mt-16">
          <Link to="/register">
            <Button size="lg" className="btn-primary text-white px-12 py-4 text-lg font-semibold ripple">
              {t("tools.cta")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
export default PremiumToolsSection;
