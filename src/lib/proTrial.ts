// Essai Pro gratuit : 60 jours à partir de la date d'inscription (profiles.created_at)
export const PRO_TRIAL_DAYS = 60;

export const getProTrialEndDate = (signupDate: string | Date): Date =>
  new Date(new Date(signupDate).getTime() + PRO_TRIAL_DAYS * 86400000);

export const getProTrialDaysLeft = (signupDate: string | Date, now: Date = new Date()): number =>
  Math.ceil((getProTrialEndDate(signupDate).getTime() - now.getTime()) / 86400000);

export const isProTrialExpired = (signupDate: string | Date, now: Date = new Date()): boolean =>
  getProTrialDaysLeft(signupDate, now) <= 0;
