
-- Students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  class TEXT NOT NULL,
  period TEXT NOT NULL,
  tts_custom_text TEXT,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Guardians table
CREATE TABLE public.guardians (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('PAI','MAE','AVO','TIO','PERUA')),
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo','Inativo')),
  rfid_uid TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Many-to-many: student <-> guardian
CREATE TABLE public.student_guardian (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  guardian_id UUID NOT NULL REFERENCES public.guardians(id) ON DELETE CASCADE,
  UNIQUE(student_id, guardian_id)
);

-- Voice settings
CREATE TABLE public.voice_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  voice_id TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'pt-BR',
  gender TEXT NOT NULL CHECK (gender IN ('masculino','feminino')),
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default PT-BR voices
INSERT INTO public.voice_settings (name, voice_id, language, gender, is_default) VALUES
  ('Daniel (Masculino)', 'onwK4e9ZLuTAKqWW03F9', 'pt-BR', 'masculino', true),
  ('Alice (Feminino)', 'Xb7hH8MSUJpSbSDYk0k2', 'pt-BR', 'feminino', false),
  ('Brian (Masculino)', 'nPczCjzI2devNBz1zQrb', 'pt-BR', 'masculino', false),
  ('Lily (Feminino)', 'pFZP5JQG7iQjIQuC4Bku', 'pt-BR', 'feminino', false);

-- School settings table
CREATE TABLE public.school_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tts_template TEXT NOT NULL DEFAULT 'Atenção {nome} do {serie}',
  recall_block_minutes INTEGER NOT NULL DEFAULT 5,
  call_interval_seconds INTEGER NOT NULL DEFAULT 2,
  default_voice_id UUID REFERENCES public.voice_settings(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_guardian ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;

-- Permissive policies (no auth yet)
CREATE POLICY "Allow all on students" ON public.students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on guardians" ON public.guardians FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on student_guardian" ON public.student_guardian FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on voice_settings" ON public.voice_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on school_settings" ON public.school_settings FOR ALL USING (true) WITH CHECK (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_guardians_updated_at BEFORE UPDATE ON public.guardians FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_school_settings_updated_at BEFORE UPDATE ON public.school_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for audio files
INSERT INTO storage.buckets (id, name, public) VALUES ('student-audio', 'student-audio', true);
CREATE POLICY "Public read student-audio" ON storage.objects FOR SELECT USING (bucket_id = 'student-audio');
CREATE POLICY "Allow upload student-audio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'student-audio');
CREATE POLICY "Allow update student-audio" ON storage.objects FOR UPDATE USING (bucket_id = 'student-audio');
CREATE POLICY "Allow delete student-audio" ON storage.objects FOR DELETE USING (bucket_id = 'student-audio');
