/** Module Traiteur : un plan par mariage (wedding_module_plans, module 'catering'), découpé par jour d'événement. */
export type EquipmentSource = 'caterer' | 'rental' | 'couple' | '';
export type EquipmentRow = { id: string; group: string; label: string; source: EquipmentSource; notes: string };
export type CateringVendor = { id: string; name: string; role: string; contact: string };
export type CateringCustomItem = { id: string; label: string; detail: string };
export type CateringLogistics = { arrival: string; setup: string; service: string; teardown: string; notes: string };
export type CateringDay = {
  id: string;
  name: string;
  date: string;
  guestCount: string;
  vendors: CateringVendor[];
  menu: Record<string, string>;
  equipment: EquipmentRow[];
  logistics: CateringLogistics;
  customItems: CateringCustomItem[];
};
export type CateringPlan = {
  proposals: { name: string; url: string; path: string }[];
  validation: { status: 'in_progress' | 'validated'; coupleOk: boolean; plannerOk: boolean };
  /** Anciennes données (avant découpage par jour) : reprises dans le jour « Jour J » au premier chargement */
  menu: Record<string, string>;
  equipment: EquipmentRow[];
  days?: CateringDay[];
};

export const MENU_FIELDS: { key: string; fr: string; en: string }[] = [
  { key: 'cocktail', fr: 'Pièces vin d’honneur / apéritif', en: 'Cocktail / appetisers' },
  { key: 'starter', fr: 'Entrée', en: 'Starter' },
  { key: 'main', fr: 'Plat', en: 'Main course' },
  { key: 'cheese', fr: 'Fromages', en: 'Cheese' },
  { key: 'dessert', fr: 'Dessert / Pièce montée', en: 'Dessert / Wedding cake' },
  { key: 'kids', fr: 'Menu enfants', en: 'Kids menu' },
  { key: 'diets', fr: 'Régimes spécifiques & allergies', en: 'Special diets & allergies' },
];

export const VENDOR_ROLES: { key: string; fr: string; en: string }[] = [
  { key: 'main_caterer', fr: 'Traiteur principal', en: 'Main caterer' },
  { key: 'food_truck', fr: 'Food truck', en: 'Food truck' },
  { key: 'pastry', fr: 'Pâtissier / Wedding cake', en: 'Pastry / Wedding cake' },
  { key: 'rental', fr: 'Loueur vaisselle & mobilier', en: 'Tableware & furniture rental' },
  { key: 'bar', fr: 'Bar / Boissons', en: 'Bar / Drinks' },
  { key: 'other', fr: 'Autre', en: 'Other' },
];

export const EQUIPMENT_DEFAULTS: [string, string[]][] = [
  ['Assiettes', ['Assiettes cocktail', 'Assiettes entrée', 'Assiettes plat', 'Assiettes dessert']],
  ['Verres', ['Verres à eau', 'Verres vin rouge', 'Verres vin blanc', 'Flûtes']],
  ['Couverts', ['Couverts']],
  ['Nappes & serviettes', ['Nappes', 'Serviettes']],
  ['Mobilier', ['Tables', 'Chaises', 'Buffets']],
];

export const SOURCES: { key: Exclude<EquipmentSource, ''>; emoji: string; fr: string; en: string; className: string }[] = [
  { key: 'caterer', emoji: '🟢', fr: 'Fourni par traiteur', en: 'Caterer', className: 'border-green-600 bg-green-50 text-green-800' },
  { key: 'rental', emoji: '🟡', fr: 'Loué séparément', en: 'Rented', className: 'border-amber-500 bg-amber-50 text-amber-800' },
  { key: 'couple', emoji: '🔵', fr: 'Acheté / DIY mariés', en: 'Bought / DIY', className: 'border-blue-600 bg-blue-50 text-blue-800' },
];

export const DAY_PRESETS: { fr: string; en: string }[] = [
  { fr: 'Welcome dinner', en: 'Welcome dinner' },
  { fr: 'Brunch du lendemain', en: 'Next-day brunch' },
  { fr: 'Cocktail', en: 'Cocktail' },
];

export const buildDefaultEquipment = (): EquipmentRow[] =>
  EQUIPMENT_DEFAULTS.flatMap(([group, labels]) => labels.map((label, index) => ({ id: `${group}-${index}`, group, label, source: '' as EquipmentSource, notes: '' })));

export const createCateringDay = (name: string, overrides: Partial<CateringDay> = {}): CateringDay => ({
  id: `day-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  name, date: '', guestCount: '', vendors: [], menu: {}, equipment: buildDefaultEquipment(),
  logistics: { arrival: '', setup: '', service: '', teardown: '', notes: '' }, customItems: [],
  ...overrides,
});

export const DEFAULT_CATERING_PLAN: CateringPlan = {
  proposals: [],
  menu: {},
  validation: { status: 'in_progress', coupleOk: false, plannerOk: false },
  equipment: buildDefaultEquipment(),
};

/** Jours de l'événement ; reprend les anciennes données dans « Jour J » si le plan n'est pas encore découpé. */
export const getCateringDays = (plan: CateringPlan): CateringDay[] =>
  plan.days && plan.days.length > 0
    ? plan.days
    : [createCateringDay('Jour J', { id: 'main', menu: plan.menu || {}, equipment: plan.equipment?.length ? plan.equipment : buildDefaultEquipment() })];

/** Lignes de la fiche Jour J (aperçu + PDF) */
export const buildCateringSheetLines = (plan: CateringPlan, isEnglish: boolean): { text: string; bold?: boolean }[] => {
  const tr = (fr: string, en: string) => (isEnglish ? en : fr);
  const lines: { text: string; bold?: boolean }[] = [];
  getCateringDays(plan).forEach((day) => {
    lines.push({ text: [day.name, day.date, day.guestCount && `${day.guestCount} ${tr('couverts', 'guests')}`].filter(Boolean).join(' · '), bold: true });
    day.vendors.filter((vendor) => vendor.name).forEach((vendor) => {
      const role = VENDOR_ROLES.find((entry) => entry.key === vendor.role);
      lines.push({ text: `${role ? (isEnglish ? role.en : role.fr) : vendor.role} : ${vendor.name}${vendor.contact ? ` (${vendor.contact})` : ''}` });
    });
    const { arrival, setup, service, teardown, notes } = day.logistics;
    const timing = [arrival && `${tr('Arrivée', 'Arrival')} ${arrival}`, setup && `${tr('Installation', 'Set-up')} ${setup}`, service && `${tr('Service', 'Service')} ${service}`, teardown && `${tr('Débarras', 'Clear-up')} ${teardown}`].filter(Boolean).join(' · ');
    if (timing) lines.push({ text: timing });
    if (notes) lines.push({ text: notes });
    MENU_FIELDS.forEach((field) => { if (day.menu[field.key]) lines.push({ text: `${isEnglish ? field.en : field.fr} : ${day.menu[field.key]}` }); });
    const equipmentLines = day.equipment.filter((row) => row.source || row.notes);
    equipmentLines.forEach((row) => {
      const source = SOURCES.find((entry) => entry.key === row.source);
      lines.push({ text: `${row.label}${source ? ` — ${isEnglish ? source.en : source.fr}` : ''}${row.notes ? ` (${row.notes})` : ''}` });
    });
    day.customItems.filter((item) => item.label).forEach((item) => lines.push({ text: `• ${item.label}${item.detail ? ` : ${item.detail}` : ''}` }));
  });
  return lines;
};
