ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS audience text NOT NULL DEFAULT 'couple';

ALTER TABLE public.blog_posts
  DROP CONSTRAINT IF EXISTS blog_posts_audience_check;

ALTER TABLE public.blog_posts
  ADD CONSTRAINT blog_posts_audience_check CHECK (audience IN ('couple','pro'));

CREATE INDEX IF NOT EXISTS blog_posts_audience_idx ON public.blog_posts (audience);