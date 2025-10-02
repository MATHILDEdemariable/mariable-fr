import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, MapPin, Euro } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface OnePagerData {
  timeline: Array<{
    period: string;
    tasks: string[];
  }>;
  budgetBreakdown: Record<string, number>;
}

interface Vendor {
  id: string;
  nom: string;
  categorie: string;
  region: string;
  ville: string;
  slug: string;
  prix_a_partir_de: number;
  photos: any;
}

interface Props {
  data: OnePagerData;
  vendors: Vendor[];
}

const COLORS = ['#8B9475', '#C8B896', '#9FA98D', '#B8A67A', '#A5AF92'];

const AIWeddingOnePager: React.FC<Props> = ({ data, vendors }) => {
  const budgetData = Object.entries(data.budgetBreakdown).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="mt-6 space-y-6 p-6 bg-white rounded-lg border-2 border-wedding-olive/20">
      <h3 className="text-2xl font-serif text-wedding-olive">
        📋 Votre plan de mariage personnalisé
      </h3>

      {/* Timeline */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-wedding-olive">📅 Rétroplanning</h4>
        <div className="space-y-4">
          {data.timeline.map((item, index) => (
            <div key={index} className="border-l-4 border-wedding-olive pl-4">
              <h5 className="font-semibold text-gray-900">{item.period}</h5>
              <ul className="mt-2 space-y-1">
                {item.tasks.map((task, taskIndex) => (
                  <li key={taskIndex} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-wedding-olive flex-shrink-0 mt-0.5" />
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-wedding-olive">💰 Répartition budget</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={budgetData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {budgetData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Prestataires */}
      {vendors.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-4 text-wedding-olive">👰 Prestataires suggérés</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendors.slice(0, 6).map((vendor) => {
              const photo = typeof vendor.photos === 'string' 
                ? JSON.parse(vendor.photos)[0] 
                : vendor.photos?.[0];
              
              return (
                <Card key={vendor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    {photo && (
                      <img 
                        src={photo} 
                        alt={vendor.nom}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h5 className="font-semibold mb-1">{vendor.nom}</h5>
                    <p className="text-sm text-gray-600 mb-2">{vendor.categorie}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      <MapPin className="w-3 h-3" />
                      {vendor.ville}
                    </div>
                    {vendor.prix_a_partir_de && (
                      <div className="flex items-center gap-1 text-xs text-wedding-olive">
                        <Euro className="w-3 h-3" />
                        À partir de {vendor.prix_a_partir_de}€
                      </div>
                    )}
                    <Button asChild variant="outline" size="sm" className="w-full mt-3">
                      <Link to={`/prestataire/${vendor.slug}`}>
                        Voir plus
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="flex gap-4 justify-center pt-6 border-t">
        <Button asChild size="lg" className="bg-wedding-olive">
          <Link to="/register">
            💾 Sauvegarder mon plan
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/dashboard">
            🛠️ Explorer les outils
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AIWeddingOnePager;