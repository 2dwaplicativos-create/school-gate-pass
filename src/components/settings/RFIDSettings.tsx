import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RfidData {
  id?: string;
  tipo_cartao_suportado: string;
  tamanho_uid: number;
  permitir_multiplos_cartoes: boolean;
  bloquear_uid_duplicado: boolean;
  max_tentativas_invalidas: number;
  tempo_bloqueio_minutos: number;
}

export default function RFIDSettings() {
  const [data, setData] = useState<RfidData>({
    tipo_cartao_suportado: "MIFARE", tamanho_uid: 4, permitir_multiplos_cartoes: false,
    bloquear_uid_duplicado: true, max_tentativas_invalidas: 5, tempo_bloqueio_minutos: 10,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("rfid_settings").select("*").limit(1).single().then(({ data: row }) => {
      if (row) setData({ ...row });
    });
  }, []);

  const update = (field: keyof RfidData, value: any) => setData((p) => ({ ...p, [field]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const { id, ...payload } = data;
      if (id) {
        await supabase.from("rfid_settings").update(payload).eq("id", id);
      } else {
        await supabase.from("rfid_settings").insert(payload);
      }
      toast.success("Configurações RFID salvas!");
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2"><CreditCard className="h-4 w-4" /> Configurações de Cartão RFID</h2>
        <Separator className="my-4" />
        <div className="grid gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Tipo de Cartão Suportado</Label>
              <Select value={data.tipo_cartao_suportado} onValueChange={(v) => update("tipo_cartao_suportado", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MIFARE">MIFARE Classic</SelectItem>
                  <SelectItem value="MIFARE_ULTRALIGHT">MIFARE Ultralight</SelectItem>
                  <SelectItem value="NTAG">NTAG</SelectItem>
                  <SelectItem value="EM4100">EM4100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Tamanho UID (bytes)</Label>
              <Select value={String(data.tamanho_uid)} onValueChange={(v) => update("tamanho_uid", Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 bytes</SelectItem>
                  <SelectItem value="7">7 bytes</SelectItem>
                  <SelectItem value="10">10 bytes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Switch checked={data.permitir_multiplos_cartoes} onCheckedChange={(v) => update("permitir_multiplos_cartoes", v)} />
              <Label>Permitir múltiplos cartões por aluno</Label>
            </div>
            <div className="flex items-center gap-4">
              <Switch checked={data.bloquear_uid_duplicado} onCheckedChange={(v) => update("bloquear_uid_duplicado", v)} />
              <Label>Bloquear UID duplicado</Label>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Máximo de tentativas inválidas</Label>
              <Input type="number" value={data.max_tentativas_invalidas} onChange={(e) => update("max_tentativas_invalidas", Number(e.target.value))} />
            </div>
            <div className="grid gap-2">
              <Label>Tempo de bloqueio (min)</Label>
              <Input type="number" value={data.tempo_bloqueio_minutos} onChange={(e) => update("tempo_bloqueio_minutos", Number(e.target.value))} />
            </div>
          </div>
        </div>
      </Card>

      <Button className="gradient-primary text-primary-foreground shadow-soft gap-2" onClick={save} disabled={saving}>
        <Save className="h-4 w-4" /> {saving ? "Salvando..." : "Salvar Configurações RFID"}
      </Button>
    </div>
  );
}
