import { describe, expect, it } from 'vitest';
import { buildProSupportWhatsAppUrl } from './proSupportContact';

describe('contact WhatsApp de Mathilde', () => {
  it('ouvre le numéro 07 60 10 81 89 au format international', () => {
    const url = new URL(buildProSupportWhatsAppUrl('Bonjour Mathilde, problème urgent'));
    expect(url.origin + url.pathname).toBe('https://wa.me/33760108189');
    expect(url.searchParams.get('text')).toBe('Bonjour Mathilde, problème urgent');
  });
});