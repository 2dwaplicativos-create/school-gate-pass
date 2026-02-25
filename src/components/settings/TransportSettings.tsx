import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Edit, Bus, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Transport {
  id: string;
  nome_transporte: string;
  nome_motorista: string;
  chamada_em_grupo: boolean;
  audio_prefixo_grupo: string;
  nivel_prioridade: number;
}

export default function TransportSettings() {
  const [transports, setTransports] = useState<Transport[]>([]);
  const [editItem, setEditItem] = useState<Partial<Transport> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    const { data } = await supabase.from("transports").select("*").order("nome_transporte");
    if (data) setTransports(data);
  };

  const openNew = () => {
    setEditItem({ nome_transporte: "", nome_motorista: "", chamada_em_grupo: false, audio_prefixo_grupo: "", nivel_prioridade: 1 });
    setDialogOpen(true);
  };

  const openEdit = (t: Transport) => {
    setEditItem({ ...t });
    setDialogOpen(true);
  };

  const saveItem = async () => {
    if (!editItem?.nome_transporte) { toast.error("Nome obrigatório"); return; }
    try {
      if (editItem.id) {
        const { id, ...payload } = editItem;
        await supabase.from("transports").update(payload).eq("id", id);
      } else {
        await supabase.from("transports").insert([editItem as any]);
      }
      toast.success("Transporte salvo!");
      setDialogOpen(false);
      fetch();
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    }
  };

  const deleteItem = async (id: string) => {
    await supabase.from("transports").delete().eq("id", id);
    toast.success("Transporte removido!");
    fetch();
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2"><Bus className="h-4 w-4" /> Transportes Cadastrados</h2>
            <p className="text-xs text-muted-foreground mt-1">Gerencie veículos de transporte e suas configurações de chamada em grupo</p>
          </div>
          <Button size="sm" className="gap-1" onClick={openNew}><Plus className="h-3.5 w-3.5" /> Novo Transporte</Button>
        </div>
        <Separator className="my-4" />

        {transports.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Nenhum transporte cadastrado</p>
        ) : (
          <div className="space-y-2">
            {transports.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Bus className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-medium">{t.nome_transporte}</span>
                    {t.nome_motorista && <p className="text-xs text-muted-foreground">Motorista: {t.nome_motorista}</p>}
                  </div>
                  {t.chamada_em_grupo && <Badge variant="secondary" className="text-xs">Chamada em Grupo</Badge>}
                  <Badge variant="outline" className="text-xs">Prioridade: {t.nivel_prioridade}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => openEdit(t)}><Edit className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => deleteItem(t.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editItem?.id ? "Editar Transporte" : "Novo Transporte"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2"><Label>Nome do Transporte</Label><Input value={editItem?.nome_transporte || ""} onChange={(e) => setEditItem((p) => p ? { ...p, nome_transporte: e.target.value } : p)} placeholder="Ex: Perua do Tio Chico" /></div>
            <div className="grid gap-2"><Label>Nome do Motorista</Label><Input value={editItem?.nome_motorista || ""} onChange={(e) => setEditItem((p) => p ? { ...p, nome_motorista: e.target.value } : p)} /></div>
            <div className="flex items-center gap-4">
              <Switch checked={editItem?.chamada_em_grupo || false} onCheckedChange={(v) => setEditItem((p) => p ? { ...p, chamada_em_grupo: v } : p)} />
              <Label>Chamada em grupo</Label>
            </div>
            {editItem?.chamada_em_grupo && (
              <div className="grid gap-2">
                <Label>Prefixo do Áudio em Grupo</Label>
                <Input value={editItem?.audio_prefixo_grupo || ""} onChange={(e) => setEditItem((p) => p ? { ...p, audio_prefixo_grupo: e.target.value } : p)} placeholder="Ex: Atenção alunos da perua do Tio Chico" />
              </div>
            )}
            <div className="grid gap-2"><Label>Nível de Prioridade</Label><Input type="number" value={editItem?.nivel_prioridade || 1} onChange={(e) => setEditItem((p) => p ? { ...p, nivel_prioridade: Number(e.target.value) } : p)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button className="gradient-primary text-primary-foreground gap-2" onClick={saveItem}><Save className="h-4 w-4" /> Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
