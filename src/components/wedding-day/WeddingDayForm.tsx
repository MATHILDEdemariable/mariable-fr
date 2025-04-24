
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const formSchema = z.object({
  ceremonyTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Format de l'heure invalide (ex: 15:30)",
  }),
  travelDuration: z.number().min(1).max(120),
  ceremonyType: z.enum(['religieuse', 'laique']),
  hasPhotoSession: z.boolean().default(true),
  hasCoupleEntrance: z.boolean().default(true),
  hasOtherAnimations: z.boolean().default(false),
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
          <RadioGroup
            defaultValue={form.getValues('ceremonyType')}
            onValueChange={(value) => form.setValue('ceremonyType', value as 'religieuse' | 'laique')}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="religieuse" id="religieuse" />
              <FormLabel htmlFor="religieuse" className="cursor-pointer">Cérémonie religieuse (1h30)</FormLabel>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="laique" id="laique" />
              <FormLabel htmlFor="laique" className="cursor-pointer">Cérémonie laïque (1h)</FormLabel>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4 border-t pt-4">
          <h3 className="font-medium">Temps forts à inclure</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="hasPhotoSession"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm"
                  data-selected={field.value ? "true" : "false"}
                  data-highlight="true">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">
                      📷 Séance photo groupe
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Pendant le cocktail (30min)
                    </p>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hasCoupleEntrance"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm"
                  data-selected={field.value ? "true" : "false"}
                  data-highlight="true">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">
                      🎉 Entrée des mariés
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Avant le dîner (5min)
                    </p>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hasOtherAnimations"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm"
                  data-selected={field.value ? "true" : "false"}
                  data-highlight="true">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">
                      🗣️ Animations pendant le dîner
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Discours, surprises (20-30min)
                    </p>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hasWeddingCake"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm"
                  data-selected={field.value ? "true" : "false"}
                  data-highlight="true">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">
                      🍰 Pièce montée
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Fin du dîner (10min)
                    </p>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hasFirstDance"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm"
                  data-selected={field.value ? "true" : "false"}
                  data-highlight="true">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">
                      💃 Danse des mariés
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Ouverture du bal (après dîner)
                    </p>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" variant="wedding" className="w-full">
          Générer le planning
        </Button>
      </form>
    </Form>
  );
};
