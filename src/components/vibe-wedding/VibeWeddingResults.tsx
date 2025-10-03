import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { 
  Calendar, 
  MapPin, 
  Users, 
  AlertCircle, 
  CheckCircle2,
  Star,
  Euro
} from 'lucide-react';

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

const VibeWeddingResults: React.FC<VibeWeddingResultsProps> = ({ project }) => {
  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace(/\s/g, ' ');
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "À définir";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Calendar className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  if (!project) {
    return null;
  }

  const totalBudget = project.budgetBreakdown?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;

  // Couleurs pour le pie chart
  const COLORS = ['hsl(var(--wedding-olive))', '#A8B89F', '#C4D3BB', '#E0E8D7', '#F4F7F2', '#D4C5B9'];

  // Données pour le pie chart
  const chartData = project.budgetBreakdown?.map((item, index) => ({
    name: item.category,
    value: item.amount || 0,
    color: COLORS[index % COLORS.length]
  })) || [];

  return (
    <aside className="w-full md:w-[400px] border-l border-border bg-card overflow-hidden flex flex-col">
      <ScrollArea className="flex-1">
        <motion.div 
          className="p-6 space-y-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* KPI Header */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-gradient-to-br from-wedding-olive/5 to-white rounded-lg border">
            <motion.div 
              className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="p-2 bg-wedding-olive/10 rounded-full">
                <Users className="w-5 h-5 text-wedding-olive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Invités</p>
                <p className="text-lg font-bold">{project.weddingData?.guests || "À définir"}</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-2 bg-wedding-olive/10 rounded-full">
                <Euro className="w-5 h-5 text-wedding-olive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Budget</p>
                <p className="text-lg font-bold">{formatPrice(totalBudget)}</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-2 bg-wedding-olive/10 rounded-full">
                <MapPin className="w-5 h-5 text-wedding-olive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Lieu</p>
                <p className="text-sm font-semibold truncate">{project.weddingData?.location || "À définir"}</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="p-2 bg-wedding-olive/10 rounded-full">
                <Calendar className="w-5 h-5 text-wedding-olive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm font-semibold">{formatDate(project.weddingData?.date)}</p>
              </div>
            </motion.div>
          </div>

          {/* Summary Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Votre projet de mariage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {project.summary}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Budget Breakdown with Pie Chart */}
          {project.budgetBreakdown && project.budgetBreakdown.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Répartition du budget</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Pie Chart */}
                  <div className="w-full h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={90}
                          fill="#8884d8"
                          dataKey="value"
                          animationBegin={0}
                          animationDuration={800}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          formatter={(value: number) => formatPrice(value)}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                          formatter={(value) => <span className="text-xs">{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Budget Details with animated progress bars */}
                  <div className="space-y-3">
                    {project.budgetBreakdown.map((item, index) => (
                      <motion.div 
                        key={index} 
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + (index * 0.1) }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{item.category}</span>
                          <div className="text-right">
                            <span className="text-sm font-semibold">{formatPrice(item.amount)}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              ({item.percentage}%)
                            </span>
                          </div>
                        </div>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ delay: 0.8 + (index * 0.1), duration: 0.5 }}
                        >
                          <Progress value={item.percentage} className="h-2" />
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>

                  <Separator className="my-4" />
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-semibold">Budget total</span>
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(totalBudget)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Timeline with animations */}
          {project.timeline && project.timeline.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Rétroplanning</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.timeline.map((item, index) => (
                      <motion.div 
                        key={index} 
                        className="flex gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + (index * 0.1) }}
                      >
                        <div className="flex flex-col items-center">
                          <motion.div 
                            className={`w-3 h-3 rounded-full ${
                              item.priority === 'high' ? 'bg-red-500' : 
                              item.priority === 'medium' ? 'bg-yellow-500' : 
                              'bg-green-500'
                            }`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.9 + (index * 0.1), type: "spring" }}
                          />
                          {index < project.timeline.length - 1 && (
                            <motion.div 
                              className="w-0.5 bg-border mt-2 flex-1"
                              initial={{ height: 0 }}
                              animate={{ height: "100%" }}
                              transition={{ delay: 1 + (index * 0.1), duration: 0.3 }}
                            />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-medium">{item.task}</h4>
                            {getPriorityIcon(item.priority)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.timeframe}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Vendors Section with animations */}
          {project.vendors && project.vendors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Prestataires recommandés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.vendors.map((vendor, index) => (
                      <motion.div
                        key={vendor.id}
                        className="p-4 border rounded-lg hover:border-primary hover:shadow-md transition-all duration-300 cursor-pointer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 + (index * 0.1) }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{vendor.nom}</h4>
                            <Badge variant="secondary" className="mt-1">
                              {vendor.categorie}
                            </Badge>
                          </div>
                          {vendor.note_moyenne && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">
                                {vendor.note_moyenne}/5
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {vendor.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {vendor.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {vendor.ville}
                          </span>
                          {vendor.prix_min && vendor.prix_max && (
                            <span className="font-medium">
                              {formatPrice(vendor.prix_min)} - {formatPrice(vendor.prix_max)}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </ScrollArea>
    </aside>
  );
};

export default VibeWeddingResults;
