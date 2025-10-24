import { motion } from 'framer-motion';
import { Feature, dashboardFeatures } from '@/data/dashboardFeatures';
import { Heart, DollarSign, CheckCircle, Calendar, Sparkles, Clock, Users, FileText, ChevronDown, ChevronRight, UserCheck, QrCode, Home, LayoutGrid } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
interface DashboardMockupProps {
  expandedMenus: string[];
  onToggleMenu: (menuId: string) => void;
  hoveredFeature: string | null;
  onHoverFeature: (featureId: string | null) => void;
}
export const DashboardMockup = ({
  expandedMenus,
  onToggleMenu,
  hoveredFeature,
  onHoverFeature
}: DashboardMockupProps) => {
  const isExpanded = (menuId: string) => expandedMenus.includes(menuId);
  return <div className="relative w-full min-h-[800px] bg-gray-50 rounded-lg overflow-hidden border-2 border-gray-200">
      {/* Header */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-wedding-olive" />
          <span className="font-bold text-xl">Mon Mariage</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors" onMouseEnter={() => onHoverFeature('user-profile')} onMouseLeave={() => onHoverFeature(null)}>
          <div className="w-8 h-8 rounded-full bg-wedding-olive/20 flex items-center justify-center">
            <Users className="w-4 h-4 text-wedding-olive" />
          </div>
          <span className="text-sm font-medium">Mon Profil</span>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-[744px] p-4 space-y-2">
          {/* Mon Mariage */}
          <div className={`p-3 rounded-lg cursor-pointer transition-colors ${hoveredFeature === 'mon-mariage' ? 'bg-wedding-olive/10' : 'hover:bg-gray-100'}`} onMouseEnter={() => onHoverFeature('mon-mariage')} onMouseLeave={() => onHoverFeature(null)} title="créer votre espace mariage 100% personnalisé">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-wedding-olive" />
              <span className="font-medium">Mon Mariage</span>
            </div>
          </div>

          {/* Budget */}
          <div className={`p-3 rounded-lg cursor-pointer transition-colors ${hoveredFeature === 'budget' ? 'bg-wedding-olive/10' : 'hover:bg-gray-100'}`} onMouseEnter={() => onHoverFeature('budget')} onMouseLeave={() => onHoverFeature(null)}>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-wedding-olive" />
              <span className="font-medium">Budget</span>
            </div>
          </div>

          {/* Checklist */}
          <div className={`p-3 rounded-lg cursor-pointer transition-colors ${hoveredFeature === 'checklist' ? 'bg-wedding-olive/10' : 'hover:bg-gray-100'}`} onMouseEnter={() => onHoverFeature('checklist')} onMouseLeave={() => onHoverFeature(null)}>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-wedding-olive" />
              <span className="font-medium">Checklist Mariage</span>
            </div>
          </div>

          {/* Rétroplanning */}
          <div className={`p-3 rounded-lg cursor-pointer transition-colors ${hoveredFeature === 'avant-jour-j' ? 'bg-wedding-olive/10' : 'hover:bg-gray-100'}`} onMouseEnter={() => onHoverFeature('avant-jour-j')} onMouseLeave={() => onHoverFeature(null)}>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-wedding-olive" />
              <span className="font-medium">Rétroplanning</span>
            </div>
          </div>

          {/* Mon Jour M (expandable) */}
          <div>
            <div className={`p-3 rounded-lg cursor-pointer transition-colors ${hoveredFeature === 'mon-jour-m' ? 'bg-wedding-olive/10' : 'hover:bg-gray-100'}`} onClick={() => onToggleMenu('mon-jour-m')} onMouseEnter={() => onHoverFeature('mon-jour-m')} onMouseLeave={() => onHoverFeature(null)} title="Jour-J - Seule fonctionnalité payante (voir tarifs)">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-wedding-olive" />
                  <span className="font-medium">Jour-J</span>
                </div>
                {isExpanded('mon-jour-m') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>
            </div>

            {/* Sub-items */}
            {isExpanded('mon-jour-m') && <motion.div initial={{
            height: 0,
            opacity: 0
          }} animate={{
            height: 'auto',
            opacity: 1
          }} exit={{
            height: 0,
            opacity: 0
          }} className="ml-4 mt-1 space-y-1">
                <div className={`p-2 rounded-lg cursor-pointer transition-colors text-sm ${hoveredFeature === 'jour-m-planning' ? 'bg-wedding-olive/10' : 'hover:bg-gray-100'}`} onMouseEnter={() => onHoverFeature('jour-m-planning')} onMouseLeave={() => onHoverFeature(null)}>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-wedding-olive" />
                    <span>Planning</span>
                  </div>
                </div>
                <div className={`p-2 rounded-lg cursor-pointer transition-colors text-sm ${hoveredFeature === 'jour-m-equipe' ? 'bg-wedding-olive/10' : 'hover:bg-gray-100'}`} onMouseEnter={() => onHoverFeature('jour-m-equipe')} onMouseLeave={() => onHoverFeature(null)}>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-wedding-olive" />
                    <span>Équipe</span>
                  </div>
                </div>
                <div className={`p-2 rounded-lg cursor-pointer transition-colors text-sm ${hoveredFeature === 'jour-m-documents' ? 'bg-wedding-olive/10' : 'hover:bg-gray-100'}`} onMouseEnter={() => onHoverFeature('jour-m-documents')} onMouseLeave={() => onHoverFeature(null)}>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-wedding-olive" />
                    <span>Documents</span>
                  </div>
                </div>
              </motion.div>}
          </div>

          {/* Après Jour J */}
          <div className={`p-3 rounded-lg cursor-pointer transition-colors ${hoveredFeature === 'apres-jour-j' ? 'bg-wedding-olive/10' : 'hover:bg-gray-100'}`} onMouseEnter={() => onHoverFeature('apres-jour-j')} onMouseLeave={() => onHoverFeature(null)}>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-wedding-olive" />
              <span className="font-medium">Après Jour J</span>
            </div>
          </div>

          {/* Prestataires */}
          <div className={`p-3 rounded-lg cursor-pointer transition-colors ${hoveredFeature === 'prestataires' ? 'bg-wedding-olive/10' : 'hover:bg-gray-100'}`} onMouseEnter={() => onHoverFeature('prestataires')} onMouseLeave={() => onHoverFeature(null)}>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-wedding-olive" />
              <span className="font-medium">Mes Prestataires</span>
            </div>
          </div>

          {/* RSVP Invités */}
          <div className={`p-3 rounded-lg cursor-pointer transition-colors ${hoveredFeature === 'rsvp' ? 'bg-wedding-olive/10' : 'hover:bg-gray-100'}`} onMouseEnter={() => onHoverFeature('rsvp')} onMouseLeave={() => onHoverFeature(null)}>
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-wedding-olive" />
              <span className="font-medium">RSVP Invités</span>
            </div>
          </div>

          {/* Plan de Table */}
          <div className={`p-3 rounded-lg cursor-pointer transition-colors ${hoveredFeature === 'seating-plan' ? 'bg-wedding-olive/10' : 'hover:bg-gray-100'}`} onMouseEnter={() => onHoverFeature('seating-plan')} onMouseLeave={() => onHoverFeature(null)} title="Organisez le plan de table de votre mariage">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-wedding-olive" />
              <span className="font-medium">Plan de Table</span>
            </div>
          </div>

          {/* Gestion Hébergements */}
          <div className={`p-3 rounded-lg cursor-pointer transition-colors ${hoveredFeature === 'logements' ? 'bg-wedding-olive/10' : 'hover:bg-gray-100'}`} onMouseEnter={() => onHoverFeature('logements')} onMouseLeave={() => onHoverFeature(null)} title="Gérer les hébergements de vos invités">
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-wedding-olive" />
              <span className="font-medium">Hébergements Invités</span>
            </div>
          </div>

          {/* QR Code */}
          <div className={`p-3 rounded-lg cursor-pointer transition-colors ${hoveredFeature === 'qr-code' ? 'bg-wedding-olive/10' : 'hover:bg-gray-100'}`} onMouseEnter={() => onHoverFeature('qr-code')} onMouseLeave={() => onHoverFeature(null)} title="Générer des QR codes pour liste cadeau et cagnotte">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-wedding-olive" />
              <span className="font-medium">QR Code Liste Cadeau</span>
            </div>
          </div>

          {/* Documents */}
          <div className={`p-3 rounded-lg cursor-pointer transition-colors ${hoveredFeature === 'documents' ? 'bg-wedding-olive/10' : 'hover:bg-gray-100'}`} onMouseEnter={() => onHoverFeature('documents')} onMouseLeave={() => onHoverFeature(null)} title="Stock tes documents et centralise les facilement">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-wedding-olive" />
              <span className="font-medium">Mes Documents</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Share Button */}
          <div className="flex justify-end mb-6">
            <div className={`px-4 py-2 rounded-lg bg-wedding-olive text-white cursor-pointer hover:bg-wedding-olive/90 transition-colors ${hoveredFeature === 'share-dashboard' ? 'ring-2 ring-wedding-olive/50' : ''}`} onMouseEnter={() => onHoverFeature('share-dashboard')} onMouseLeave={() => onHoverFeature(null)}>
              Partager le dashboard
            </div>
          </div>

          {/* Project Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2].map(i => <div key={i} className={`cursor-pointer transition-all ${hoveredFeature === 'project-cards' ? 'ring-2 ring-wedding-olive/50' : ''}`} onMouseEnter={() => onHoverFeature('project-cards')} onMouseLeave={() => onHoverFeature(null)}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4">Mariage Provence {i}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Invités</span>
                        <span className="font-medium">150</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Budget</span>
                        <span className="font-medium">25 000 €</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Lieu</span>
                        <span className="font-medium">Provence</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-medium">15/08/2025</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <div className="flex-1 px-3 py-2 bg-wedding-olive/10 text-wedding-olive rounded-lg text-sm text-center">
                        Voir
                      </div>
                      <div className="flex-1 px-3 py-2 bg-wedding-olive text-white rounded-lg text-sm text-center">
                        Modifier
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};