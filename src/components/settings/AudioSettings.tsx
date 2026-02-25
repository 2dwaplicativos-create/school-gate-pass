import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Volume2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VoiceSetting {
  id: string;
  name: string;
  voice_id: string;
  language: string;
  gender: string;
  is_default: boolean;
}

interface AudioData {
  id?: string;
  dispositivo_saida: string;
  volume_maximo: number;
  intervalo_entre_chamadas_segundos: number;
  permitir_sobreposicao: boolean;
  tamanho_maximo_fila: number;
  prioridade_normal: number;
  prioridade_transporte: number;
  prioridade_emergencia: number;
  emergencia_interrompe_fila: boolean;
}

export default function AudioSettings() {
  const [data, setData] = useState<AudioData>({
    dispositivo_saida: "P2", volume_maximo: 100, intervalo_entre_chamadas_segundos: 2,
    permitir_sobreposicao: false, tamanho_maximo_fila: 50, prioridade_normal: 1,
    prioridade_transporte: 2, prioridade_emergencia: 3, emergencia_interrompe_fila: true,
  });
  const [voices, setVoices] = useState<VoiceSetting[]>([]);
  const [defaultVoiceId, setDefaultVoiceId] = useState("");
  const [ttsTemplate, setTtsTemplate] = useState("Atenção {nome} do {serie}");
  const [testingVoice, setTestingVoice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const [audio, voiceData, schoolData] = await Promise.all([
      supabase.from("audio_settings").select("*").limit(1).single(),
      supabase.from("voice_settings").select("*").order("gender, name"),
      supabase.from("school_settings").select("*").limit(1).single(),
    ]);
    if (audio.data) setData({ ...audio.data });
    if (voiceData.data) {
      setVoices(voiceData.data);
      const def = voiceData.data.find((v) => v.is_default);
      if (def) setDefaultVoiceId(def.id);
    }
    if (schoolData.data) {
      setTtsTemplate(schoolData.data.tts_template);
    }
  };

  const update = (field: keyof AudioData, value: any) => setData((p) => ({ ...p, [field]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const { id, ...payload } = data;
      if (id) {
        await supabase.from("audio_settings").update(payload).eq("id", id);
      } else {
        await supabase.from("audio_settings").insert(payload);
      }
      // Also save TTS template
      const { data: existing } = await supabase.from("school_settings").select("id").limit(1).single();
      if (existing) {
        await supabase.from("school_settings").update({ tts_template: ttsTemplate }).eq("id", existing.id);
      }
      toast.success("Configurações de áudio salvas!");
      fetchAll();
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const setDefaultVoice = async (voiceId: string) => {
    await supabase.from("voice_settings").update({ is_default: false }).neq("id", "");
    await supabase.from("voice_settings").update({ is_default: true }).eq("id", voiceId);
    setDefaultVoiceId(voiceId);
    toast.success("Voz padrão atualizada!");
    fetchAll();
  };

  const testVoice = async (voice: VoiceSetting) => {
    setTestingVoice(voice.id);
    try {
      const text = ttsTemplate.replace("{nome}", "Maria").replace("{serie}", "Terceiro").replace("{turma}", "Ano");
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ previewOnly: true, text, voiceId: voice.voice_id }),
        }
      );
      const result = await response.json();
      if (result.audio_base64) {
        new Audio(`data:audio/mpeg;base64,${result.audio_base64}`).play();
      } else if (result.audio_url) {
        new Audio(result.audio_url).play();
      }
    } catch {
      toast.error("Erro ao testar voz");
    } finally {
      setTestingVoice(null);
    }
  };

  const maleVoices = voices.filter((v) => v.gender === "masculino");
  const femaleVoices = voices.filter((v) => v.gender === "feminino");

  return (
    <div className="space-y-6">
      {/* Output */}
      <Card className="border-0 shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground">Saída de Som</h2>
        <Separator className="my-4" />
        <div className="grid gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Dispositivo de Saída</Label>
              <Select value={data.dispositivo_saida} onValueChange={(v) => update("dispositivo_saida", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="HDMI">HDMI</SelectItem>
                  <SelectItem value="P2">P2 (Auxiliar)</SelectItem>
                  <SelectItem value="USB">USB</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Intervalo entre chamadas (seg)</Label>
              <Input type="number" value={data.intervalo_entre_chamadas_segundos} onChange={(e) => update("intervalo_entre_chamadas_segundos", Number(e.target.value))} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Volume Máximo: {data.volume_maximo}%</Label>
            <Slider value={[data.volume_maximo]} onValueChange={([v]) => update("volume_maximo", v)} max={100} step={5} />
          </div>
          <div className="flex items-center gap-4">
            <Switch checked={data.permitir_sobreposicao} onCheckedChange={(v) => update("permitir_sobreposicao", v)} />
            <Label>Permitir sobreposição de áudios</Label>
          </div>
          <Button variant="outline" size="sm" className="w-fit gap-2"><Volume2 className="h-3.5 w-3.5" /> Testar Áudio</Button>
        </div>
      </Card>

      {/* Queue Rules */}
      <Card className="border-0 shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground">Regras da Fila</h2>
        <Separator className="my-4" />
        <div className="grid gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Tamanho máximo da fila</Label>
              <Input type="number" value={data.tamanho_maximo_fila} onChange={(e) => update("tamanho_maximo_fila", Number(e.target.value))} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="grid gap-2"><Label>Prioridade Normal</Label><Input type="number" value={data.prioridade_normal} onChange={(e) => update("prioridade_normal", Number(e.target.value))} /></div>
            <div className="grid gap-2"><Label>Prioridade Transporte</Label><Input type="number" value={data.prioridade_transporte} onChange={(e) => update("prioridade_transporte", Number(e.target.value))} /></div>
            <div className="grid gap-2"><Label>Prioridade Emergência</Label><Input type="number" value={data.prioridade_emergencia} onChange={(e) => update("prioridade_emergencia", Number(e.target.value))} /></div>
          </div>
          <div className="flex items-center gap-4">
            <Switch checked={data.emergencia_interrompe_fila} onCheckedChange={(v) => update("emergencia_interrompe_fila", v)} />
            <Label>Emergência interrompe fila</Label>
          </div>
        </div>
      </Card>

      {/* TTS Template */}
      <Card className="border-0 shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground">Modelo de Frase TTS</h2>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <Input value={ttsTemplate} onChange={(e) => setTtsTemplate(e.target.value)} />
          <p className="text-xs text-muted-foreground">Use {"{nome}"}, {"{serie}"} e {"{turma}"} como variáveis</p>
        </div>
      </Card>

      {/* Voices */}
      <Card className="border-0 shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground">Vozes TTS (Português do Brasil)</h2>
        <p className="text-xs text-muted-foreground mt-1">Selecione a voz padrão para geração de áudios</p>
        <Separator className="my-4" />
        <div className="space-y-4">
          {[{ label: "🔵 Vozes Masculinas", list: maleVoices }, { label: "🔴 Vozes Femininas", list: femaleVoices }].map(({ label, list }) => (
            <div key={label}>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">{label}</h3>
              <div className="grid gap-2">
                {list.map((v) => (
                  <div key={v.id} className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${v.id === defaultVoiceId ? "border-primary bg-primary/5" : "border-border"}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{v.name}</span>
                      {v.id === defaultVoiceId && <Badge className="bg-primary/10 text-primary text-xs">Padrão</Badge>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="h-8 gap-1" onClick={() => testVoice(v)} disabled={testingVoice === v.id}>
                        <Volume2 className="h-3.5 w-3.5" /> {testingVoice === v.id ? "Tocando..." : "Testar"}
                      </Button>
                      {v.id !== defaultVoiceId && (
                        <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => setDefaultVoice(v.id)}>
                          <Check className="h-3.5 w-3.5" /> Definir padrão
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Button className="gradient-primary text-primary-foreground shadow-soft gap-2" onClick={save} disabled={saving}>
        <Save className="h-4 w-4" /> {saving ? "Salvando..." : "Salvar Configurações de Áudio"}
      </Button>
    </div>
  );
}
