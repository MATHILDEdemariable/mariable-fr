import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';

interface LockContextType {
  requestAccess: (destination?: string) => void;
}

const LockContext = createContext<LockContextType | undefined>(undefined);

export const SelectionLockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [destination, setDestination] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const requestAccess = useCallback((dest?: string) => {
    if (user && dest) {
      navigate(dest);
      return;
    }
    setDestination(dest ?? null);
    setOpen(true);
  }, [user, navigate]);

  return (
    <LockContext.Provider value={{ requestAccess }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-none border border-editorial-noir/20 bg-[#F8F5EF] max-w-md">
          <DialogHeader>
            <p className="text-xs tracking-[0.2em] uppercase text-editorial-noir/60 mb-2">La Sélection</p>
            <DialogTitle className="font-serif text-2xl text-editorial-noir">
              Créez votre compte gratuit
            </DialogTitle>
            <DialogDescription className="text-editorial-noir/70 text-sm pt-2">
              Pour accéder aux adresses de la Sélection Mariable — coordonnées, sites, détails complets.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between mt-4">
            <button
              onClick={() => setOpen(false)}
              className="text-xs tracking-[0.2em] uppercase text-editorial-noir/60 hover:text-editorial-noir underline underline-offset-4"
            >
              Continuer à explorer
            </button>
            <Link
              to="/register-gratuit"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center gap-2 bg-white text-editorial-noir border border-editorial-noir hover:bg-editorial-noir hover:text-white px-8 py-4 text-xs uppercase tracking-widest rounded-none transition-colors"
            >
              Créer mon compte gratuit
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </LockContext.Provider>
  );
};

export const useSelectionLock = () => {
  const ctx = useContext(LockContext);
  if (!ctx) throw new Error('useSelectionLock must be used within SelectionLockProvider');
  return ctx;
};
