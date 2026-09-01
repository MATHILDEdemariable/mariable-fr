import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BudgetCalculator from '@/components/dashboard/BudgetCalculator';

interface BudgetSimulatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BudgetSimulatorModal: React.FC<BudgetSimulatorModalProps> = ({ open, onOpenChange }) => {
  const handleLeadClick = () => {
    try {
      sessionStorage.setItem(
        'mariable_budget_lead',
        JSON.stringify({ source: 'budget-mariage', createdAt: new Date().toISOString() }),
      );
    } catch (error) {
      console.error('❌ BudgetSimulatorModal: sessionStorage indisponible', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto bg-[#F8F5EF] rounded-none border-editorial-noir/15">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl md:text-3xl text-editorial-noir text-left">
            Estimer le budget de votre mariage
          </DialogTitle>
        </DialogHeader>

        <BudgetCalculator />

        <div className="mt-8 border-t-2 border-editorial-noir pt-6">
          <p className="font-serif text-xl md:text-2xl text-editorial-noir">
            Vous souhaitez recevoir les prestataires qui correspondent à ce budget ?
          </p>
          <Link
            to="/register-gratuit?source=budget&intent=prestataires"
            onClick={handleLeadClick}
            className="mt-5 inline-flex items-center gap-3 bg-white text-editorial-noir border border-editorial-noir hover:bg-editorial-noir hover:text-white px-8 py-4 uppercase tracking-widest text-xs rounded-none transition-colors"
          >
            <span>Oui, je veux découvrir</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetSimulatorModal;
