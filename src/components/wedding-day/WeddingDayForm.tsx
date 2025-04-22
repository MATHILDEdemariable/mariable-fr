
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  ceremonyTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Format de l'heure invalide (ex: 15:30)",
  }),
  travelDuration: z.number().min(1).max(120),
  ceremonyType: z.enum(['religieuse', 'laique']),
  hasPhotoSession: z.boolean().default(true),
  hasCoupleEntrance: z.boolean().default(true),
  hasOtherAnimations: z.boolean().default(true),
  hasSpeeches: z.boolean().default(true),
  hasWeddingCake: z.boolean().default(true),
  hasFirstDance: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

interface WeddingDayFormProps {
  onSubmit: (data: FormData) => void;
}

export const WeddingDayForm = ({ onSubmit }: WeddingDayFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ceremonyTime: '',
      travelDuration: 20,
      ceremonyType: 'religieuse',
      hasPhotoSession: true,
      hasCoupleEntrance: true,
      hasOtherAnimations: false,
      hasSpeeches: true,
      hasWeddingCake: true,
      hasFirstDance: true,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="ceremonyTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Heure de la cérémonie officielle</FormLabel>
              <FormControl>
                <Input placeholder="15:30" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="travelDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Durée du trajet entre le lieu de cérémonie et le lieu de réception (en minutes)
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4 border-t pt-4">
          <h3 className="font-medium">Type de cérémonie</h3>
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="ceremonyType"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2">
                  <FormControl>
                    <input
                      type="radio"
                      checked={field.value === 'religieuse'}
                      onChange={() => field.onChange('religieuse')}
                      id="religieuse"
                      className="accent-wedding-olive"
                    />
                  </FormControl>
                  <FormLabel htmlFor="religieuse" className="cursor-pointer">Cérémonie religieuse (1h30)</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ceremonyType"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2">
                  <FormControl>
                    <input
                      type="radio"
                      checked={field.value === 'laique'}
                      onChange={() => field.onChange('laique')}
                      id="laique"
                      className="accent-wedding-olive"
                    />
                  </FormControl>
                  <FormLabel htmlFor="laique" className="cursor-pointer">Cérémonie laïque (1h)</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4 border-t pt-4">
          <h3 className="font-medium">Temps forts facultatifs</h3>
          <FormField
            control={form.control}
            name="hasPhotoSession"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Séance photo (30min)</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hasCoupleEntrance"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Entrée des mariés</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hasOtherAnimations"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Animations autres (discours, intervention surprise...)</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hasSpeeches"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Discours des proches</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hasWeddingCake"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Pièce montée</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hasFirstDance"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Danse des mariés</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" variant="wedding" className="w-full">
          Générer le planning
        </Button>
      </form>
    </Form>
  );
};
