import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Database, Download, Upload, Trash2, Wrench } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BackupData {
  id?: string;
  habilitar_backup_automatico: boolean;
  frequencia_backup: string;
  horario_backup: string;
  destino_backup: string;
}

export default function DatabaseSettings() {
  const [data, setData] = useState<BackupData>({
    habilitar_backup_automatico: false, frequencia_backup: "DIARIO",
    horario_backup: "02:00", destino_backup: "LOCAL",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("backup_settings").select("*").limit(1).single().then(({ data: row }) => {
      if (row) setData({ ...row });
    });
  }, []);

  const update = (field: keyof BackupData, value: any) => setData((p) => ({ ...p, [field]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const { id, ...payload } = data;
      if (id) {
        await supabase.from("backup_settings").update(payload).eq("id", id);
      } else {
        await supabase.from("backup_settings").insert(payload);
      }
      toast.success("Configurações de backup salvas!");
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Backup */}
      <Card className="border-0 shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2"><Database className="h-4 w-4" /> Backup</h2>
        <Separator className="my-4" />
        <div className="grid gap-5">
          <div className="flex items-center gap-4">
            <Switch checked={data.habilitar_backup_automatico} onCheckedChange={(v) => update("habilitar_backup_automatico", v)} />
            <Label>Backup automático</Label>
          </div>
          {data.habilitar_backup_automatico && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label>Frequência</Label>
                <Select value={data.frequencia_backup} onValueChange={(v) => update("frequencia_backup", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DIARIO">Diário</SelectItem>
                    <SelectItem value="SEMANAL">Semanal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Horário</Label>
                <Input type="time" value={data.horario_backup} onChange={(e) => update("horario_backup", e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Destino</Label>
                <Select value={data.destino_backup} onValueChange={(v) => update("destino_backup", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOCAL">Local</SelectItem>
                    <SelectItem value="NUVEM">Nuvem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="gap-2"><Download className="h-3.5 w-3.5" /> Backup Manual</Button>
            <Button variant="outline" size="sm" className="gap-2"><Upload className="h-3.5 w-3.5" /> Restaurar Backup</Button>
          </div>
        </div>
      </Card>

      {/* Maintenance */}
      <Card className="border-0 shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2"><Wrench className="h-4 w-4" /> Manutenção</h2>
        <Separator className="my-4" />
        <div className="grid gap-4">
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="gap-2"><Trash2 className="h-3.5 w-3.5" /> Limpar Logs Antigos</Button>
            <Button variant="outline" size="sm" className="gap-2"><Wrench className="h-3.5 w-3.5" /> Otimizar Banco</Button>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <Label className="text-muted-foreground">Tamanho do Banco</Label>
            <p className="text-lg font-semibold text-foreground mt-1">— MB</p>
            <p className="text-xs text-muted-foreground">Informação calculada automaticamente</p>
          </div>
        </div>
      </Card>

      <Button className="gradient-primary text-primary-foreground shadow-soft gap-2" onClick={save} disabled={saving}>
        <Save className="h-4 w-4" /> {saving ? "Salvando..." : "Salvar Configurações de Banco"}
      </Button>
    </div>
  );
}
