import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = "" }) => {
  const location = useLocation();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;
    
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Accueil', href: '/' }];
    
    const pathMap: Record<string, string> = {
      'blog': 'Blog',
      'prestataires': 'Prestataires',
      'selection': 'Sélection',
      'dashboard': 'Tableau de bord',
      'budget': 'Budget',
      'checklist': 'Checklist',
      'planning': 'Planning',
      'coordination': 'Coordination',
      'mariage-provence': 'Mariage en Provence',
      'mariage-paris': 'Mariage à Paris',
      'mariage-auvergne-rhone-alpes': 'Mariage Auvergne-Rhône-Alpes',
      'mariage-nouvelle-aquitaine': 'Mariage Nouvelle-Aquitaine',
      'coordinateurs-mariage': 'Coordinateurs de Mariage',
      'jeunes-maries': 'Jeunes Mariés',
      'contact': 'Contact',
      'faq': 'Questions Fréquentes',
      'about': 'À propos',
      'cgv': 'Conditions Générales',
      'mentions-legales': 'Mentions Légales'
    };
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      breadcrumbs.push({
        label: pathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: isLast ? undefined : currentPath
      });
    });
    
    return breadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();

  return (
    <nav aria-label="Fil d'Ariane" className={`flex items-center space-x-1 text-sm text-muted-foreground ${className}`}>
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          {item.href ? (
            <Link 
              to={item.href} 
              className="hover:text-foreground transition-colors flex items-center"
              aria-current={index === breadcrumbItems.length - 1 ? 'page' : undefined}
            >
              {index === 0 && <Home className="h-4 w-4 mr-1" />}
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium flex items-center">
              {index === 0 && <Home className="h-4 w-4 mr-1" />}
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;