
-- Function to mark readers offline if no heartbeat in 60 seconds
CREATE OR REPLACE FUNCTION public.mark_offline_readers()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.readers
  SET online = false
  WHERE online = true
    AND last_seen < (now() - interval '60 seconds');
END;
$$;
