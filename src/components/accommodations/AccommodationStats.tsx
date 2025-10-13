import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Users, DollarSign, AlertCircle } from 'lucide-react';
import { Accommodation } from '@/hooks/useAccommodations';

interface AccommodationStatsProps {
  accommodations: Accommodation[];
}

export const AccommodationStats = ({ accommodations }: AccommodationStatsProps) => {
  const totalAccommodations = accommodations.length;
  const totalCapacity = accommodations.reduce((sum, acc) => sum + acc.capacite_totale, 0);
  const totalGuests = accommodations.reduce((sum, acc) => sum + (acc.guests?.length || 0), 0);
  const totalBudget = accommodations.reduce(
    (sum, acc) => sum + (acc.prix_par_nuit || 0) * (acc.nombre_chambres || 1),
    0
  );
  const paidCount = accommodations.filter((acc) => acc.statut === 'paye').length;
  const reservedCount = accommodations.filter((acc) => acc.statut === 'reserve').length;
  const availableCount = accommodations.filter((acc) => acc.statut === 'non_reserve').length;

  const stats = [
    {
      title: 'Total logements',
      value: totalAccommodations,
      icon: Home,
      color: 'text-wedding-olive',
    },
    {
      title: 'Capacité totale',
      value: `${totalGuests} / ${totalCapacity}`,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Budget total',
      value: `${totalBudget.toFixed(0)}€`,
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'En attente',
      value: availableCount,
      icon: AlertCircle,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.title === 'Total logements' && (
              <p className="text-xs text-muted-foreground mt-1">
                {paidCount} payés, {reservedCount} réservés
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
