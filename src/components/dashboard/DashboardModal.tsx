
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface DashboardModalProps {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const DashboardModal: React.FC<DashboardModalProps> = ({
  title,
  open,
  onOpenChange,
  children,
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[540px] md:w-[640px] overflow-y-auto">
        <SheetHeader className="mb-4">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-2xl font-serif text-wedding-olive">{title}</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" aria-label="Fermer">
                <X size={20} />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>
        <div className="pb-6">{children}</div>
      </SheetContent>
    </Sheet>
  );
};

export default DashboardModal;
