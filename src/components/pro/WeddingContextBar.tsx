import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useWedding } from '@/contexts/WeddingContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * Bandeau de contexte affiché uniquement pour les comptes professionnels :
 * rappelle le mariage ouvert, permet d'en changer et de revenir à la liste.
 */
const WeddingContextBar: React.FC = () => {
  const { accountType, currentWedding, currentWeddingId, weddings, selectWedding } = useWedding();

  if (accountType !== 'b2b' || !currentWedding) return null;

  return (
    <div className="border-b border-border bg-[#F8F5EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center gap-3 justify-between">
        <Link
          to="/pro"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Mes mariages
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">Mariage en cours :</span>
          <Select value={currentWeddingId ?? undefined} onValueChange={selectWedding}>
            <SelectTrigger className="h-8 w-[220px] rounded-none bg-background text-sm">
              <SelectValue placeholder="Choisir un mariage" />
            </SelectTrigger>
            <SelectContent>
              {weddings.map((wedding) => (
                <SelectItem key={wedding.id} value={wedding.id}>
                  {wedding.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default WeddingContextBar;
