ALTER TABLE public.budgets_detail
  ADD COLUMN IF NOT EXISTS quantity integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS unit_price numeric NOT NULL DEFAULT 0;

UPDATE public.budgets_detail
SET unit_price = COALESCE(estimated, 0), quantity = 1
WHERE unit_price = 0;