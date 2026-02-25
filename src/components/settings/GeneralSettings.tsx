import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const fusoHorarios = [
  "America/Sao_Paulo", "America/Manaus", "America/Belem", "America/Fortaleza",
  "America/Recife", "America/Cuiaba", "America/Porto_Velho", "America/Rio_Branco",
];

const idiomas = [
  { value: "pt-BR", label: "Português (Brasil)" },
  { value: "en-US", label: "English (US)" },
  { value: "es", label: "Español" },
];

const formatosData = [
  { value: "DD/MM/YYYY", label: "DD/MM/AAAA" },
  { value: "MM/DD/YYYY", label: "MM/DD/AAAA" },
  { value: "YYYY-MM-DD", label: "AAAA-MM-DD" },
];

interface GeneralData {
  id?: string;
  nome_escola: string;
  logo_escola_url: string | null;
  endereco: string;
  telefone: string;
  fuso_horario: string;
  idioma: string;
  formato_data: string;
  volume_padrao: number;
  intervalo_padrao_chamadas_segundos: number;
  tempo_maximo_fila: number;
  modo_silencioso: boolean;
  horario_funcionamento_inicio: string;
  horario_funcionamento_fim: string;
}

const defaults: GeneralData = {
  nome_escola: "",
  logo_escola_url: null,
  endereco: "",
  telefone: "",
  fuso_horario: "America/Sao_Paulo",
  idioma: "pt-BR",
  formato_data: "DD/MM/YYYY",
  volume_padrao: 80,
  intervalo_padrao_chamadas_segundos: 2,
  tempo_maximo_fila: 30,
  modo_silencioso: false,
  horario_funcionamento_inicio: "07:00",
  horario_funcionamento_fim: "18:00",
};

export default function GeneralSettings() {
  const [data, setData] = useState<GeneralData>(defaults);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: row } = await supabase.from("general_settings").select("*").limit(1).single();
    if (row) {
      setData({
        id: row.id,
        nome_escola: row.nome_escola,
        logo_escola_url: row.logo_escola_url,
        endereco: row.endereco || "",
        telefone: row.telefone || "",
        fuso_horario: row.fuso_horario,
        idioma: row.idioma,
        formato_data: row.formato_data,
        volume_padrao: row.volume_padrao,
        intervalo_padrao_chamadas_segundos: row.intervalo_padrao_chamadas_segundos,
        tempo_maximo_fila: row.tempo_maximo_fila,
        modo_silencioso: row.modo_silencioso,
        horario_funcionamento_inicio: row.horario_funcionamento_inicio,
        horario_funcionamento_fim: row.horario_funcionamento_fim,
      });
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const { id, ...payload } = data;
      if (id) {
        await supabase.from("general_settings").update(payload).eq("id", id);
      } else {
        await supabase.from("general_settings").insert(payload);
      }
      toast.success("Configurações gerais salvas!");
      fetchData();
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const update = (field: keyof GeneralData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground">Dados da Escola</h2>
        <Separator className="my-4" />
        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label>Nome da Escola</Label>
            <Input value={data.nome_escola} onChange={(e) => update("nome_escola", e.target.value)} placeholder="Ex: Colégio São José" />
          </div>
          <div className="grid gap-2">
            <Label>Logo da Escola</Label>
            <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
              <div className="text-center">
                <Upload className="mx-auto h-5 w-5 text-muted-foreground" />
                <p className="mt-1 text-xs text-muted-foreground">Arraste ou clique</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Endereço</Label>
              <Input value={data.endereco} onChange={(e) => update("endereco", e.target.value)} placeholder="Endereço completo" />
            </div>
            <div className="grid gap-2">
              <Label>Telefone</Label>
              <Input value={data.telefone} onChange={(e) => update("telefone", e.target.value)} placeholder="(00) 0000-0000" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="border-0 shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground">Localização & Idioma</h2>
        <Separator className="my-4" />
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label>Fuso Horário</Label>
            <Select value={data.fuso_horario} onValueChange={(v) => update("fuso_horario", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {fusoHorarios.map((f) => <SelectItem key={f} value={f}>{f.replace("America/", "")}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Idioma</Label>
            <Select value={data.idioma} onValueChange={(v) => update("idioma", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {idiomas.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Formato de Data</Label>
            <Select value={data.formato_data} onValueChange={(v) => update("formato_data", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {formatosData.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="border-0 shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground">Operação</h2>
        <Separator className="my-4" />
        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label>Volume Padrão: {data.volume_padrao}%</Label>
            <Slider value={[data.volume_padrao]} onValueChange={([v]) => update("volume_padrao", v)} max={100} step={5} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label>Intervalo entre chamadas (seg)</Label>
              <Input type="number" value={data.intervalo_padrao_chamadas_segundos} onChange={(e) => update("intervalo_padrao_chamadas_segundos", Number(e.target.value))} />
            </div>
            <div className="grid gap-2">
              <Label>Tempo máximo na fila (min)</Label>
              <Input type="number" value={data.tempo_maximo_fila} onChange={(e) => update("tempo_maximo_fila", Number(e.target.value))} />
            </div>
            <div className="flex items-end gap-3 pb-1">
              <Switch checked={data.modo_silencioso} onCheckedChange={(v) => update("modo_silencioso", v)} />
              <Label>Modo Silencioso</Label>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Horário de Início</Label>
              <Input type="time" value={data.horario_funcionamento_inicio} onChange={(e) => update("horario_funcionamento_inicio", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Horário de Fim</Label>
              <Input type="time" value={data.horario_funcionamento_fim} onChange={(e) => update("horario_funcionamento_fim", e.target.value)} />
            </div>
          </div>
        </div>
      </Card>

      <Button className="gradient-primary text-primary-foreground shadow-soft gap-2" onClick={save} disabled={saving}>
        <Save className="h-4 w-4" /> {saving ? "Salvando..." : "Salvar Configurações Gerais"}
      </Button>
    </div>
  );
}
