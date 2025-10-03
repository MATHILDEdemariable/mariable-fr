import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Euro, Star, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';

interface BudgetItem {
  category: string;
  percentage: number;
  amount: number;
}

interface TimelineItem {
  task: string;
  timeframe: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

interface Vendor {
  id: string;
  nom: string;
  categorie: string;
  ville: string;
  prix_min: number;
  prix_max: number;
  description: string;
  note_moyenne: number;
}

interface WeddingProject {
  summary: string;
  weddingData: {
    guests: number | null;
    budget: number | null;
    location: string | null;
    date: string | null;
    style: string | null;
  };
  budgetBreakdown: BudgetItem[];
  timeline: TimelineItem[];
  vendors: Vendor[];
}

interface VibeWeddingResultsProps {
  project: WeddingProject;
}

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-500';
    case 'medium': return 'bg-orange-500';
    case 'low': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'high': return <AlertCircle className="w-4 h-4" />;
    case 'medium': return <Calendar className="w-4 h-4" />;
    case 'low': return <CheckCircle2 className="w-4 h-4" />;
    default: return null;
  }
};

const VibeWeddingResults: React.FC<VibeWeddingResultsProps> = ({ project }) => {
  return (
    <aside className="w-full md:w-[400px] border-l border-border bg-card overflow-hidden flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Résumé */}
          <div>
            <h2 className="text-xl font-serif font-bold mb-3">Votre projet</h2>
            <p className="text-sm text-foreground leading-relaxed">{project.summary}</p>
          </div>

          {/* Budget */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Euro className="w-5 h-5 text-premium-sage" />
                Répartition du budget
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.budgetBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-premium-sage font-semibold">
                      {formatPrice(item.amount)}
                    </span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={item.percentage} 
                      className="h-2"
                    />
                    <span className="absolute right-0 -top-5 text-xs text-muted-foreground">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="text-lg font-bold text-premium-sage">
                    {formatPrice(project.budgetBreakdown.reduce((sum, item) => sum + item.amount, 0))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-premium-sage" />
                Rétroplanning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Ligne verticale */}
                <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-border" />
                
                <div className="space-y-6">
                  {project.timeline.map((item, idx) => (
                    <div key={idx} className="relative pl-10">
                      {/* Point coloré */}
                      <div 
                        className={`absolute left-0 top-1 w-6 h-6 rounded-full ${getPriorityColor(item.priority)} flex items-center justify-center`}
                      >
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-tight">{item.task}</p>
                          <Badge 
                            variant="outline" 
                            className="flex-shrink-0 text-xs"
                          >
                            {getPriorityIcon(item.priority)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.timeframe}</p>
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prestataires suggérés */}
          {project.vendors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Star className="w-5 h-5 text-premium-sage" />
                  Prestataires recommandés
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.vendors.map((vendor) => (
                  <Card 
                    key={vendor.id}
                    className="hover:shadow-md transition-shadow cursor-pointer border-premium-sage-light"
                  >
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{vendor.nom}</h4>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {vendor.categorie}
                          </Badge>
                        </div>
                        {vendor.note_moyenne > 0 && (
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{vendor.note_moyenne.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{vendor.ville}</span>
                      </div>
                      
                      {vendor.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {vendor.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-xs text-muted-foreground">Prix</span>
                        <span className="text-sm font-semibold text-premium-sage">
                          {formatPrice(vendor.prix_min)} - {formatPrice(vendor.prix_max)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};

export default VibeWeddingResults;
