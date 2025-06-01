
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2, FileText } from 'lucide-react';
import { usePlanning } from '../context/PlanningContext';

const PlanningActions: React.FC = () => {
  const { planning } = usePlanning();
  const [localExportLoading, setLocalExportLoading] = useState(false);

  const handleExportPDF = async () => {
    if (!planning || planning.length === 0) return;
    
    setLocalExportLoading(true);
    try {
      // TODO: Implement PDF export functionality
      console.log('Exporting planning to PDF...');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate export
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setLocalExportLoading(false);
    }
  };

  const handleShare = async () => {
    if (!planning || planning.length === 0) return;
    
    try {
      // TODO: Implement share functionality
      console.log('Sharing planning...');
    } catch (error) {
      console.error('Error sharing planning:', error);
    }
  };

  if (!planning || planning.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={handleExportPDF}
        disabled={localExportLoading}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        {localExportLoading ? 'Export...' : 'Exporter PDF'}
      </Button>
      
      <Button
        variant="outline"
        onClick={handleShare}
        className="flex items-center gap-2"
      >
        <Share2 className="h-4 w-4" />
        Partager
      </Button>
    </div>
  );
};

export default PlanningActions;
