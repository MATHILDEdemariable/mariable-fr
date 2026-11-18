// Fiche Guide d'un pro : champs comptés pour la complétude
export const GUIDE_PROFILE_FIELDS = ['nom', 'responsable_nom', 'ville', 'pays', 'telephone', 'email', 'instagram', 'site_web', 'photo_portrait_url', 'description'] as const;
export type GuideProfileField = typeof GUIDE_PROFILE_FIELDS[number];

export const countGuideProfileCompletion = (values: Partial<Record<GuideProfileField, string | null>>): number =>
  GUIDE_PROFILE_FIELDS.filter((field) => (values[field] ?? '').toString().trim().length > 0).length;

export const buildGuideSlug = (agencyName: string, suffix: string): string => {
  const base = agencyName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
  return `${base || 'wedding-planner'}-${suffix.slice(0, 6)}`;
};
