import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Users, FileText, Target } from 'lucide-react';
import ProjectPlanningContent from './ProjectPlanningContent';
import ProjectTeamManager from './ProjectTeamManager';
import ProjectDocuments from './ProjectDocuments';
import ProjectShareButton from './ProjectShareButton';
import { useProjectCoordination } from '@/hooks/useProjectCoordination';

const ProjectLayout: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { coordination } = useProjectCoordination();

  const getActiveTab = () => {
    if (currentPath.includes('/planning')) return 'planning';
    if (currentPath.includes('/team')) return 'team';
    if (currentPath.includes('/documents')) return 'documents';
    return 'planning'; // default
  };

  return (
    <div className="min-h-screen bg-background">
        <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-semibold text-foreground">Mission Mariage</h1>
                  <p className="text-sm text-muted-foreground">Préparation et organisation</p>
                </div>
              </div>
              <ProjectShareButton />
            </div>
          </div>

          {/* Navigation par onglets */}
          <div className="mt-4 pb-4">
            <Tabs value={getActiveTab()} className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-lg">
                <TabsTrigger value="planning" asChild>
                  <Link 
                    to="/dashboard/project-management/planning" 
                    className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-primary"
                  >
                    <Calendar className="h-4 w-4" />
                     TO DO List
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="team" asChild>
                  <Link 
                    to="/dashboard/project-management/team" 
                    className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-primary"
                  >
                    <Users className="h-4 w-4" />
                    Équipe
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="documents" asChild>
                  <Link 
                    to="/dashboard/project-management/documents" 
                    className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-primary"
                  >
                    <FileText className="h-4 w-4" />
                    Documents
                  </Link>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route index element={<ProjectPlanningContent coordinationId={coordination?.id || ''} />} />
          <Route path="planning" element={<ProjectPlanningContent coordinationId={coordination?.id || ''} />} />
          <Route path="team" element={<ProjectTeamManager />} />
          <Route path="documents" element={<ProjectDocuments />} />
        </Routes>
      </div>
    </div>
  );
};

export default ProjectLayout;