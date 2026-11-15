import { describe, expect, it, mock } from 'bun:test';

const sentEvents: Array<{ name: string; parameters: Record<string, unknown> }> = [];
mock.module('@/lib/consentedTracking', () => ({
  sendConsentedMetaEvent: async (name: string, parameters: Record<string, unknown>) => {
    sentEvents.push({ name, parameters });
  },
}));

const { trackMetaRegistration } = await import('./analytics');

describe('trackMetaRegistration', () => {
  it('labels a Pro sign-up as "Mariable Pro" for the Essai Pro campaign', () => {
    sentEvents.length = 0;
    trackMetaRegistration('b2b');
    expect(sentEvents[0]).toEqual({ name: 'CompleteRegistration', parameters: { content_name: 'Mariable Pro', status: 'completed' } });
  });

  it('labels a couple sign-up as "Mariable Couple"', () => {
    sentEvents.length = 0;
    trackMetaRegistration('b2c');
    expect(sentEvents[0].parameters.content_name).toBe('Mariable Couple');
  });
});
