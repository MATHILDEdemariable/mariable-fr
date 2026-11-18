import { describe, it, expect } from 'vitest';
import { getPremiumAccess } from './proAccess';

const NOW = new Date('2026-11-18T00:00:00Z');
const dayMs = 86400000;
const daysAgo = (days: number) => new Date(NOW.getTime() - days * dayMs).toISOString();

describe('accès Premium depuis le profil', () => {
  it('compte pro en essai de 30 jours (cas Solène) : accès Premium accordé', () => {
    const access = getPremiumAccess(
      { account_type: 'b2b', subscription_type: 'free', subscription_expires_at: null, created_at: daysAgo(1) },
      NOW,
    );
    expect(access.isProTrialActive).toBe(true);
    expect(access.isPremium).toBe(true);
  });

  it('compte pro dont l\'essai est terminé depuis 10 jours : accès refusé', () => {
    const access = getPremiumAccess(
      { account_type: 'b2b', subscription_type: 'free', subscription_expires_at: null, created_at: daysAgo(40) },
      NOW,
    );
    expect(access.isProTrialActive).toBe(false);
    expect(access.isPremium).toBe(false);
  });

  it('compte pro à J+29 : accès encore accordé', () => {
    const access = getPremiumAccess(
      { account_type: 'b2b', subscription_type: 'free', subscription_expires_at: null, created_at: daysAgo(29) },
      NOW,
    );
    expect(access.isPremium).toBe(true);
  });

  it('compte pro à J+30 pile : essai terminé, accès refusé', () => {
    const access = getPremiumAccess(
      { account_type: 'b2b', subscription_type: 'free', subscription_expires_at: null, created_at: daysAgo(30) },
      NOW,
    );
    expect(access.isPremium).toBe(false);
  });

  it('compte couple Premium actif : accès accordé', () => {
    const access = getPremiumAccess(
      { account_type: 'b2c', subscription_type: 'premium', subscription_expires_at: null, created_at: daysAgo(400) },
      NOW,
    );
    expect(access.isPremium).toBe(true);
  });

  it('compte couple gratuit : accès refusé', () => {
    const access = getPremiumAccess(
      { account_type: 'b2c', subscription_type: 'free', subscription_expires_at: null, created_at: daysAgo(10) },
      NOW,
    );
    expect(access.isPremium).toBe(false);
  });

  it('abonné pro_premium : accès accordé, hors essai', () => {
    const access = getPremiumAccess(
      { account_type: 'b2b', subscription_type: 'pro_premium', subscription_expires_at: null, created_at: daysAgo(200) },
      NOW,
    );
    expect(access.isProPremium).toBe(true);
    expect(access.isProTrialActive).toBe(false);
    expect(access.isPremium).toBe(true);
  });

  it('abonné pro_jour_j dont l\'abonnement a expiré et l\'essai aussi : accès refusé', () => {
    const access = getPremiumAccess(
      {
        account_type: 'b2b',
        subscription_type: 'pro_jour_j',
        subscription_expires_at: daysAgo(5),
        created_at: daysAgo(120),
      },
      NOW,
    );
    expect(access.isProJourJ).toBe(false);
    expect(access.isPremium).toBe(false);
  });

  it('profil absent : aucun accès', () => {
    expect(getPremiumAccess(null, NOW).isPremium).toBe(false);
    expect(getPremiumAccess(undefined, NOW).isPremium).toBe(false);
  });
});
