
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Clock, CheckCircle } from 'lucide-react';

interface Reservation {
  id: string;
  status: string;
  created_at: string;
  guest_count: number;
}

interface ReservationMetricsProps {
  reservations: Reservation[];
}

const ReservationMetrics: React.FC<ReservationMetricsProps> = ({ reservations }) => {
  const totalReservations = reservations.length;
  const newReservations = reservations.filter(r => r.status === 'nouveau').length;
  const processedReservations = reservations.filter(r => r.status === 'traite').length;
  const totalGuests = reservations.reduce((sum, r) => sum + (r.guest_count || 0), 0);

  // Réservations de cette semaine
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyReservations = reservations.filter(r => 
    new Date(r.created_at) >= oneWeekAgo
  ).length;

  const metrics = [
    {
      title: "Total des réservations",
      value: totalReservations,
      icon: Calendar,
      description: `${weeklyReservations} cette semaine`
    },
    {
      title: "Nouvelles demandes",
      value: newReservations,
      icon: Clock,
      description: "À traiter"
    },
    {
      title: "Réservations traitées",
      value: processedReservations,
      icon: CheckCircle,
      description: `${Math.round((processedReservations / totalReservations) * 100) || 0}% du total`
    },
    {
      title: "Total invités",
      value: totalGuests,
      icon: Users,
      description: `Moyenne: ${Math.round(totalGuests / totalReservations) || 0} par mariage`
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReservationMetrics;
