import { describe, it, expect } from 'vitest';
import { buildDepositReminderMessage } from '../DepositReminderDialog';

describe('buildDepositReminderMessage', () => {
  it('builds the French pre-written reminder', () => {
    expect(buildDepositReminderMessage(false, 0, 'Privatisation du château', 3500, '2026-10-26'))
      .toBe("Bonjour, petit rappel concernant le mariage : l'acompte n°1 pour Privatisation du château (3\u202f500 €) arrive à échéance le 26/10/2026. Merci de nous confirmer dès que le virement est effectué !");
  });
});
