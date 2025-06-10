import { HomeIcon, UserIcon, SettingsIcon } from "lucide-react";
import Index from "./pages/Index";
import About from "./pages/about/Histoire";
import AdminPrestataires from "./pages/admin/Prestataires";
import AdminAccessPage from "./pages/admin/AdminAccess";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Accueil",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Admin Access",
    to: "/admin/access",
    page: <AdminAccessPage />,
  },
  {
    title: "Admin Prestataires", 
    to: "/admin/prestataires",
    page: <AdminPrestataires />,
  },
  // {
  //   title: "À propos",
  //   to: "/about",
  //   icon: <UserIcon className="h-4 w-4",
  //   page: <About />,
  //   children: [
  //     {
  //       title: "Notre histoire",
  //       to: "/about/histoire",
  //       page: <About />,
  //     },
  //     {
  //       title: "Notre approche",
  //       to: "/about/approche",
  //       page: <About />,
  //     },
  //     {
  //       title: "Témoignages",
  //       to: "/about/temoignages",
  //       page: <div>Temoignages</div>,
  //     },
  //   ],
  // },
  {
    title: "Paramètres",
    to: "/settings",
    icon: <SettingsIcon className="h-4 w-4" />,
    page: <div>Settings</div>,
  },
];
