import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Shield, FileText, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SecurityData {
  id?: string;
  tempo_sessao_minutos: number;
  habilitar_2fa: boolean;
  tamanho_minimo_senha: number;
  exigir_caractere_especial: boolean;
  faixa_ip_admin_permitido: string;
  nivel_log: string;
  dias_retencao_logs: number;
}

export default function SecuritySettings() {
  const [data, setData] = useState<SecurityData>({
    tempo_sessao_minutos: 30, habilitar_2fa: false, tamanho_minimo_senha: 8,
    exigir_caractere_especial: true, faixa_ip_admin_permitido: "",
    nivel_log: "BASICO", dias_retencao_logs: 90,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("security_settings").select("*").limit(1).single().then(({ data: row }) => {
      if (row) setData({ ...row });
    });
  }, []);

  const update = (field: keyof SecurityData, value: any) => setData((p) => ({ ...p, [field]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const { id, ...payload } = data;
      if (id) {
        await supabase.from("security_settings").update(payload).eq("id", id);
      } else {
        await supabase.from("security_settings").insert(payload);
      }
      toast.success("Configurações de segurança salvas!");
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Auth */}
      <Card className="border-0 shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2"><Shield className="h-4 w-4" /> Autenticação</h2>
        <Separator className="my-4" />
        <div className="grid gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Tempo de sessão (min)</Label>
              <Input type="number" value={data.tempo_sessao_minutos} onChange={(e) => update("tempo_sessao_minutos", Number(e.target.value))} />
            </div>
            <div className="grid gap-2">
              <Label>Tamanho mínimo de senha</Label>
              <Input type="number" value={data.tamanho_minimo_senha} onChange={(e) => update("tamanho_minimo_senha", Number(e.target.value))} />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Switch checked={data.habilitar_2fa} onCheckedChange={(v) => update("habilitar_2fa", v)} />
              <Label>Habilitar autenticação em 2 fatores (2FA)</Label>
            </div>
            <div className="flex items-center gap-4">
              <Switch checked={data.exigir_caractere_especial} onCheckedChange={(v) => update("exigir_caractere_especial", v)} />
              <Label>Exigir caractere especial na senha</Label>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Faixa de IP permitida para admin</Label>
            <Input value={data.faixa_ip_admin_permitido} onChange={(e) => update("faixa_ip_admin_permitido", e.target.value)} placeholder="Ex: 192.168.1.0/24 (vazio = qualquer)" />
          </div>
        </div>
      </Card>

      {/* Logs */}
      <Card className="border-0 shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2"><FileText className="h-4 w-4" /> Logs do Sistema</h2>
        <Separator className="my-4" />
        <div className="grid gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Nível de Log</Label>
              <Select value={data.nivel_log} onValueChange={(v) => update("nivel_log", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="BASICO">Básico</SelectItem>
                  <SelectItem value="AVANCADO">Avançado</SelectItem>
                  <SelectItem value="DEBUG">Debug</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Dias de retenção de logs</Label>
              <Input type="number" value={data.dias_retencao_logs} onChange={(e) => update("dias_retencao_logs", Number(e.target.value))} />
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-fit gap-2"><Download className="h-3.5 w-3.5" /> Exportar Logs</Button>
        </div>
      </Card>

      <Button className="gradient-primary text-primary-foreground shadow-soft gap-2" onClick={save} disabled={saving}>
        <Save className="h-4 w-4" /> {saving ? "Salvando..." : "Salvar Configurações de Segurança"}
      </Button>
    </div>
  );
}
