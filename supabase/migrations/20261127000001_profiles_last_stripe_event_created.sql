-- Unix time (event.created) of the last Stripe subscription event applied to a profile,
-- so that late or replayed webhook deliveries cannot overwrite newer state.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS last_stripe_event_created bigint;
