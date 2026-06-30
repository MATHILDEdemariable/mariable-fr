DROP FUNCTION IF EXISTS public.set_jeunes_maries_slug() CASCADE;
DROP FUNCTION IF EXISTS public.generate_jeunes_maries_slug(text, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.notify_new_jeune_marie() CASCADE;
DROP TABLE IF EXISTS public.jeunes_maries CASCADE;

ALTER TABLE public.wedding_documents
  DROP COLUMN IF EXISTS ai_summary,
  DROP COLUMN IF EXISTS ai_key_points,
  DROP COLUMN IF EXISTS is_analyzed;