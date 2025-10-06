-- Fix: Add missing DELETE policy for ai_wedding_conversations
CREATE POLICY "Users can delete their own conversations"
ON public.ai_wedding_conversations
FOR DELETE
USING (auth.uid() = user_id);

-- Create wedding_retroplanning table
CREATE TABLE public.wedding_retroplanning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  wedding_date DATE NOT NULL,
  timeline_data JSONB NOT NULL DEFAULT '[]'::jsonb,
  categories JSONB NOT NULL DEFAULT '[]'::jsonb,
  milestones JSONB NOT NULL DEFAULT '[]'::jsonb,
  progress INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wedding_retroplanning ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own retroplannings"
ON public.wedding_retroplanning
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own retroplannings"
ON public.wedding_retroplanning
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own retroplannings"
ON public.wedding_retroplanning
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own retroplannings"
ON public.wedding_retroplanning
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_wedding_retroplanning_updated_at
BEFORE UPDATE ON public.wedding_retroplanning
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_timestamp();