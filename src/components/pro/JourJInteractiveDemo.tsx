import { useState } from "react";
import { CheckCircle2, FileText, Music2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const demoTasks = [
  { time: "15:00", title: "Arrivée des invités", assignee: "Coordination" },
  { time: "16:00", title: "Cérémonie laïque", assignee: "Coordination" },
  { time: "17:15", title: "Lancement du cocktail", assignee: "Traiteur" },
  { time: "19:45", title: "Entrée des mariés", assignee: "DJ" },
  { time: "22:30", title: "Ouverture de bal", assignee: "DJ" },
];

const JourJInteractiveDemo = () => {
  const [view, setView] = useState<"all" | "dj">("all");
  const visibleTasks = view === "dj" ? demoTasks.filter((task) => task.assignee === "DJ") : demoTasks;

  return (
    <div className="border border-editorial-noir/20 bg-background p-3 sm:p-6" aria-label="Démonstration du planning partagé">
      <div className="mb-5 flex items-center justify-between border-b border-editorial-noir/15 pb-4">
        <div>
          <p className="font-serif text-xl text-editorial-noir">Camille & Thomas</p>
          <p className="text-xs text-editorial-noir/60">Samedi 12 septembre · Domaine des Oliviers</p>
        </div>
        <CheckCircle2 className="h-6 w-6 text-editorial-olive" aria-hidden="true" />
      </div>

      <div className="mb-5 grid grid-cols-2 border border-editorial-olive" role="group" aria-label="Filtrer la démonstration">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setView("all")}
          className={cn("rounded-none", view === "all" && "bg-editorial-olive text-primary-foreground hover:bg-editorial-olive/90 hover:text-primary-foreground")}
        >
          <Users className="mr-2 h-4 w-4" /> Vue complète
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setView("dj")}
          className={cn("rounded-none", view === "dj" && "bg-editorial-olive text-primary-foreground hover:bg-editorial-olive/90 hover:text-primary-foreground")}
        >
          <Music2 className="mr-2 h-4 w-4" /> Vue DJ
        </Button>
      </div>

      <div className="space-y-2" aria-live="polite">
        {visibleTasks.map((task) => (
          <div key={`${task.time}-${task.title}`} className="grid grid-cols-[52px_1fr_auto] items-center gap-3 border-b border-editorial-noir/10 py-3">
            <span className="font-medium text-editorial-olive">{task.time}</span>
            <span className="text-sm text-editorial-noir">{task.title}</span>
            <span className="hidden text-xs text-editorial-noir/55 sm:block">{task.assignee}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2 bg-editorial-beige/30 p-3 text-xs text-editorial-noir/70">
        <FileText className="h-4 w-4 text-editorial-olive" />
        3 documents partagés · contacts d’urgence inclus
      </div>
    </div>
  );
};

export default JourJInteractiveDemo;