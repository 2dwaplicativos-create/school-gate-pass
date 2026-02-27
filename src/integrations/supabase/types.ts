export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audio_settings: {
        Row: {
          created_at: string
          dispositivo_saida: string
          emergencia_interrompe_fila: boolean
          id: string
          intervalo_entre_chamadas_segundos: number
          permitir_sobreposicao: boolean
          prioridade_emergencia: number
          prioridade_normal: number
          prioridade_transporte: number
          tamanho_maximo_fila: number
          updated_at: string
          volume_maximo: number
        }
        Insert: {
          created_at?: string
          dispositivo_saida?: string
          emergencia_interrompe_fila?: boolean
          id?: string
          intervalo_entre_chamadas_segundos?: number
          permitir_sobreposicao?: boolean
          prioridade_emergencia?: number
          prioridade_normal?: number
          prioridade_transporte?: number
          tamanho_maximo_fila?: number
          updated_at?: string
          volume_maximo?: number
        }
        Update: {
          created_at?: string
          dispositivo_saida?: string
          emergencia_interrompe_fila?: boolean
          id?: string
          intervalo_entre_chamadas_segundos?: number
          permitir_sobreposicao?: boolean
          prioridade_emergencia?: number
          prioridade_normal?: number
          prioridade_transporte?: number
          tamanho_maximo_fila?: number
          updated_at?: string
          volume_maximo?: number
        }
        Relationships: []
      }
      backup_settings: {
        Row: {
          created_at: string
          destino_backup: string
          frequencia_backup: string
          habilitar_backup_automatico: boolean
          horario_backup: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          destino_backup?: string
          frequencia_backup?: string
          habilitar_backup_automatico?: boolean
          horario_backup?: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          destino_backup?: string
          frequencia_backup?: string
          habilitar_backup_automatico?: boolean
          horario_backup?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      dhcp_reservations: {
        Row: {
          created_at: string
          id: string
          ip_reservado: string
          mac_address: string
          nome_dispositivo: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_reservado: string
          mac_address: string
          nome_dispositivo: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_reservado?: string
          mac_address?: string
          nome_dispositivo?: string
        }
        Relationships: []
      }
      dns_records: {
        Row: {
          created_at: string
          hostname: string
          id: string
          ip: string
        }
        Insert: {
          created_at?: string
          hostname: string
          id?: string
          ip: string
        }
        Update: {
          created_at?: string
          hostname?: string
          id?: string
          ip?: string
        }
        Relationships: []
      }
      general_settings: {
        Row: {
          created_at: string
          endereco: string | null
          formato_data: string
          fuso_horario: string
          horario_funcionamento_fim: string
          horario_funcionamento_inicio: string
          id: string
          idioma: string
          intervalo_padrao_chamadas_segundos: number
          logo_escola_url: string | null
          modo_silencioso: boolean
          nome_escola: string
          telefone: string | null
          tempo_maximo_fila: number
          updated_at: string
          volume_padrao: number
        }
        Insert: {
          created_at?: string
          endereco?: string | null
          formato_data?: string
          fuso_horario?: string
          horario_funcionamento_fim?: string
          horario_funcionamento_inicio?: string
          id?: string
          idioma?: string
          intervalo_padrao_chamadas_segundos?: number
          logo_escola_url?: string | null
          modo_silencioso?: boolean
          nome_escola?: string
          telefone?: string | null
          tempo_maximo_fila?: number
          updated_at?: string
          volume_padrao?: number
        }
        Update: {
          created_at?: string
          endereco?: string | null
          formato_data?: string
          fuso_horario?: string
          horario_funcionamento_fim?: string
          horario_funcionamento_inicio?: string
          id?: string
          idioma?: string
          intervalo_padrao_chamadas_segundos?: number
          logo_escola_url?: string | null
          modo_silencioso?: boolean
          nome_escola?: string
          telefone?: string | null
          tempo_maximo_fila?: number
          updated_at?: string
          volume_padrao?: number
        }
        Relationships: []
      }
      guardians: {
        Row: {
          created_at: string
          id: string
          name: string
          phone: string | null
          rfid_uid: string | null
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          phone?: string | null
          rfid_uid?: string | null
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          rfid_uid?: string | null
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      network_settings: {
        Row: {
          created_at: string
          dhcp_faixa_final: string | null
          dhcp_faixa_inicial: string | null
          dhcp_tempo_lease_minutos: number
          dns_atual: string | null
          dns_primario: string | null
          dns_secundario: string | null
          gateway: string | null
          gateway_atual: string | null
          habilitar_dhcp: boolean
          habilitar_dns_interno: boolean
          habilitar_mdns: boolean
          id: string
          ip: string | null
          ip_atual: string | null
          mascara_subrede: string | null
          modo_rede: string
          nome_servidor: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          dhcp_faixa_final?: string | null
          dhcp_faixa_inicial?: string | null
          dhcp_tempo_lease_minutos?: number
          dns_atual?: string | null
          dns_primario?: string | null
          dns_secundario?: string | null
          gateway?: string | null
          gateway_atual?: string | null
          habilitar_dhcp?: boolean
          habilitar_dns_interno?: boolean
          habilitar_mdns?: boolean
          id?: string
          ip?: string | null
          ip_atual?: string | null
          mascara_subrede?: string | null
          modo_rede?: string
          nome_servidor?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          dhcp_faixa_final?: string | null
          dhcp_faixa_inicial?: string | null
          dhcp_tempo_lease_minutos?: number
          dns_atual?: string | null
          dns_primario?: string | null
          dns_secundario?: string | null
          gateway?: string | null
          gateway_atual?: string | null
          habilitar_dhcp?: boolean
          habilitar_dns_interno?: boolean
          habilitar_mdns?: boolean
          id?: string
          ip?: string | null
          ip_atual?: string | null
          mascara_subrede?: string | null
          modo_rede?: string
          nome_servidor?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      pending_readers: {
        Row: {
          data_solicitacao: string
          id: string
          ip: string
          serial_dispositivo: string
          status: string
        }
        Insert: {
          data_solicitacao?: string
          id?: string
          ip: string
          serial_dispositivo: string
          status?: string
        }
        Update: {
          data_solicitacao?: string
          id?: string
          ip?: string
          serial_dispositivo?: string
          status?: string
        }
        Relationships: []
      }
      reader_settings: {
        Row: {
          aprovacao_automatica: boolean
          created_at: string
          faixa_ip_permitida: string | null
          horario_permitido_fim: string | null
          horario_permitido_inicio: string | null
          id: string
          modo_adocao: string
          rotacionar_token: boolean
          updated_at: string
          validade_codigo_minutos: number
        }
        Insert: {
          aprovacao_automatica?: boolean
          created_at?: string
          faixa_ip_permitida?: string | null
          horario_permitido_fim?: string | null
          horario_permitido_inicio?: string | null
          id?: string
          modo_adocao?: string
          rotacionar_token?: boolean
          updated_at?: string
          validade_codigo_minutos?: number
        }
        Update: {
          aprovacao_automatica?: boolean
          created_at?: string
          faixa_ip_permitida?: string | null
          horario_permitido_fim?: string | null
          horario_permitido_inicio?: string | null
          id?: string
          modo_adocao?: string
          rotacionar_token?: boolean
          updated_at?: string
          validade_codigo_minutos?: number
        }
        Relationships: []
      }
      readers: {
        Row: {
          allow_outside_schedule: boolean
          allowed_end_time: string | null
          allowed_ip_range: string | null
          allowed_mac: string | null
          allowed_start_time: string | null
          created_at: string
          device_id: string
          display_pre_queue_message: string | null
          display_release_message: string | null
          display_status_message: string | null
          firmware: string | null
          id: string
          ip: string | null
          last_seen: string | null
          location: string | null
          mac: string | null
          maintenance_mode: boolean
          name: string | null
          online: boolean
          status: string
          temporary_message_timeout: number
          token: string | null
          updated_at: string
        }
        Insert: {
          allow_outside_schedule?: boolean
          allowed_end_time?: string | null
          allowed_ip_range?: string | null
          allowed_mac?: string | null
          allowed_start_time?: string | null
          created_at?: string
          device_id: string
          display_pre_queue_message?: string | null
          display_release_message?: string | null
          display_status_message?: string | null
          firmware?: string | null
          id?: string
          ip?: string | null
          last_seen?: string | null
          location?: string | null
          mac?: string | null
          maintenance_mode?: boolean
          name?: string | null
          online?: boolean
          status?: string
          temporary_message_timeout?: number
          token?: string | null
          updated_at?: string
        }
        Update: {
          allow_outside_schedule?: boolean
          allowed_end_time?: string | null
          allowed_ip_range?: string | null
          allowed_mac?: string | null
          allowed_start_time?: string | null
          created_at?: string
          device_id?: string
          display_pre_queue_message?: string | null
          display_release_message?: string | null
          display_status_message?: string | null
          firmware?: string | null
          id?: string
          ip?: string | null
          last_seen?: string | null
          location?: string | null
          mac?: string | null
          maintenance_mode?: boolean
          name?: string | null
          online?: boolean
          status?: string
          temporary_message_timeout?: number
          token?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rfid_settings: {
        Row: {
          bloquear_uid_duplicado: boolean
          created_at: string
          id: string
          max_tentativas_invalidas: number
          permitir_multiplos_cartoes: boolean
          tamanho_uid: number
          tempo_bloqueio_minutos: number
          tipo_cartao_suportado: string
          updated_at: string
        }
        Insert: {
          bloquear_uid_duplicado?: boolean
          created_at?: string
          id?: string
          max_tentativas_invalidas?: number
          permitir_multiplos_cartoes?: boolean
          tamanho_uid?: number
          tempo_bloqueio_minutos?: number
          tipo_cartao_suportado?: string
          updated_at?: string
        }
        Update: {
          bloquear_uid_duplicado?: boolean
          created_at?: string
          id?: string
          max_tentativas_invalidas?: number
          permitir_multiplos_cartoes?: boolean
          tamanho_uid?: number
          tempo_bloqueio_minutos?: number
          tipo_cartao_suportado?: string
          updated_at?: string
        }
        Relationships: []
      }
      school_settings: {
        Row: {
          call_interval_seconds: number
          created_at: string
          default_voice_id: string | null
          id: string
          recall_block_minutes: number
          tts_template: string
          updated_at: string
        }
        Insert: {
          call_interval_seconds?: number
          created_at?: string
          default_voice_id?: string | null
          id?: string
          recall_block_minutes?: number
          tts_template?: string
          updated_at?: string
        }
        Update: {
          call_interval_seconds?: number
          created_at?: string
          default_voice_id?: string | null
          id?: string
          recall_block_minutes?: number
          tts_template?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_settings_default_voice_id_fkey"
            columns: ["default_voice_id"]
            isOneToOne: false
            referencedRelation: "voice_settings"
            referencedColumns: ["id"]
          },
        ]
      }
      security_settings: {
        Row: {
          created_at: string
          dias_retencao_logs: number
          exigir_caractere_especial: boolean
          faixa_ip_admin_permitido: string | null
          habilitar_2fa: boolean
          id: string
          nivel_log: string
          tamanho_minimo_senha: number
          tempo_sessao_minutos: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          dias_retencao_logs?: number
          exigir_caractere_especial?: boolean
          faixa_ip_admin_permitido?: string | null
          habilitar_2fa?: boolean
          id?: string
          nivel_log?: string
          tamanho_minimo_senha?: number
          tempo_sessao_minutos?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          dias_retencao_logs?: number
          exigir_caractere_especial?: boolean
          faixa_ip_admin_permitido?: string | null
          habilitar_2fa?: boolean
          id?: string
          nivel_log?: string
          tamanho_minimo_senha?: number
          tempo_sessao_minutos?: number
          updated_at?: string
        }
        Relationships: []
      }
      student_guardian: {
        Row: {
          guardian_id: string
          id: string
          student_id: string
        }
        Insert: {
          guardian_id: string
          id?: string
          student_id: string
        }
        Update: {
          guardian_id?: string
          id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_guardian_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_guardian_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          audio_url: string | null
          class: string
          created_at: string
          grade: string
          id: string
          name: string
          period: string
          tts_custom_text: string | null
          updated_at: string
        }
        Insert: {
          audio_url?: string | null
          class: string
          created_at?: string
          grade: string
          id?: string
          name: string
          period: string
          tts_custom_text?: string | null
          updated_at?: string
        }
        Update: {
          audio_url?: string | null
          class?: string
          created_at?: string
          grade?: string
          id?: string
          name?: string
          period?: string
          tts_custom_text?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      transports: {
        Row: {
          audio_prefixo_grupo: string | null
          chamada_em_grupo: boolean
          created_at: string
          id: string
          nivel_prioridade: number
          nome_motorista: string | null
          nome_transporte: string
          updated_at: string
        }
        Insert: {
          audio_prefixo_grupo?: string | null
          chamada_em_grupo?: boolean
          created_at?: string
          id?: string
          nivel_prioridade?: number
          nome_motorista?: string | null
          nome_transporte: string
          updated_at?: string
        }
        Update: {
          audio_prefixo_grupo?: string | null
          chamada_em_grupo?: boolean
          created_at?: string
          id?: string
          nivel_prioridade?: number
          nome_motorista?: string | null
          nome_transporte?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      voice_settings: {
        Row: {
          created_at: string
          gender: string
          id: string
          is_default: boolean
          language: string
          name: string
          voice_id: string
        }
        Insert: {
          created_at?: string
          gender: string
          id?: string
          is_default?: boolean
          language?: string
          name: string
          voice_id: string
        }
        Update: {
          created_at?: string
          gender?: string
          id?: string
          is_default?: boolean
          language?: string
          name?: string
          voice_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "operador" | "visualizador"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "operador", "visualizador"],
    },
  },
} as const
