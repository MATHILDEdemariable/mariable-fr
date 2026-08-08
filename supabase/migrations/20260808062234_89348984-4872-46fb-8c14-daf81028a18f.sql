CREATE TABLE public.guest_albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'Notre album de mariage',
  welcome_message text,
  share_token text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '90 days'),
  media_limit integer NOT NULL DEFAULT 400,
  bytes_limit bigint NOT NULL DEFAULT 32212254720,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.guest_albums TO authenticated;
GRANT ALL ON public.guest_albums TO service_role;
ALTER TABLE public.guest_albums ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage their albums" ON public.guest_albums
FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_guest_albums_updated_at
BEFORE UPDATE ON public.guest_albums
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.guest_album_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid NOT NULL REFERENCES public.guest_albums(id) ON DELETE CASCADE,
  uploader_name text,
  storage_path text NOT NULL,
  thumb_path text,
  mime_type text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  duration_seconds integer,
  kind text NOT NULL DEFAULT 'photo',
  is_hidden boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_guest_album_media_album ON public.guest_album_media(album_id, created_at DESC);

GRANT SELECT, UPDATE, DELETE ON public.guest_album_media TO authenticated;
GRANT ALL ON public.guest_album_media TO service_role;
ALTER TABLE public.guest_album_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage their album media" ON public.guest_album_media
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.guest_albums a WHERE a.id = album_id AND a.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.guest_albums a WHERE a.id = album_id AND a.user_id = auth.uid()));

CREATE TABLE public.guest_album_upload_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid NOT NULL REFERENCES public.guest_albums(id) ON DELETE CASCADE,
  fingerprint text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_guest_album_upload_events_fp ON public.guest_album_upload_events(album_id, fingerprint, created_at DESC);

GRANT ALL ON public.guest_album_upload_events TO service_role;
ALTER TABLE public.guest_album_upload_events ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.validate_guest_album_token(token_value text)
RETURNS TABLE(is_valid boolean, album_id uuid)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF token_value IS NULL THEN
    RETURN QUERY SELECT false, NULL::uuid;
    RETURN;
  END IF;

  RETURN QUERY
  SELECT true, a.id
  FROM public.guest_albums a
  WHERE a.share_token = token_value
    AND a.is_active = true
    AND a.expires_at > now();

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::uuid;
  END IF;
END;
$$;

CREATE POLICY "Album owners read their files" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'guest-album'
  AND EXISTS (
    SELECT 1 FROM public.guest_albums a
    WHERE a.user_id = auth.uid()
      AND (storage.foldername(name))[1] = a.id::text
  )
);

CREATE POLICY "Album owners delete their files" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'guest-album'
  AND EXISTS (
    SELECT 1 FROM public.guest_albums a
    WHERE a.user_id = auth.uid()
      AND (storage.foldername(name))[1] = a.id::text
  )
);