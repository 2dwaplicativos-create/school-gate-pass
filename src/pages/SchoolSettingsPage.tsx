import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Upload, Save, X, Volume2, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const states = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
  "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

interface VoiceSetting {
  id: string;
  name: string;
  voice_id: string;
  language: string;
  gender: string;
  is_default: boolean;
}

export default function SchoolSettingsPage() {
  const [voices, setVoices] = useState<VoiceSetting[]>([]);
  const [ttsTemplate, setTtsTemplate] = useState("Atenção {nome} do {serie}");
  const [recallBlock, setRecallBlock] = useState(5);
  const [callInterval, setCallInterval] = useState(2);
  const [defaultVoiceId, setDefaultVoiceId] = useState<string>("");
  const [testingVoice, setTestingVoice] = useState<string | null>(null);

  useEffect(() => {
    fetchVoices();
    fetchSettings();
  }, []);

  const fetchVoices = async () => {
    const { data } = await supabase.from("voice_settings").select("*").order("gender, name");
    if (data) {
      setVoices(data);
      const defaultV = data.find((v) => v.is_default);
      if (defaultV) setDefaultVoiceId(defaultV.id);
    }
  };

  const fetchSettings = async () => {
    const { data } = await supabase.from("school_settings").select("*").limit(1).single();
    if (data) {
      setTtsTemplate(data.tts_template);
      setRecallBlock(data.recall_block_minutes);
      setCallInterval(data.call_interval_seconds);
      if (data.default_voice_id) setDefaultVoiceId(data.default_voice_id);
    }
  };

  const setDefaultVoice = async (voiceSettingId: string) => {
    // Unset all defaults
    await supabase.from("voice_settings").update({ is_default: false }).neq("id", "");
    // Set new default
    await supabase.from("voice_settings").update({ is_default: true }).eq("id", voiceSettingId);
    setDefaultVoiceId(voiceSettingId);
    toast.success("Voz padrão atualizada!");
    fetchVoices();
  };

  const testVoice = async (voice: VoiceSetting) => {
    setTestingVoice(voice.id);
    try {
      const text = ttsTemplate.replace("{nome}", "Maria").replace("{serie}", "5º Ano");
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            previewOnly: true,
            text,
            voiceId: voice.voice_id,
          }),
        }
      );
      const result = await response.json();
      if (result.audio_base64) {
        const audio = new Audio(`data:audio/mpeg;base64,${result.audio_base64}`);
        audio.play();
      } else if (result.audio_url) {
        const audio = new Audio(result.audio_url);
        audio.play();
      }
    } catch {
      toast.error("Erro ao testar voz");
    } finally {
      setTestingVoice(null);
    }
  };

  const saveSettings = async () => {
    try {
      const { data: existing } = await supabase.from("school_settings").select("id").limit(1).single();
      const payload = {
        tts_template: ttsTemplate,
        recall_block_minutes: recallBlock,
        call_interval_seconds: callInterval,
        default_voice_id: defaultVoiceId || null,
      };

      if (existing) {
        await supabase.from("school_settings").update(payload).eq("id", existing.id);
      } else {
        await supabase.from("school_settings").insert(payload);
      }
      toast.success("Configurações salvas!");
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    }
  };

  const maleVoices = voices.filter((v) => v.gender === "masculino");
  const femaleVoices = voices.filter((v) => v.gender === "feminino");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações da Escola</h1>
        <p className="text-sm text-muted-foreground">Dados institucionais e personalização</p>
      </div>

      {/* Institutional Data */}
      <Card className="border-0 shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground">Dados Institucionais</h2>
        <Separator className="my-4" />
        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label>Nome da Escola</Label>
            <Input placeholder="Ex: Colégio São José" />
          </div>
          <div className="grid gap-2">
            <Label>CNPJ (opcional)</Label>
            <Input placeholder="00.000.000/0000-00" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="grid gap-2 sm:col-span-2">
              <Label>Endereço</Label>
              <Input placeholder="Rua / Avenida" />
            </div>
            <div className="grid gap-2">
              <Label>Número</Label>
              <Input placeholder="Nº" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="grid gap-2"><Label>Bairro</Label><Input placeholder="Bairro" /></div>
            <div className="grid gap-2"><Label>Cidade</Label><Input placeholder="Cidade" /></div>
            <div className="grid gap-2">
              <Label>Estado</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
                <SelectContent>
                  {states.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="grid gap-2"><Label>CEP</Label><Input placeholder="00000-000" /></div>
            <div className="grid gap-2"><Label>Telefone</Label><Input placeholder="(00) 0000-0000" /></div>
            <div className="grid gap-2"><Label>Email</Label><Input placeholder="contato@escola.com" type="email" /></div>
          </div>
        </div>
      </Card>

      {/* Visual Identity */}
      <Card className="border-0 shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground">Identidade Visual</h2>
        <Separator className="my-4" />
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Logo da Escola</Label>
            <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
              <div className="text-center">
                <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="mt-1 text-xs text-muted-foreground">Arraste ou clique para enviar</p>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Favicon</Label>
            <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
              <div className="text-center">
                <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="mt-1 text-xs text-muted-foreground">Arraste ou clique para enviar</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Voice Settings */}
      <Card className="border-0 shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground">Padrões de Voz TTS (Português do Brasil)</h2>
        <p className="text-xs text-muted-foreground mt-1">Selecione a voz padrão para geração de áudios dos alunos</p>
        <Separator className="my-4" />

        <div className="space-y-4">
          {/* Male voices */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">🔵 Vozes Masculinas</h3>
            <div className="grid gap-2">
              {maleVoices.map((v) => (
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

          {/* Female voices */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">🔴 Vozes Femininas</h3>
            <div className="grid gap-2">
              {femaleVoices.map((v) => (
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
        </div>
      </Card>

      {/* System Settings */}
      <Card className="border-0 shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground">Configurações do Sistema</h2>
        <Separator className="my-4" />
        <div className="grid gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Tempo de bloqueio para rechamada (min)</Label>
              <Input type="number" value={recallBlock} onChange={(e) => setRecallBlock(Number(e.target.value))} />
            </div>
            <div className="grid gap-2">
              <Label>Intervalo entre chamadas (seg)</Label>
              <Input type="number" value={callInterval} onChange={(e) => setCallInterval(Number(e.target.value))} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Modelo de frase TTS</Label>
            <Input value={ttsTemplate} onChange={(e) => setTtsTemplate(e.target.value)} />
            <p className="text-xs text-muted-foreground">Use {"{nome}"} e {"{serie}"} como variáveis</p>
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button className="gradient-primary text-primary-foreground shadow-soft gap-2" onClick={saveSettings}>
          <Save className="h-4 w-4" /> Salvar
        </Button>
        <Button variant="outline" className="gap-2">
          <X className="h-4 w-4" /> Cancelar
        </Button>
      </div>
    </div>
  );
}
