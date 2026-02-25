
-- 1. General Settings (singleton)
CREATE TABLE public.general_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_escola text NOT NULL DEFAULT '',
  logo_escola_url text,
  endereco text DEFAULT '',
  telefone text DEFAULT '',
  fuso_horario text NOT NULL DEFAULT 'America/Sao_Paulo',
  idioma text NOT NULL DEFAULT 'pt-BR',
  formato_data text NOT NULL DEFAULT 'DD/MM/YYYY',
  volume_padrao integer NOT NULL DEFAULT 80,
  intervalo_padrao_chamadas_segundos integer NOT NULL DEFAULT 2,
  tempo_maximo_fila integer NOT NULL DEFAULT 30,
  modo_silencioso boolean NOT NULL DEFAULT false,
  horario_funcionamento_inicio time NOT NULL DEFAULT '07:00',
  horario_funcionamento_fim time NOT NULL DEFAULT '18:00',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.general_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on general_settings" ON public.general_settings FOR ALL USING (true) WITH CHECK (true);

-- 2. Network Settings (singleton)
CREATE TABLE public.network_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  modo_rede text NOT NULL DEFAULT 'DHCP',
  ip text DEFAULT '',
  mascara_subrede text DEFAULT '255.255.255.0',
  gateway text DEFAULT '',
  dns_primario text DEFAULT '8.8.8.8',
  dns_secundario text DEFAULT '8.8.4.4',
  ip_atual text DEFAULT '',
  gateway_atual text DEFAULT '',
  dns_atual text DEFAULT '',
  nome_servidor text DEFAULT 'api.escola.local',
  habilitar_mdns boolean NOT NULL DEFAULT false,
  habilitar_dns_interno boolean NOT NULL DEFAULT false,
  habilitar_dhcp boolean NOT NULL DEFAULT false,
  dhcp_faixa_inicial text DEFAULT '',
  dhcp_faixa_final text DEFAULT '',
  dhcp_tempo_lease_minutos integer NOT NULL DEFAULT 60,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.network_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on network_settings" ON public.network_settings FOR ALL USING (true) WITH CHECK (true);

-- DNS Records
CREATE TABLE public.dns_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hostname text NOT NULL,
  ip text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.dns_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on dns_records" ON public.dns_records FOR ALL USING (true) WITH CHECK (true);

-- DHCP Reservations
CREATE TABLE public.dhcp_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_dispositivo text NOT NULL,
  mac_address text NOT NULL,
  ip_reservado text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.dhcp_reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on dhcp_reservations" ON public.dhcp_reservations FOR ALL USING (true) WITH CHECK (true);

-- 3. Reader Settings (adoption & security config - singleton)
CREATE TABLE public.reader_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  modo_adocao text NOT NULL DEFAULT 'MANUAL',
  validade_codigo_minutos integer NOT NULL DEFAULT 10,
  aprovacao_automatica boolean NOT NULL DEFAULT false,
  rotacionar_token boolean NOT NULL DEFAULT false,
  faixa_ip_permitida text DEFAULT '',
  horario_permitido_inicio time DEFAULT '06:00',
  horario_permitido_fim time DEFAULT '22:00',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reader_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on reader_settings" ON public.reader_settings FOR ALL USING (true) WITH CHECK (true);

-- Pending Reader Devices
CREATE TABLE public.pending_readers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_dispositivo text NOT NULL,
  ip text NOT NULL,
  data_solicitacao timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'PENDENTE'
);

ALTER TABLE public.pending_readers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on pending_readers" ON public.pending_readers FOR ALL USING (true) WITH CHECK (true);

-- 4. Audio Settings (singleton)
CREATE TABLE public.audio_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dispositivo_saida text NOT NULL DEFAULT 'P2',
  volume_maximo integer NOT NULL DEFAULT 100,
  intervalo_entre_chamadas_segundos integer NOT NULL DEFAULT 2,
  permitir_sobreposicao boolean NOT NULL DEFAULT false,
  tamanho_maximo_fila integer NOT NULL DEFAULT 50,
  prioridade_normal integer NOT NULL DEFAULT 1,
  prioridade_transporte integer NOT NULL DEFAULT 2,
  prioridade_emergencia integer NOT NULL DEFAULT 3,
  emergencia_interrompe_fila boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.audio_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on audio_settings" ON public.audio_settings FOR ALL USING (true) WITH CHECK (true);

-- 5. Transports
CREATE TABLE public.transports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_transporte text NOT NULL,
  nome_motorista text DEFAULT '',
  chamada_em_grupo boolean NOT NULL DEFAULT false,
  audio_prefixo_grupo text DEFAULT '',
  nivel_prioridade integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.transports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on transports" ON public.transports FOR ALL USING (true) WITH CHECK (true);

-- 6. RFID Settings (singleton)
CREATE TABLE public.rfid_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_cartao_suportado text NOT NULL DEFAULT 'MIFARE',
  tamanho_uid integer NOT NULL DEFAULT 4,
  permitir_multiplos_cartoes boolean NOT NULL DEFAULT false,
  bloquear_uid_duplicado boolean NOT NULL DEFAULT true,
  max_tentativas_invalidas integer NOT NULL DEFAULT 5,
  tempo_bloqueio_minutos integer NOT NULL DEFAULT 10,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.rfid_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on rfid_settings" ON public.rfid_settings FOR ALL USING (true) WITH CHECK (true);

-- 7. Security Settings (singleton)
CREATE TABLE public.security_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tempo_sessao_minutos integer NOT NULL DEFAULT 30,
  habilitar_2fa boolean NOT NULL DEFAULT false,
  tamanho_minimo_senha integer NOT NULL DEFAULT 8,
  exigir_caractere_especial boolean NOT NULL DEFAULT true,
  faixa_ip_admin_permitido text DEFAULT '',
  nivel_log text NOT NULL DEFAULT 'BASICO',
  dias_retencao_logs integer NOT NULL DEFAULT 90,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on security_settings" ON public.security_settings FOR ALL USING (true) WITH CHECK (true);

-- 8. Backup Settings (singleton)
CREATE TABLE public.backup_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habilitar_backup_automatico boolean NOT NULL DEFAULT false,
  frequencia_backup text NOT NULL DEFAULT 'DIARIO',
  horario_backup time NOT NULL DEFAULT '02:00',
  destino_backup text NOT NULL DEFAULT 'LOCAL',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.backup_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on backup_settings" ON public.backup_settings FOR ALL USING (true) WITH CHECK (true);

-- User Roles (for permission system)
CREATE TYPE public.app_role AS ENUM ('admin', 'operador', 'visualizador');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
