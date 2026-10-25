import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Mail } from 'lucide-react';

export interface Installment { amount: number; due_date: string; paid: boolean; reminder: boolean; reminder_sent?: boolean }
export interface PaymentSchedule { installments?: Installment[]; cash_day?: number }

export const MAX_INSTALLMENTS = 3;

/** Total payé = somme des acomptes cochés « payé ». */
export const paidFromSchedule = (schedule: PaymentSchedule | undefined) =>
  (schedule?.installments || []).filter((i) => i.paid).reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  total: number;
  schedule: PaymentSchedule;
  isEnglish: boolean;
  disabled?: boolean;
  onSave: (schedule: PaymentSchedule) => void;
}

const PaymentScheduleDialog: React.FC<Props> = ({ open, onOpenChange, itemName, total, schedule, isEnglish, disabled, onSave }) => {
  const tr = (fr: string, en: string) => (isEnglish ? en : fr);
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [cashDay, setCashDay] = useState(0);

  useEffect(() => {
    if (!open) return;
    setInstallments(schedule.installments?.length ? schedule.installments.map((i) => ({ ...i })) : [{ amount: 0, due_date: '', paid: false, reminder: false }]);
    setCashDay(Number(schedule.cash_day) || 0);
  }, [open, schedule]);

  const paid = installments.filter((i) => i.paid).reduce((s, i) => s + (Number(i.amount) || 0), 0);
  const remaining = Math.max(total - paid, 0);
  const cash = Math.min(cashDay, remaining);

  const update = (index: number, patch: Partial<Installment>) =>
    setInstallments((prev) => prev.map((inst, i) => (i === index ? { ...inst, ...patch, reminder_sent: patch.due_date !== undefined || patch.reminder !== undefined ? false : inst.reminder_sent } : inst)));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-none max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif">{tr('Échéancier', 'Payment schedule')} · {itemName || '—'}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{tr('Montant total', 'Total amount')} : <strong>{total.toFixed(2)} €</strong></p>

        <div className="space-y-3">
          {installments.map((inst, index) => (
            <fieldset key={index} className="border border-border p-3 space-y-2">
              <legend className="px-1 text-sm font-medium">{tr('Acompte', 'Deposit')} {index + 1}</legend>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor={`amount-${index}`} className="text-xs">{tr('Montant (€)', 'Amount (€)')}</Label>
                  <Input id={`amount-${index}`} type="number" min={0} step="0.01" value={inst.amount || ''} disabled={disabled}
                    onChange={(e) => update(index, { amount: Number(e.target.value) || 0 })} className="h-10 text-base" />
                </div>
                <div>
                  <Label htmlFor={`date-${index}`} className="text-xs">{tr('Échéance', 'Due date')}</Label>
                  <Input id={`date-${index}`} type="date" value={inst.due_date} disabled={disabled}
                    onChange={(e) => update(index, { due_date: e.target.value })} className="h-10 text-base" />
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={inst.paid} disabled={disabled} onCheckedChange={(v) => update(index, { paid: !!v })} />
                  {tr('Payé', 'Paid')}
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-wedding-olive" />
                  {tr('Me relancer par mail', 'Email reminder')}
                  <Switch checked={inst.reminder} disabled={disabled || !inst.due_date} onCheckedChange={(v) => update(index, { reminder: v })} />
                </label>
                <Button variant="ghost" size="icon" aria-label={tr('Supprimer l’acompte', 'Remove deposit')} disabled={disabled}
                  onClick={() => setInstallments((prev) => prev.filter((_, i) => i !== index))}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </fieldset>
          ))}
          {installments.length < MAX_INSTALLMENTS && !disabled && (
            <Button variant="outline" className="rounded-none w-full" onClick={() => setInstallments((prev) => [...prev, { amount: 0, due_date: '', paid: false, reminder: false }])}>
              <Plus className="h-4 w-4 mr-2" /> {tr('Ajouter un acompte', 'Add a deposit')}
            </Button>
          )}
          <p className="text-xs text-muted-foreground">{tr('Le rappel est envoyé 3 jours avant l’échéance au wedding planner et aux mariés si le mariage est partagé.', 'The reminder is emailed 3 days before the due date to the planner and the couple if the wedding is shared.')}</p>
        </div>

        <div className="border-t border-border pt-3 space-y-2 text-sm">
          <p className="flex justify-between"><span>{tr('Déjà payé', 'Already paid')}</span><strong>{paid.toFixed(2)} €</strong></p>
          <p className="flex justify-between"><span>{tr('Reste à payer', 'Remaining')}</span><strong>{remaining.toFixed(2)} €</strong></p>
          <div className="grid grid-cols-2 gap-2 items-end">
            <div>
              <Label htmlFor="cash-day" className="text-xs">{tr('Dont cash le jour J (€)', 'Of which cash on the day (€)')}</Label>
              <Input id="cash-day" type="number" min={0} max={remaining} step="0.01" value={cashDay || ''} disabled={disabled}
                onChange={(e) => setCashDay(Number(e.target.value) || 0)} className="h-10 text-base" />
            </div>
            <p className="text-sm pb-2">{tr('Par virement', 'By transfer')} : <strong>{(remaining - cash).toFixed(2)} €</strong></p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" className="rounded-none" onClick={() => onOpenChange(false)}>{tr('Annuler', 'Cancel')}</Button>
          <Button className="rounded-none bg-wedding-olive hover:bg-wedding-olive/90" disabled={disabled}
            onClick={() => { onSave({ installments: installments.filter((i) => i.amount || i.due_date), cash_day: cash }); onOpenChange(false); }}>
            {tr('Enregistrer', 'Save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentScheduleDialog;
