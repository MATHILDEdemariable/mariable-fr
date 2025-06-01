
// Utility to convert between different form data formats
export interface PlanningFormValues {
  trajet_depart_ceremonie?: number;
  trajet_retour_ceremonie?: number;
  [key: string]: string | number | undefined;
}

export interface PlanningFormData {
  trajet_depart_ceremonie?: string;
  trajet_retour_ceremonie?: string;
  [key: string]: string | undefined;
}

export const convertFormValuesToFormData = (values: PlanningFormValues): PlanningFormData => {
  const converted: PlanningFormData = {};
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined) {
      converted[key] = typeof value === 'number' ? value.toString() : value;
    }
  });
  return converted;
};

export const convertFormDataToFormValues = (data: PlanningFormData): PlanningFormValues => {
  const converted: PlanningFormValues = {};
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      if (key === 'trajet_depart_ceremonie' || key === 'trajet_retour_ceremonie') {
        converted[key] = parseInt(value) || 0;
      } else {
        converted[key] = value;
      }
    }
  });
  return converted;
};
