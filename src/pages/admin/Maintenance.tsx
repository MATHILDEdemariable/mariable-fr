import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import AppArchitectureView from '@/components/admin/maintenance/AppArchitectureView';
import CoreWebVitalsMonitor from '@/components/admin/maintenance/CoreWebVitalsMonitor';
import DatabaseHealthView from '@/components/admin/maintenance/DatabaseHealthView';
import CleanupActions from '@/components/admin/maintenance/CleanupActions';

interface MetricCardProps {
  title: string;
  value: string;
  icon: string;
  status?: 'success' | 'warning' | 'error';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, status = 'success' }) => {
  const statusColors = {
    success: 'border-green-500 bg-green-50',
    warning: 'border-yellow-500 bg-yellow-50',
    error: 'border-red-500 bg-red-50',
  };

  return (
    <Card className={`p-4 border-2 ${statusColors[status]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </Card>
  );
};

const AdminMaintenance: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Maintenance & Monitoring</h1>
            <p className="text-muted-foreground mt-1">
              Architecture, Performance & Nettoyage
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Dernière vérification : {new Date().toLocaleString('fr-FR')}
          </div>
        </div>

        {/* Metrics cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Core Web Vitals"
            value="95/100"
            icon="⚡"
            status="success"
          />
          <MetricCard
            title="Pages actives"
            value="77/93"
            icon="🗂️"
            status="warning"
          />
          <MetricCard
            title="Database Health"
            value="92%"
            icon="🗄️"
            status="success"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="architecture" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="architecture">Architecture App</TabsTrigger>
            <TabsTrigger value="performance">Core Web Vitals</TabsTrigger>
            <TabsTrigger value="database">Database Health</TabsTrigger>
            <TabsTrigger value="cleanup">Cleanup Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="architecture" className="mt-6">
            <AppArchitectureView />
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <CoreWebVitalsMonitor />
          </TabsContent>

          <TabsContent value="database" className="mt-6">
            <DatabaseHealthView />
          </TabsContent>

          <TabsContent value="cleanup" className="mt-6">
            <CleanupActions />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminMaintenance;
