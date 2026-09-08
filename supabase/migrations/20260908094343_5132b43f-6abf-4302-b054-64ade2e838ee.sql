ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_subscription_type_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_subscription_type_check CHECK (subscription_type = ANY (ARRAY['free'::text, 'premium'::text, 'pro_premium'::text]));

CREATE OR REPLACE FUNCTION public.is_user_premium(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_uuid
      AND subscription_type IN ('premium', 'pro_premium')
      AND (subscription_expires_at IS NULL OR subscription_expires_at > NOW())
  );
END;
$function$;