
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import { Menu } from 'lucide-react';
import DashboardModal from './DashboardModal';
import TasksList from './TasksList';
import GuestManagement from './GuestManagement';
import VendorTracking from './VendorTracking';
import UserProfile from './UserProfile';
import DrinksCalculator from '@/components/drinks/DrinksCalculator';
import DetailedBudget from './DetailedBudget';
import ProjectSummary from './ProjectSummary';

const DashboardLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const [sidebarVisible, setSidebarVisible] = useState(!isMobile);
  const location = useLocation();
  
  // État pour contrôler l'affichage des modales
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Fonction pour ouvrir une modale spécifique
  const openModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  // Fonction pour fermer la modale active
  const closeModal = () => {
    setActiveModal(null);
  };

  // Contenu correspondant à chaque modale
  const getModalContent = (modal: string) => {
    switch (modal) {
      case 'tasks':
        return <TasksList />;
      case 'budget':
        return <DetailedBudget />;
      case 'prestataires':
        return <VendorTracking />;
      case 'settings':
        return <UserProfile />;
      case 'drinks':
        return <DrinksCalculator />;
      default:
        return <div>Contenu non disponible</div>;
    }
  };

  // Titre correspondant à chaque modale
  const getModalTitle = (modal: string) => {
    switch (modal) {
      case 'tasks':
        return 'Mes Tâches';
      case 'budget':
        return 'Mon Budget';
      case 'prestataires':
        return 'Mes Prestataires';
      case 'settings':
        return 'Paramètres';
      case 'drinks':
        return 'Calculatrice de Boissons';
      default:
        return 'Mariable';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex flex-1 relative">
        {/* Mobile toggle button */}
        {isMobile && (
          <button 
            onClick={toggleSidebar} 
            className="fixed z-50 bottom-5 right-5 p-3 rounded-full bg-wedding-olive text-white shadow-lg"
            aria-label={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
          >
            <Menu size={24} />
          </button>
        )}
        
        {/* Sidebar - conditionally visible */}
        <div 
          className={`${isMobile ? 'fixed z-40 h-full overflow-y-auto transition-transform duration-300 transform' : 'w-64 flex-shrink-0'} 
                    ${(isMobile && !sidebarVisible) ? '-translate-x-full' : 'translate-x-0'}`}
          style={{ width: isMobile ? '240px' : 'auto' }}
        >
          <DashboardSidebar onMenuItemClick={openModal} />
        </div>

        {/* Main content area - adjusted margin for mobile */}
        <div className="flex-1 overflow-auto pt-6 transition-all duration-300" 
             style={{ marginLeft: (!isMobile && sidebarVisible) ? '16rem' : '0' }}>
          <main className="container mx-auto py-6 px-4 lg:px-8">
            {location.pathname === '/dashboard' || location.pathname === '/dashboard/' ? (
              <ProjectSummary />
            ) : (
              <Outlet />
            )}
          </main>
        </div>
        
        {/* Overlay to close sidebar on mobile */}
        {isMobile && sidebarVisible && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarVisible(false)}
          />
        )}
      </div>

      {/* Modales pour chaque section du dashboard */}
      {activeModal && (
        <DashboardModal 
          title={getModalTitle(activeModal)}
          open={!!activeModal}
          onOpenChange={(open) => !open && closeModal()}
        >
          {getModalContent(activeModal)}
        </DashboardModal>
      )}
    </div>
  );
};

export default DashboardLayout;
