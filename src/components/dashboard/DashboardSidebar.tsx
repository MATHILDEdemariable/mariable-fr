import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, CheckSquare, Calculator, Store, Heart, Settings, LogOut, Wine, MessageCircleQuestion, MessageSquare, Users, Lightbulb, ChevronDown, Coins, ListChecks, UserCheck, Home, QrCode, FileText, Table, AlertCircle, Gift, Sparkles, ShoppingCart, Building2, Smartphone, Palette, Globe } from 'lucide-react';
import { CallScheduleModal } from './CallScheduleModal';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { WhatsAppButton } from '@/components/support/WhatsAppButton';
import { ProblemModal } from '@/components/support/ProblemModal';
import ClubMariableModal from './ClubMariableModal';
import SiteInternetModal from './SiteInternetModal';
interface DashboardSidebarProps {
  isReaderMode?: boolean;
}
const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isReaderMode = false
}) => {
  const location = useLocation();
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showClubMariableModal, setShowClubMariableModal] = useState(false);
  const [showSiteInternetModal, setShowSiteInternetModal] = useState(false);

  // Menu déroulant Tableau de bord
  const dashboardItems = [{
    label: 'Tableau de bord',
    icon: <LayoutDashboard className="h-4 w-4" />,
    path: '/dashboard'
  }, {
    label: 'Mon Mariage',
    icon: <Heart className="h-4 w-4" />,
    path: '/dashboard/mon-mariage'
  }];

  // Menu déroulant Check-list
  const checklistItems = [{
    label: 'En 10 étapes',
    icon: <CheckSquare className="h-4 w-4" />,
    path: '/dashboard/checklist-mariage?tab=etapes'
  }, {
    label: 'Check-list manuelle',
    icon: <ListChecks className="h-4 w-4" />,
    path: '/dashboard/checklist-mariage?tab=manuelle'
  }, {
    label: 'Check-list intelligente',
    icon: <Lightbulb className="h-4 w-4" />,
    path: '/dashboard/checklist-mariage?tab=intelligente'
  }];

  // Menu déroulant Calculatrice
  const calculatriceItems = [{
    label: 'Calculatrice Budget',
    icon: <Coins className="h-4 w-4" />,
    path: '/dashboard/budget'
  }, {
    label: 'Calculatrice Boisson',
    icon: <Wine className="h-4 w-4" />,
    path: '/dashboard/drinks'
  }];

  // Menu déroulant Prestataires
  const prestatairesItems = [{
    label: 'Tous les prestataires',
    icon: <Store className="h-4 w-4" />,
    path: '/professionnelsmariable'
  }, {
    label: 'Mon panier',
    icon: <ShoppingCart className="h-4 w-4" />,
    path: '/dashboard/panier'
  }, {
    label: 'Suivi',
    icon: <Settings className="h-4 w-4" />,
    path: '/dashboard/suivi'
  }, {
    label: 'Mes messages',
    icon: <MessageSquare className="h-4 w-4" />,
    path: '/dashboard/messages'
  }];

  // Menu déroulant Jour-J (seulement Jour-J et Coordinateurs)
  const jourMItems = [{
    label: 'Planning Jour-J',
    icon: <Calendar className="h-4 w-4" />,
    path: '/mon-jour-m'
  }, {
    label: 'Coordinateurs',
    icon: <Users className="h-4 w-4" />,
    path: '/dashboard/coordinateurs'
  }];

  // Menu déroulant Bonus
  const bonusItems = [{
    label: 'Moodboard',
    icon: <Palette className="h-4 w-4" />,
    path: '/dashboard/moodboard',
    external: false
  }, {
    label: 'ChatGPT Mariage',
    icon: <MessageSquare className="h-4 w-4" />,
    path: 'https://chatgpt.com/g/g-684071f00100819199b7b11839db48d4-assistant-mariage-by-mariable',
    external: true
  }, {
    label: 'Assistant Virtuel',
    icon: <MessageCircleQuestion className="h-4 w-4" />,
    path: '/dashboard/assistant',
    external: false
  }];
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // Redirection vers la page d'accueil après déconnexion
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // En cas d'erreur, rediriger quand même vers l'accueil
      window.location.href = '/';
    }
  };
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    if (path === '/mon-jour-m') {
      return location.pathname.startsWith('/mon-jour-m');
    }
    return location.pathname.startsWith(path);
  };

  // Vérifier si le menu Tableau de bord doit être actif
  const isDashboardActive = () => {
    return dashboardItems.some(item => isActive(item.path));
  };

  // Vérifier si le menu Check-list doit être actif
  const isChecklistActive = () => {
    return location.pathname.startsWith('/dashboard/checklist-mariage');
  };

  // Vérifier si le menu Calculatrice doit être actif
  const isCalculatriceActive = () => {
    return calculatriceItems.some(item => isActive(item.path));
  };

  // Vérifier si le menu Prestataires doit être actif
  const isPrestatairesActive = () => {
    return prestatairesItems.some(item => isActive(item.path));
  };

  // Vérifier si le menu Jour-J doit être actif
  const isJourMActive = () => {
    return jourMItems.some(item => isActive(item.path));
  };

  // Vérifier si Avant le jour-J est actif
  const isAvantJourJActive = () => {
    return isActive('/dashboard/avant-jour-j');
  };

  // Vérifier si Après le jour-J est actif
  const isApresJourJActive = () => {
    return isActive('/dashboard/apres-jour-j');
  };

  // Vérifier si RSVP Invités est actif
  const isRSVPActive = () => {
    return isActive('/dashboard/rsvp');
  };

  // Vérifier si Gestion des logements est actif
  const isAccommodationsActive = () => {
    return isActive('/dashboard/accommodations');
  };

  // Vérifier si Plan de table est actif
  const isSeatingPlanActive = () => {
    return isActive('/dashboard/seating-plan');
  };

  // Vérifier si QR Code est actif
  const isQRCodeActive = () => {
    return isActive('/dashboard/qr-code');
  };

  // Vérifier si le menu Bonus doit être actif
  const isBonusActive = () => {
    return bonusItems.some(item => !item.external && isActive(item.path));
  };
  return <div className="h-full min-h-screen bg-white border-r border-gray-200" style={{
    paddingTop: 'var(--header-h)'
  }}>
      <div className="flex items-center px-4 sm:px-6 py-3 sm:py-4">
        <span className="font-bold text-lg sm:text-xl">Mon espace</span>
      </div>
      
      <nav className="py-2 sm:py-4 px-2 sm:px-3 space-y-1">
        {/* Menu déroulant Tableau de bord */}
        <DropdownMenu>
          <DropdownMenuTrigger className={cn("flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors w-full justify-start", isDashboardActive() ? 'bg-wedding-olive text-white shadow-sm' : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive', isReaderMode ? 'pointer-events-none opacity-70' : '')} disabled={isReaderMode}>
            <LayoutDashboard className="h-4 w-4" />
            <span className="ml-2 sm:ml-3 leading-tight">Tableau de bord</span>
            <ChevronDown className="ml-auto h-4 w-4" />
            {isReaderMode && <span className="ml-auto text-xs text-gray-400 hidden sm:inline">(Lecture seule)</span>}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white shadow-lg border border-gray-200" align="end">
            {dashboardItems.map(subItem => <DropdownMenuItem key={subItem.path} asChild>
                <Link to={isReaderMode ? '#' : subItem.path} onClick={e => {
              if (isReaderMode) {
                e.preventDefault();
              }
            }} className={cn("flex items-center px-2 py-2 text-sm w-full", isActive(subItem.path) ? 'bg-wedding-olive/10 text-wedding-olive font-medium' : 'text-gray-600 hover:bg-gray-50')}>
                  {subItem.icon}
                  <span className="ml-2">{subItem.label}</span>
                </Link>
              </DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Menu déroulant Check-list */}
        <DropdownMenu>
          <DropdownMenuTrigger className={cn("flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors w-full justify-start", isChecklistActive() ? 'bg-wedding-olive text-white shadow-sm' : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive', isReaderMode ? 'pointer-events-none opacity-70' : '')} disabled={isReaderMode}>
            <CheckSquare className="h-4 w-4" />
            <span className="ml-2 sm:ml-3 leading-tight">Check-list</span>
            <ChevronDown className="ml-auto h-4 w-4" />
            {isReaderMode && <span className="ml-auto text-xs text-gray-400 hidden sm:inline">(Lecture seule)</span>}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white shadow-lg border border-gray-200" align="end">
            {checklistItems.map(subItem => <DropdownMenuItem key={subItem.path} asChild>
                <Link to={isReaderMode ? '#' : subItem.path} onClick={e => {
              if (isReaderMode) {
                e.preventDefault();
              }
            }} className={cn("flex items-center px-2 py-2 text-sm w-full", location.pathname.startsWith('/dashboard/checklist-mariage') && (subItem.path.includes('tab=etapes') && (!location.search || location.search.includes('tab=etapes')) || subItem.path.includes('tab=manuelle') && location.search.includes('tab=manuelle') || subItem.path.includes('tab=intelligente') && location.search.includes('tab=intelligente')) ? 'bg-wedding-olive/10 text-wedding-olive font-medium' : 'text-gray-600 hover:bg-gray-50')}>
                  {subItem.icon}
                  <span className="ml-2">{subItem.label}</span>
                </Link>
              </DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Retroplanning - lien standalone */}
        <Link to={isReaderMode ? '#' : '/dashboard/mon-mariage/retroplanning'} onClick={e => {
        if (isReaderMode) {
          e.preventDefault();
        }
      }} className={cn("flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors", isActive('/dashboard/mon-mariage/retroplanning') ? 'bg-wedding-olive text-white shadow-sm' : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive', isReaderMode ? 'pointer-events-none opacity-70' : '')}>
          <Calendar className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">Retroplanning</span>
          {isReaderMode && <span className="ml-auto text-xs text-gray-400 hidden sm:inline">(Lecture seule)</span>}
        </Link>

        {/* Menu déroulant Calculatrice */}
        <DropdownMenu>
          <DropdownMenuTrigger className={cn("flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors w-full justify-start", isCalculatriceActive() ? 'bg-wedding-olive text-white shadow-sm' : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive', isReaderMode ? 'pointer-events-none opacity-70' : '')} disabled={isReaderMode}>
            <Calculator className="h-4 w-4" />
            <span className="ml-2 sm:ml-3 leading-tight">Budget</span>
            <ChevronDown className="ml-auto h-4 w-4" />
            {isReaderMode && <span className="ml-auto text-xs text-gray-400 hidden sm:inline">(Lecture seule)</span>}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white shadow-lg border border-gray-200" align="end">
            {calculatriceItems.map(subItem => <DropdownMenuItem key={subItem.path} asChild>
                <Link to={isReaderMode ? '#' : subItem.path} onClick={e => {
              if (isReaderMode) {
                e.preventDefault();
              }
            }} className={cn("flex items-center px-2 py-2 text-sm w-full", isActive(subItem.path) ? 'bg-wedding-olive/10 text-wedding-olive font-medium' : 'text-gray-600 hover:bg-gray-50')}>
                  {subItem.icon}
                  <span className="ml-2">{subItem.label}</span>
                </Link>
              </DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Menu déroulant Prestataires */}
        <DropdownMenu>
          <DropdownMenuTrigger className={cn("flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors w-full justify-start", isPrestatairesActive() ? 'bg-wedding-olive text-white shadow-sm' : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive', isReaderMode ? 'pointer-events-none opacity-70' : '')} disabled={isReaderMode}>
            <Store className="h-4 w-4" />
            <span className="ml-2 sm:ml-3 leading-tight">Prestataires</span>
            <ChevronDown className="ml-auto h-4 w-4" />
            {isReaderMode && <span className="ml-auto text-xs text-gray-400 hidden sm:inline">(Lecture seule)</span>}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white shadow-lg border border-gray-200" align="end">
            {prestatairesItems.map(subItem => <DropdownMenuItem key={subItem.path} asChild>
                <Link to={isReaderMode ? '#' : subItem.path} onClick={e => {
              if (isReaderMode) {
                e.preventDefault();
              }
            }} className={cn("flex items-center px-2 py-2 text-sm w-full", isActive(subItem.path) ? 'bg-wedding-olive/10 text-wedding-olive font-medium' : 'text-gray-600 hover:bg-gray-50')}>
                  {subItem.icon}
                  <span className="ml-2">{subItem.label}</span>
                </Link>
              </DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>


        {/* Menu déroulant Jour-J */}
        <DropdownMenu>
          <DropdownMenuTrigger className={cn("flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors w-full justify-start", isJourMActive() ? 'bg-wedding-olive text-white shadow-sm' : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive', isReaderMode ? 'pointer-events-none opacity-70' : '')} disabled={isReaderMode}>
            <Calendar className="h-4 w-4" />
            <span className="ml-2 sm:ml-3 leading-tight">Planning Jour-J</span>
            <span className="ml-2 px-1.5 py-0.5 text-xs bg-wedding-olive text-white rounded-full font-semibold">Exclusif</span>
            <ChevronDown className="ml-auto h-4 w-4" />
            {isReaderMode && <span className="ml-auto text-xs text-gray-400 hidden sm:inline">(Lecture seule)</span>}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white shadow-lg border border-gray-200" align="end">
            {jourMItems.map(subItem => <DropdownMenuItem key={subItem.path} asChild>
                <Link to={isReaderMode ? '#' : subItem.path} onClick={e => {
              if (isReaderMode) {
                e.preventDefault();
              }
            }} className={cn("flex items-center px-2 py-2 text-sm w-full", isActive(subItem.path) ? 'bg-wedding-olive/10 text-wedding-olive font-medium' : 'text-gray-600 hover:bg-gray-50')}>
                  {subItem.icon}
                  <span className="ml-2">{subItem.label}</span>
                </Link>
              </DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* RSVP Invités */}
        <Link to={isReaderMode ? '#' : '/dashboard/rsvp'} onClick={e => {
        if (isReaderMode) {
          e.preventDefault();
        }
      }} className={cn("flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors", isRSVPActive() ? 'bg-wedding-olive text-white shadow-sm' : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive', isReaderMode ? 'pointer-events-none opacity-70' : '')}>
          <UserCheck className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight flex items-center gap-1.5">
            RSVP Invités
            
          </span>
          {isReaderMode && <span className="ml-auto text-xs text-gray-400 hidden sm:inline">(Lecture seule)</span>}
        </Link>

        {/* Gestion des logements */}
        <Link to={isReaderMode ? '#' : '/dashboard/accommodations'} onClick={e => {
        if (isReaderMode) {
          e.preventDefault();
        }
      }} className={cn("flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors", isAccommodationsActive() ? 'bg-wedding-olive text-white shadow-sm' : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive', isReaderMode ? 'pointer-events-none opacity-70' : '')}>
          <Home className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight flex items-center gap-1.5">
            Gestion des logements
            
          </span>
          {isReaderMode && <span className="ml-auto text-xs text-gray-400 hidden sm:inline">(Lecture seule)</span>}
        </Link>

        {/* Plan de table */}
        <Link to={isReaderMode ? '#' : '/dashboard/seating-plan'} onClick={e => {
        if (isReaderMode) {
          e.preventDefault();
        }
      }} className={cn("flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors", isSeatingPlanActive() ? 'bg-wedding-olive text-white shadow-sm' : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive', isReaderMode ? 'pointer-events-none opacity-70' : '')}>
          <Table className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">
            Plan de table
          </span>
          {isReaderMode && <span className="ml-auto text-xs text-gray-400 hidden sm:inline">(Lecture seule)</span>}
        </Link>

        {/* Moodboard */}
        <Link to={isReaderMode ? '#' : '/dashboard/moodboard'} onClick={e => {
        if (isReaderMode) {
          e.preventDefault();
        }
      }} className={cn("flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors", isActive('/dashboard/moodboard') ? 'bg-wedding-olive text-white shadow-sm' : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive', isReaderMode ? 'pointer-events-none opacity-70' : '')}>
          <Palette className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">Moodboard</span>
          {isReaderMode && <span className="ml-auto text-xs text-gray-400 hidden sm:inline">(Lecture seule)</span>}
        </Link>

        {/* Site Internet */}
        <button
          onClick={() => !isReaderMode && setShowSiteInternetModal(true)}
          className={cn(
            "flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors w-full text-left",
            'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive',
            isReaderMode ? 'pointer-events-none opacity-70' : ''
          )}
        >
          <Globe className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">Site Internet</span>
        </button>

        {/* Cérémonie Laïque */}
        <Link to={isReaderMode ? '#' : '/dashboard/ceremonie'} onClick={e => {
        if (isReaderMode) {
          e.preventDefault();
        }
      }} className={cn("flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors", isActive('/dashboard/ceremonie') ? 'bg-wedding-olive text-white shadow-sm' : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive', isReaderMode ? 'pointer-events-none opacity-70' : '')}>
          <Heart className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">Cérémonie</span>
          {isReaderMode && <span className="ml-auto text-xs text-gray-400 hidden sm:inline">(Lecture seule)</span>}
        </Link>

        {/* Mairie - Civil */}
        <Link to={isReaderMode ? '#' : '/dashboard/mairie-civil'} onClick={e => {
        if (isReaderMode) {
          e.preventDefault();
        }
      }} className={cn("flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors", isActive('/dashboard/mairie-civil') ? 'bg-wedding-olive text-white shadow-sm' : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive', isReaderMode ? 'pointer-events-none opacity-70' : '')}>
          <Building2 className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">Mairie - Civil</span>
          {isReaderMode && <span className="ml-auto text-xs text-gray-400 hidden sm:inline">(Lecture seule)</span>}
        </Link>

        {/* Générateur QR Code */}
        <Link to={isReaderMode ? '#' : '/dashboard/qr-code'} onClick={e => {
        if (isReaderMode) {
          e.preventDefault();
        }
      }} className={cn("flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors", isQRCodeActive() ? 'bg-wedding-olive text-white shadow-sm' : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive', isReaderMode ? 'pointer-events-none opacity-70' : '')}>
          <QrCode className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">Liste de mariage
        </span>
          {isReaderMode && <span className="ml-auto text-xs text-gray-400 hidden sm:inline">(Lecture seule)</span>}
        </Link>

        {/* Documents */}
        <Link to={isReaderMode ? '#' : '/dashboard/documents'} onClick={e => {
        if (isReaderMode) {
          e.preventDefault();
        }
      }} className={cn("flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors", isActive('/dashboard/documents') ? 'bg-wedding-olive text-white shadow-sm' : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive', isReaderMode ? 'pointer-events-none opacity-70' : '')}>
          <FileText className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">Documents</span>
          {isReaderMode && <span className="ml-auto text-xs text-gray-400 hidden sm:inline">(Lecture seule)</span>}
        </Link>

        {/* Après le jour-J */}
        <Link to={isReaderMode ? '#' : '/dashboard/apres-jour-j'} onClick={e => {
        if (isReaderMode) {
          e.preventDefault();
        }
      }} className={cn("flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors", isApresJourJActive() ? 'bg-wedding-olive text-white shadow-sm' : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive', isReaderMode ? 'pointer-events-none opacity-70' : '')}>
          <CheckSquare className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">Après le jour-J</span>
          {isReaderMode && <span className="ml-auto text-xs text-gray-400 hidden sm:inline">(Lecture seule)</span>}
        </Link>

        {/* Menu déroulant Bonus */}
        <DropdownMenu>
          <DropdownMenuTrigger className={cn("flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors w-full justify-start", isBonusActive() ? 'bg-wedding-olive text-white shadow-sm' : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive', isReaderMode ? 'pointer-events-none opacity-70' : '')} disabled={isReaderMode}>
            <Gift className="h-4 w-4" />
            <span className="ml-2 sm:ml-3 leading-tight">Bonus</span>
            <ChevronDown className="ml-auto h-4 w-4" />
            {isReaderMode && <span className="ml-auto text-xs text-gray-400 hidden sm:inline">(Lecture seule)</span>}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white shadow-lg border border-gray-200" align="end">
            {bonusItems.map(subItem => <DropdownMenuItem key={subItem.path} asChild>
                {subItem.external ? <a href={isReaderMode ? '#' : subItem.path} target={isReaderMode ? undefined : "_blank"} rel={isReaderMode ? undefined : "noopener noreferrer"} onClick={e => {
              if (isReaderMode) {
                e.preventDefault();
              }
            }} className={cn("flex items-center px-2 py-2 text-sm w-full", 'text-gray-600 hover:bg-gray-50')}>
                    {subItem.icon}
                    <span className="ml-2">{subItem.label}</span>
                  </a> : <Link to={isReaderMode ? '#' : subItem.path} onClick={e => {
              if (isReaderMode) {
                e.preventDefault();
              }
            }} className={cn("flex items-center px-2 py-2 text-sm w-full", isActive(subItem.path) ? 'bg-wedding-olive/10 text-wedding-olive font-medium' : 'text-gray-600 hover:bg-gray-50')}>
                    {subItem.icon}
                    <span className="ml-2">{subItem.label}</span>
                  </Link>}
              </DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>



        {/* Guides PDF */}
        <Link to={isReaderMode ? '#' : '/dashboard/guides'} onClick={e => {
        if (isReaderMode) {
          e.preventDefault();
        }
      }} className={cn("flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors", isActive('/dashboard/guides') ? 'bg-wedding-olive text-white shadow-sm' : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive', isReaderMode ? 'pointer-events-none opacity-70' : '')}>
          <FileText className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">Guides PDF</span>
          {isReaderMode && <span className="ml-auto text-xs text-gray-400 hidden sm:inline">(Lecture seule)</span>}
        </Link>


        {/* Paramètres */}
        <Link to={isReaderMode ? '#' : '/dashboard/settings'} onClick={e => {
        if (isReaderMode) {
          e.preventDefault();
        }
      }} className={cn("flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors", isActive('/dashboard/settings') ? 'bg-wedding-olive text-white shadow-sm' : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive', isReaderMode ? 'pointer-events-none opacity-70' : '')}>
          <Settings className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">Paramètres</span>
          {isReaderMode && <span className="ml-auto text-xs text-gray-400 hidden sm:inline">(Lecture seule)</span>}
        </Link>

        {/* Installer l'app */}
        <Link to="/dashboard/installer-app" className={cn("flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors", isActive('/dashboard/installer-app') ? 'bg-wedding-olive text-white shadow-sm' : 'text-gray-600 hover:bg-wedding-olive/10 hover:text-wedding-olive')}>
          <Smartphone className="h-4 w-4" />
          <span className="ml-2 sm:ml-3 leading-tight">Installer l'app</span>
        </Link>

      </nav>
      
      {/* Support */}
      <div className="mt-auto px-2 sm:px-3 py-2">
        
        
        {/* Votre cadeau - Cal.com */}
        
        
        {/* Un problème ? */}
        <button onClick={() => setShowProblemModal(true)} className="flex items-center w-full px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors text-gray-600 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-200 mt-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="ml-2 sm:ml-3 leading-tight">Un problème ?</span>
        </button>
      </div>
      
      <div className="px-2 sm:px-3 py-2">
        <button onClick={handleLogout} className="flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 w-full justify-start" disabled={isReaderMode}>
          <LogOut className="h-4 w-4" />
          <span className="ml-2 sm:ml-3">Déconnexion</span>
        </button>
      </div>
      
      {isReaderMode && <div className="px-2 sm:px-3 py-4 mt-auto border-t border-gray-200">
          <div className="bg-wedding-olive/10 p-3 rounded-md text-xs text-gray-700">
            Vous êtes en mode lecture seule. Les modifications ne sont pas possibles dans ce mode.
          </div>
        </div>}
      
      {/* Modal Un problème ? */}
      <ProblemModal isOpen={showProblemModal} onClose={() => setShowProblemModal(false)} />
      
      {/* Modal Votre cadeau */}
      <CallScheduleModal isOpen={showCallModal} onClose={() => setShowCallModal(false)} />
      
      {/* Modal Club Mariable */}
      <ClubMariableModal isOpen={showClubMariableModal} onClose={() => setShowClubMariableModal(false)} />
      
      {/* Modal Site Internet */}
      <SiteInternetModal open={showSiteInternetModal} onOpenChange={setShowSiteInternetModal} />
    </div>;
};
export default DashboardSidebar;