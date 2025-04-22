
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
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <FormLabel>Durée du trajet (en minutes)</FormLabel>
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
              <FormLabel>Cérémonie religieuse</FormLabel>
            </FormItem>
          )}
        />

        <Button type="submit" variant="wedding" className="w-full">
          Générer le planning
        </Button>
      </form>
    </Form>
  );
};
