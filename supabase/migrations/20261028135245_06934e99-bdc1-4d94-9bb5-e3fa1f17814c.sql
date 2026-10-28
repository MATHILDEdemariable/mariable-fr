ALTER TABLE public.seating_tables DROP CONSTRAINT seating_tables_shape_check;
ALTER TABLE public.seating_tables ADD CONSTRAINT seating_tables_shape_check CHECK (shape = ANY (ARRAY['round','rectangle','oval','standing','serpentine']));
ALTER TABLE public.seating_tables DROP CONSTRAINT seating_tables_capacity_check;
ALTER TABLE public.seating_tables ADD CONSTRAINT seating_tables_capacity_check CHECK (capacity >= 2 AND capacity <= 30);