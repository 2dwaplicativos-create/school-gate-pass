
-- Create readers table for ESP32 management
CREATE TABLE public.readers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL UNIQUE,
  mac TEXT,
  ip TEXT,
  firmware TEXT,
  token TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'blocked')),
  online BOOLEAN NOT NULL DEFAULT false,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  name TEXT,
  location TEXT,
  allowed_start_time TIME,
  allowed_end_time TIME,
  allow_outside_schedule BOOLEAN NOT NULL DEFAULT false,
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  allowed_ip_range TEXT,
  allowed_mac TEXT,
  display_status_message TEXT DEFAULT 'Aguarde o horário de saída',
  display_pre_queue_message TEXT DEFAULT 'Aguarde o horário de saída',
  display_release_message TEXT DEFAULT 'Passe sua TAG e aguarde',
  temporary_message_timeout INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.readers ENABLE ROW LEVEL SECURITY;

-- RLS: public read for heartbeat/register endpoints (via service role), admin manage
CREATE POLICY "Allow all on readers" ON public.readers FOR ALL USING (true) WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_readers_updated_at
  BEFORE UPDATE ON public.readers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.readers;
