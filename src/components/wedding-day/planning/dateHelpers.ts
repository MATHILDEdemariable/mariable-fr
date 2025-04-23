
/**
 * Helpers pour la gestion des dates/heure dans le planning du mariage
 */
import { addMinutes } from "date-fns";

export function getCeremonyStart(startTime: Date) {
  return addMinutes(startTime, 10); // Marge de 10min avant la cérémonie
}

export function getCeremonyDuration(type: "religieuse" | "laique") {
  return type === "religieuse" ? 90 : 60;
}
