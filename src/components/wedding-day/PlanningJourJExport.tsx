
import React from 'react';
import { PlanningEvent } from './types/planningTypes';
import { Logo } from '@/components/Logo';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface PlanningJourJExportProps {
  events: PlanningEvent[];
  weddingDate?: string;
  coupleNames?: string;
}

const PlanningJourJExport: React.FC<PlanningJourJExportProps> = ({
  events,
  weddingDate,
  coupleNames = "Votre mariage"
}) => {
  // Group events by category for better organization
  const groupedEvents = events.reduce((acc, event) => {
    const category = event.category || 'Autres';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(event);
    return acc;
  }, {} as Record<string, PlanningEvent[]>);

  // Category styling
  const getCategoryStyle = (category: string) => {
    switch (category.toLowerCase()) {
      case 'préparatifs':
      case 'préparatifs_final':
        return { color: '#8B5CF6', bg: '#F3E8FF' };
      case 'cérémonie':
        return { color: '#7F9474', bg: '#F1F7F3' };
      case 'cocktail':
      case 'photos':
        return { color: '#d4af37', bg: '#FEF3C7' };
      case 'repas':
      case 'soiree':
        return { color: '#1a5d40', bg: '#ECFDF5' };
      default:
        return { color: '#6B7280', bg: '#F9FAFB' };
    }
  };

  const formatTime = (date: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="export-container bg-white font-sans" style={{ 
      fontFamily: 'Raleway, sans-serif',
      maxWidth: '210mm',
      minHeight: '297mm',
      margin: '0 auto',
      padding: '15mm',
      color: '#000000',
      lineHeight: '1.4'
    }}>
      {/* Header with Logo */}
      <div className="text-center mb-6 pb-4" style={{ borderBottom: '2px solid #7F9474' }}>
        <div className="flex justify-center mb-3">
          <Logo />
        </div>
        <h1 className="font-serif text-xl font-bold mb-1" style={{ 
          fontFamily: 'Playfair Display, serif',
          color: '#7F9474',
          fontSize: '24px',
          marginBottom: '8px'
        }}>
          Planning Jour J
        </h1>
        <p className="text-sm" style={{ color: '#666666', fontSize: '14px' }}>
          {coupleNames}
        </p>
        {weddingDate && (
          <p className="text-sm" style={{ color: '#666666', fontSize: '12px' }}>
            {weddingDate}
          </p>
        )}
      </div>

      {/* Wedding Details - Compact */}
      <div className="mb-5">
        <h2 className="font-serif font-semibold mb-3 pb-1" style={{ 
          fontFamily: 'Playfair Display, serif',
          fontSize: '16px',
          color: '#1a5d40',
          borderBottom: '1px solid #f1f7f3'
        }}>
          Informations du mariage
        </h2>
        
        <div className="grid grid-cols-3 gap-3" style={{ fontSize: '12px' }}>
          <div className="p-2 rounded text-center" style={{ backgroundColor: '#f8f6f0', border: '1px solid #e8e5db' }}>
            <div className="flex items-center justify-center mb-1">
              <Calendar className="h-3 w-3 mr-1" style={{ color: '#7F9474' }} />
              <span className="font-medium">Date</span>
            </div>
            <div style={{ color: '#1a5d40', fontSize: '11px' }}>
              {weddingDate || "À confirmer"}
            </div>
          </div>
          
          <div className="p-2 rounded text-center" style={{ backgroundColor: '#f8f6f0', border: '1px solid #e8e5db' }}>
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-3 w-3 mr-1" style={{ color: '#7F9474' }} />
              <span className="font-medium">Début</span>
            </div>
            <div style={{ color: '#1a5d40', fontSize: '11px' }}>
              {events.length > 0 ? formatTime(events[0].startTime) : ""}
            </div>
          </div>
          
          <div className="p-2 rounded text-center" style={{ backgroundColor: '#f8f6f0', border: '1px solid #e8e5db' }}>
            <div className="flex items-center justify-center mb-1">
              <MapPin className="h-3 w-3 mr-1" style={{ color: '#7F9474' }} />
              <span className="font-medium">Événements</span>
            </div>
            <div style={{ color: '#1a5d40', fontSize: '11px' }}>
              {events.length} planifiés
            </div>
          </div>
        </div>
      </div>

      {/* Planning Timeline - Two Column Layout */}
      <div className="mb-5">
        <h2 className="font-serif font-semibold mb-3 pb-1" style={{ 
          fontFamily: 'Playfair Display, serif',
          fontSize: '16px',
          color: '#1a5d40',
          borderBottom: '1px solid #f1f7f3'
        }}>
          Déroulé de la journée
        </h2>
        
        <div className="grid grid-cols-2 gap-3" style={{ fontSize: '11px' }}>
          {events.map((event, index) => {
            const categoryStyle = getCategoryStyle(event.category || '');
            
            return (
              <div key={event.id} className="p-2 rounded" style={{ 
                backgroundColor: categoryStyle.bg,
                border: `1px solid ${categoryStyle.color}`,
                pageBreakInside: 'avoid'
              }}>
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: categoryStyle.color }}></div>
                    <span className="font-medium text-xs" style={{ color: categoryStyle.color }}>
                      {formatTime(event.startTime)}
                    </span>
                  </div>
                  <span className="text-xs px-1 py-0.5 rounded" style={{ 
                    backgroundColor: categoryStyle.color, 
                    color: 'white',
                    fontSize: '9px'
                  }}>
                    {event.duration}min
                  </span>
                </div>
                
                <h4 className="font-medium mb-1" style={{ 
                  fontSize: '12px',
                  color: '#1a5d40',
                  lineHeight: '1.2'
                }}>
                  {event.title}
                </h4>
                
                {event.notes && (
                  <p className="text-xs" style={{ 
                    color: '#666666',
                    lineHeight: '1.2'
                  }}>
                    {event.notes}
                  </p>
                )}
                
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs" style={{ color: categoryStyle.color }}>
                    {event.category}
                  </span>
                  {event.endTime && (
                    <span className="text-xs" style={{ color: '#666666' }}>
                      → {formatTime(event.endTime)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary by Category - Compact */}
      <div className="mb-4">
        <h2 className="font-serif font-semibold mb-2 pb-1" style={{ 
          fontFamily: 'Playfair Display, serif',
          fontSize: '16px',
          color: '#1a5d40',
          borderBottom: '1px solid #f1f7f3'
        }}>
          Résumé par section
        </h2>
        
        <div className="grid grid-cols-3 gap-2" style={{ fontSize: '10px' }}>
          {Object.entries(groupedEvents).map(([category, categoryEvents]) => {
            const categoryStyle = getCategoryStyle(category);
            const totalDuration = categoryEvents.reduce((sum, event) => sum + (event.duration || 0), 0);
            
            return (
              <div key={category} className="p-2 rounded text-center" style={{ 
                backgroundColor: categoryStyle.bg,
                border: `1px solid ${categoryStyle.color}`
              }}>
                <div className="font-medium mb-1" style={{ color: categoryStyle.color, fontSize: '11px' }}>
                  {category}
                </div>
                <div style={{ fontSize: '9px', color: '#666666' }}>
                  {categoryEvents.length} événement{categoryEvents.length > 1 ? 's' : ''}
                </div>
                <div style={{ fontSize: '9px', color: '#666666' }}>
                  {totalDuration} minutes
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notes Section */}
      <div className="mb-4">
        <h2 className="font-serif font-semibold mb-2 pb-1" style={{ 
          fontFamily: 'Playfair Display, serif',
          fontSize: '16px',
          color: '#1a5d40',
          borderBottom: '1px solid #f1f7f3'
        }}>
          Notes importantes
        </h2>
        
        <div className="p-3 rounded text-xs leading-relaxed" style={{ 
          backgroundColor: '#f1f7f3', 
          border: '1px solid #e8e5db',
          fontSize: '10px',
          lineHeight: '1.3'
        }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium mb-1">Conseils de timing :</p>
              <p className="mb-1">• Prévoir 15 min de battement entre chaque événement</p>
              <p>• Confirmer les horaires avec tous les prestataires</p>
            </div>
            <div>
              <p className="font-medium mb-1">Coordination :</p>
              <p className="mb-1">• Désigner un responsable planning sur place</p>
              <p>• Partager ce planning avec tous les intervenants</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-3 text-xs" style={{ 
        borderTop: '1px solid #e8e5db',
        color: '#666666',
        fontSize: '9px'
      }}>
        <p className="mb-1">
          Planning généré le {new Date().toLocaleDateString('fr-FR')} par Mariable
        </p>
        <p className="font-medium" style={{ color: '#7F9474' }}>
          www.mariable.fr - Votre assistant mariage personnalisé
        </p>
      </div>
    </div>
  );
};

export default PlanningJourJExport;
