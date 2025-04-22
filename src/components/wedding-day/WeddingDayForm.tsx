
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
  isCeremonyReligious: z.boolean().default(false),
  hasPhotoSession: z.boolean().default(true),
  hasCoupleEntrance: z.boolean().default(true),
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
      isCeremonyReligious: false,
      hasPhotoSession: true,
      hasCoupleEntrance: true,
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
              <FormLabel>Durée du trajet entre le lieu de cérémonie et le lieu des festivités (en minutes)</FormLabel>
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
          <h3 className="font-medium">Type de cérémonie et temps forts</h3>
          
          <FormField
            control={form.control}
            name="isCeremonyReligious"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Cérémonie religieuse (1h30) - Si non coché : cérémonie laïque (1h)</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasPhotoSession"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Séance photo</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasCoupleEntrance"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Entrée des mariés</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasSpeeches"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Animations & discours</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasWeddingCake"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
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
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
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
