import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Heart, Search, BookOpen } from 'lucide-react';

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, match: (p: string) => p === '/dashboard' || (p.startsWith('/dashboard') && !p.includes('/guides')) },
  { to: '/mon-jour-m/planning', label: 'Jour-J', icon: Heart, match: (p: string) => p.startsWith('/mon-jour-m') },
  { to: '/prestataires', label: 'Prestataires', icon: Search, match: (p: string) => p.startsWith('/prestataires') || p.startsWith('/selection') },
  { to: '/guides', label: 'Guides', icon: BookOpen, match: (p: string) => p.startsWith('/guides') || p.startsWith('/mes-guides') || p.includes('/guides') },
];

// Routes où on masque la nav (pages publiques marketing/landing, admin, embeds)
const HIDDEN_PATTERNS = [
  /^\/$/,
  /^\/accueil/,
  /^\/mariable/,
  /^\/landing/,
  /^\/admin/,
  /^\/auth/,
  /^\/login/,
  /^\/register/,
  /^\/paiement/,
  /^\/proposition/,
  /^\/reservation-jour-m/,
  /^\/jour-m-vue/,
  /^\/wedding\//,
  /^\/site\//,
  /^\/mariage\//,
  /^\/blog/,
  /^\/preview/,
  /-embed/i,
  /^\/oauth/,
  /^\/.lovable/,
];

export default function MobileBottomNav() {
  const { pathname } = useLocation();

  if (HIDDEN_PATTERNS.some((r) => r.test(pathname))) return null;

  return (
    <nav
      role="navigation"
      aria-label="Navigation principale mobile"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-wedding-olive/20"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid grid-cols-4">
        {items.map(({ to, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={to}>
              <NavLink
                to={to}
                className={`flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] uppercase tracking-wider transition-colors ${
                  active ? 'text-wedding-olive font-semibold' : 'text-muted-foreground'
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.6} />
                <span>{label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
