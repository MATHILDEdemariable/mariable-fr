import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const navigation = vi.hoisted(() => ({
  location: { pathname: '/pro/abonnement', search: '', hash: '' },
  captured: null as null | { to: string; state: { redirectAfterLogin: string }; replace: boolean },
}));

vi.mock('@/contexts/AuthContext', () => ({ useAuth: () => ({ user: null, loading: false }) }));
vi.mock('@/contexts/WeddingContext', () => ({ useWedding: () => ({ accountType: 'b2b', currentWeddingId: null, loading: false }) }));
vi.mock('react-router-dom', () => ({
  useLocation: () => navigation.location,
  Navigate: (props: NonNullable<typeof navigation.captured>) => {
    navigation.captured = props;
    return null;
  },
}));

import ProtectedRoute from './ProtectedRoute';

describe('Subscription link after sign-in', () => {
  it.each(['organisation-year', 'organisation-month', 'jour-j-year', 'jour-j-month'])(
    'preserves the %s choice in the login URL and state', (checkoutChoice) => {
      navigation.location.search = `?checkout=${checkoutChoice}`;
      navigation.location.hash = '#tarifs';
      renderToStaticMarkup(<ProtectedRoute><div /></ProtectedRoute>);
      const destination = `/pro/abonnement?checkout=${checkoutChoice}#tarifs`;
      expect(navigation.captured?.state.redirectAfterLogin).toBe(destination);
      expect(new URL(navigation.captured?.to ?? '', 'http://localhost').searchParams.get('next')).toBe(destination);
      expect(navigation.captured?.replace).toBe(true);
    },
  );
});