import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, RefreshCw, Trash2, Check, X, Shield, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReaderConfig {
  id?: string;
  modo_adocao: string;
  validade_codigo_minutos: number;
  aprovacao_automatica: boolean;
  rotacionar_token: boolean;
  faixa_ip_permitida: string;
  horario_permitido_inicio: string;
  horario_permitido_fim: string;
}

interface PendingReader {
  id: string;
  serial_dispositivo: string;
  ip: string;
  data_solicitacao: string;
  status: string;
}

export default function ReadersSettings() {
  const [config, setConfig] = useState<ReaderConfig>({
    modo_adocao: "MANUAL", validade_codigo_minutos: 10, aprovacao_automatica: false,
    rotacionar_token: false, faixa_ip_permitida: "", horario_permitido_inicio: "06:00",
    horario_permitido_fim: "22:00",
  });
  const [pending, setPending] = useState<PendingReader[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const [cfg, pend] = await Promise.all([
      supabase.from("reader_settings").select("*").limit(1).single(),
      supabase.from("pending_readers").select("*").eq("status", "PENDENTE").order("data_solicitacao", { ascending: false }),
    ]);
    if (cfg.data) setConfig({ ...cfg.data });
    if (pend.data) setPending(pend.data);
  };

  const update = (field: keyof ReaderConfig, value: any) => setConfig((p) => ({ ...p, [field]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const { id, ...payload } = config;
      if (id) {
        await supabase.from("reader_settings").update(payload).eq("id", id);
      } else {
        await supabase.from("reader_settings").insert(payload);
      }
      toast.success("Configurações de leitores salvas!");
      fetchAll();
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePending = async (id: string, status: string) => {
    await supabase.from("pending_readers").update({ status }).eq("id", id);
    toast.success(status === "APROVADO" ? "Leitor aprovado!" : "Leitor rejeitado!");
    fetchAll();
  };

  return (
    <div className="space-y-6">
      {/* Adoption */}
      <Card className="border-0 shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground">Adoção de Leitores</h2>
        <Separator className="my-4" />
        <div className="grid gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Modo de Adoção</Label>
              <Select value={config.modo_adocao} onValueChange={(v) => update("modo_adocao", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MANUAL">Manual</SelectItem>
                  <SelectItem value="CODIGO">Por Código</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Validade do Código (min)</Label>
              <Input type="number" value={config.validade_codigo_minutos} onChange={(e) => update("validade_codigo_minutos", Number(e.target.value))} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Switch checked={config.aprovacao_automatica} onCheckedChange={(v) => update("aprovacao_automatica", v)} />
            <Label>Aprovação automática de novos leitores</Label>
          </div>
        </div>
      </Card>

      {/* Pending */}
      {pending.length > 0 && (
        <Card className="border-0 shadow-card p-6">
          <h2 className="text-base font-semibold text-foreground">Dispositivos Pendentes</h2>
          <Separator className="my-4" />
          <div className="space-y-2">
            {pending.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono text-xs">{p.serial_dispositivo}</Badge>
                  <span className="text-sm text-muted-foreground">{p.ip}</span>
                  <span className="text-xs text-muted-foreground">{new Date(p.data_solicitacao).toLocaleString("pt-BR")}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-8 gap-1 text-primary" onClick={() => handlePending(p.id, "APROVADO")}><Check className="h-3.5 w-3.5" /> Aprovar</Button>
                  <Button size="sm" variant="ghost" className="h-8 gap-1 text-destructive" onClick={() => handlePending(p.id, "REJEITADO")}><X className="h-3.5 w-3.5" /> Rejeitar</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Security */}
      <Card className="border-0 shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2"><Shield className="h-4 w-4" /> Segurança do Leitor</h2>
        <Separator className="my-4" />
        <div className="grid gap-5">
          <div className="flex items-center gap-4">
            <Switch checked={config.rotacionar_token} onCheckedChange={(v) => update("rotacionar_token", v)} />
            <Label>Rotacionar token de autenticação</Label>
          </div>
          <div className="grid gap-2">
            <Label>Faixa de IP permitida</Label>
            <Input value={config.faixa_ip_permitida} onChange={(e) => update("faixa_ip_permitida", e.target.value)} placeholder="Ex: 192.168.1.0/24" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Horário Permitido Início</Label>
              <Input type="time" value={config.horario_permitido_inicio} onChange={(e) => update("horario_permitido_inicio", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Horário Permitido Fim</Label>
              <Input type="time" value={config.horario_permitido_fim} onChange={(e) => update("horario_permitido_fim", e.target.value)} />
            </div>
          </div>
        </div>
      </Card>

      <Button className="gradient-primary text-primary-foreground shadow-soft gap-2" onClick={save} disabled={saving}>
        <Save className="h-4 w-4" /> {saving ? "Salvando..." : "Salvar Configurações de Leitores"}
      </Button>
    </div>
  );
}
