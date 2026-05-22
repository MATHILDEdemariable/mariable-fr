ALTER TABLE public.coordination_documents 
  ADD COLUMN IF NOT EXISTS source_document_id uuid REFERENCES public.wedding_documents(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_coord_docs_source ON public.coordination_documents(source_document_id);

ALTER TABLE public.coordination_planning 
  ADD COLUMN IF NOT EXISTS event_day text NOT NULL DEFAULT 'Jour J';
CREATE INDEX IF NOT EXISTS idx_coord_planning_day ON public.coordination_planning(coordination_id, event_day);