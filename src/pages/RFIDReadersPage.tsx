import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus, Edit, Trash2, Wifi, WifiOff, Check, X, Shield, Clock,
  Monitor, RefreshCw, AlertTriangle, Settings, Cpu, MapPin,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Reader {
  id: string;
  device_id: string;
  mac: string | null;
  ip: string | null;
  firmware: string | null;
  token: string | null;
  status: string;
  online: boolean;
  last_seen: string | null;
  name: string | null;
  location: string | null;
  allowed_start_time: string | null;
  allowed_end_time: string | null;
  allow_outside_schedule: boolean;
  maintenance_mode: boolean;
  allowed_ip_range: string | null;
  allowed_mac: string | null;
  display_status_message: string | null;
  display_pre_queue_message: string | null;
  display_release_message: string | null;
  temporary_message_timeout: number;
  created_at: string;
  updated_at: string;
}

function generateToken(length = 48): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => chars[b % chars.length]).join("");
}

function timeAgo(date: string | null) {
  if (!date) return "Nunca";
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
  } catch {
    return "Desconhecido";
  }
}

export default function RFIDReadersPage() {
  const [readers, setReaders] = useState<Reader[]>([]);
  const [loading, setLoading] = useState(true);

  // Approval modal
  const [approveOpen, setApproveOpen] = useState(false);
  const [selectedReader, setSelectedReader] = useState<Reader | null>(null);
  const [approveForm, setApproveForm] = useState({
    name: "", location: "", allowed_start_time: "07:00", allowed_end_time: "18:00",
    allow_outside_schedule: false,
  });

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editReader, setEditReader] = useState<Reader | null>(null);

  // Manual registration modal
  const [manualOpen, setManualOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    device_id: "", name: "", location: "", token: "",
  });

  // New reader dialog
  const [newReaderOpen, setNewReaderOpen] = useState(false);
  const [newReaderMode, setNewReaderMode] = useState<"auto" | "manual">("auto");

  const fetchReaders = useCallback(async () => {
    // Mark offline readers first
    try { await supabase.rpc("mark_offline_readers" as any); } catch {}
    const { data, error } = await supabase
      .from("readers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Erro ao carregar leitores");
    } else {
      setReaders((data as Reader[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReaders();
    // Realtime subscription
    const channel = supabase
      .channel("readers-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "readers" }, () => {
        fetchReaders();
      })
      .subscribe();

    // Poll every 30s
    const interval = setInterval(fetchReaders, 30000);
    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [fetchReaders]);

  const pendingReaders = readers.filter((r) => r.status === "pending");
  const activeReaders = readers.filter((r) => r.status === "active");
  const blockedReaders = readers.filter((r) => r.status === "blocked");

  // Approve reader
  const handleApprove = async () => {
    if (!selectedReader || !approveForm.name.trim()) {
      toast.error("Nome do portão é obrigatório");
      return;
    }
    const token = generateToken();
    const { error } = await supabase.from("readers").update({
      status: "active",
      token,
      name: approveForm.name,
      location: approveForm.location,
      allowed_start_time: approveForm.allowed_start_time,
      allowed_end_time: approveForm.allowed_end_time,
      allow_outside_schedule: approveForm.allow_outside_schedule,
    }).eq("id", selectedReader.id);

    if (error) {
      toast.error("Erro ao aprovar leitor");
    } else {
      toast.success("Leitor aprovado com sucesso!");
      setApproveOpen(false);
      setSelectedReader(null);
      fetchReaders();
    }
  };

  // Reject reader
  const handleReject = async (id: string) => {
    await supabase.from("readers").delete().eq("id", id);
    toast.success("Leitor rejeitado e removido");
    fetchReaders();
  };

  // Block/unblock
  const handleToggleBlock = async (reader: Reader) => {
    const newStatus = reader.status === "blocked" ? "active" : "blocked";
    await supabase.from("readers").update({ status: newStatus }).eq("id", reader.id);
    toast.success(newStatus === "blocked" ? "Leitor bloqueado" : "Leitor desbloqueado");
    fetchReaders();
  };

  // Delete
  const handleDelete = async (id: string) => {
    await supabase.from("readers").delete().eq("id", id);
    toast.success("Leitor removido");
    fetchReaders();
  };

  // Rotate token
  const handleRotateToken = async (id: string) => {
    const token = generateToken();
    await supabase.from("readers").update({ token }).eq("id", id);
    toast.success("Token rotacionado com sucesso");
    fetchReaders();
  };

  // Toggle maintenance
  const handleToggleMaintenance = async (reader: Reader) => {
    await supabase.from("readers").update({ maintenance_mode: !reader.maintenance_mode }).eq("id", reader.id);
    toast.success(reader.maintenance_mode ? "Modo manutenção desativado" : "Modo manutenção ativado");
    fetchReaders();
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!editReader) return;
    const { error } = await supabase.from("readers").update({
      name: editReader.name,
      location: editReader.location,
      allowed_start_time: editReader.allowed_start_time,
      allowed_end_time: editReader.allowed_end_time,
      allow_outside_schedule: editReader.allow_outside_schedule,
      allowed_ip_range: editReader.allowed_ip_range,
      allowed_mac: editReader.allowed_mac,
      display_status_message: editReader.display_status_message,
      display_pre_queue_message: editReader.display_pre_queue_message,
      display_release_message: editReader.display_release_message,
      temporary_message_timeout: editReader.temporary_message_timeout,
      maintenance_mode: editReader.maintenance_mode,
    }).eq("id", editReader.id);

    if (error) {
      toast.error("Erro ao salvar");
    } else {
      toast.success("Leitor atualizado");
      setEditOpen(false);
      fetchReaders();
    }
  };

  // Manual registration
  const handleManualRegister = async () => {
    if (!manualForm.device_id.trim() || !manualForm.name.trim()) {
      toast.error("Device ID e Nome são obrigatórios");
      return;
    }
    const token = manualForm.token || generateToken();
    const { error } = await supabase.from("readers").insert({
      device_id: manualForm.device_id,
      name: manualForm.name,
      location: manualForm.location,
      token,
      status: "active",
      online: false,
    });
    if (error) {
      toast.error("Erro: " + error.message);
    } else {
      toast.success("Leitor cadastrado manualmente");
      setManualOpen(false);
      setNewReaderOpen(false);
      setManualForm({ device_id: "", name: "", location: "", token: "" });
      fetchReaders();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Leitores RFID</h1>
          <p className="text-sm text-muted-foreground">
            {activeReaders.length} ativo(s) · {pendingReaders.length} pendente(s) · {blockedReaders.length} bloqueado(s)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchReaders} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Atualizar
          </Button>
          <Dialog open={newReaderOpen} onOpenChange={setNewReaderOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground shadow-soft gap-2">
                <Plus className="h-4 w-4" /> Novo Leitor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Leitor RFID</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <p className="text-sm text-muted-foreground">Como deseja adicionar o leitor?</p>
                <div className="grid gap-3">
                  <Card
                    className={`cursor-pointer border p-4 transition-all ${newReaderMode === "auto" ? "border-primary bg-primary/5" : "border-border"}`}
                    onClick={() => setNewReaderMode("auto")}
                  >
                    <div className="flex items-center gap-3">
                      <Wifi className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-semibold">Adoção Automática</p>
                        <p className="text-xs text-muted-foreground">O ESP32 se registra automaticamente. Recomendado.</p>
                      </div>
                    </div>
                  </Card>
                  <Card
                    className={`cursor-pointer border p-4 transition-all ${newReaderMode === "manual" ? "border-primary bg-primary/5" : "border-border"}`}
                    onClick={() => setNewReaderMode("manual")}
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-semibold">Cadastro Manual</p>
                        <p className="text-xs text-muted-foreground">Insira os dados manualmente.</p>
                      </div>
                    </div>
                  </Card>
                </div>
                {newReaderMode === "auto" ? (
                  <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Instruções:</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>Configure o ESP32 com o endpoint de registro do servidor</li>
                      <li>Ligue o dispositivo na rede</li>
                      <li>Ele aparecerá na seção "Pendentes" abaixo</li>
                      <li>Aprove e configure o portão</li>
                    </ol>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    <div className="grid gap-2">
                      <Label>Device ID *</Label>
                      <Input placeholder="Ex: ESP32-ABCD1234" value={manualForm.device_id}
                        onChange={(e) => setManualForm((p) => ({ ...p, device_id: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Nome do Portão *</Label>
                      <Input placeholder="Ex: Portão A" value={manualForm.name}
                        onChange={(e) => setManualForm((p) => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Localização</Label>
                      <Input placeholder="Ex: Entrada Principal" value={manualForm.location}
                        onChange={(e) => setManualForm((p) => ({ ...p, location: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Token (deixe vazio para gerar automaticamente)</Label>
                      <Input placeholder="Token personalizado" value={manualForm.token}
                        onChange={(e) => setManualForm((p) => ({ ...p, token: e.target.value }))} />
                    </div>
                    <Button className="gradient-primary text-primary-foreground" onClick={handleManualRegister}>
                      Cadastrar Leitor
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Pending Readers */}
      {pendingReaders.length > 0 && (
        <Card className="border-warning/30 bg-warning/5 shadow-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <h2 className="text-base font-semibold text-foreground">
              Leitores Pendentes ({pendingReaders.length})
            </h2>
          </div>
          <div className="space-y-3">
            {pendingReaders.map((reader) => (
              <div key={reader.id} className="flex flex-col gap-3 rounded-lg border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <Cpu className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <code className="text-sm font-semibold">{reader.device_id}</code>
                    <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                      {reader.ip && <span>IP: {reader.ip}</span>}
                      {reader.mac && <span>MAC: {reader.mac}</span>}
                      {reader.firmware && <span>FW: {reader.firmware}</span>}
                      <span>Visto: {timeAgo(reader.last_seen)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="gap-1 bg-success text-success-foreground hover:bg-success/90" onClick={() => {
                    setSelectedReader(reader);
                    setApproveForm({ name: "", location: "", allowed_start_time: "07:00", allowed_end_time: "18:00", allow_outside_schedule: false });
                    setApproveOpen(true);
                  }}>
                    <Check className="h-3.5 w-3.5" /> Aprovar
                  </Button>
                  <Button size="sm" variant="ghost" className="gap-1 text-destructive" onClick={() => handleReject(reader.id)}>
                    <X className="h-3.5 w-3.5" /> Rejeitar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Active Readers */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-3">Leitores Ativos</h2>
        {activeReaders.length === 0 ? (
          <Card className="border-0 shadow-card p-8 text-center">
            <Wifi className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Nenhum leitor ativo</p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeReaders.map((reader) => (
              <Card key={reader.id} className="border-0 shadow-card p-5">
                <div className="flex items-start justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${reader.online ? "bg-success/20" : "bg-destructive/10"}`}>
                    {reader.online ? <Wifi className="h-5 w-5 text-success" /> : <WifiOff className="h-5 w-5 text-destructive" />}
                  </div>
                  <div className="flex gap-1">
                    {reader.maintenance_mode && (
                      <Badge variant="outline" className="border-warning/50 text-warning text-[10px]">Manutenção</Badge>
                    )}
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => {
                      setEditReader({ ...reader });
                      setEditOpen(true);
                    }}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => handleDelete(reader.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-semibold text-foreground">{reader.name || "Sem nome"}</h3>
                  {reader.location && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" /> {reader.location}
                    </p>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <code className="rounded bg-muted px-1.5 py-0.5 text-[10px]">{reader.device_id}</code>
                  <Badge variant="outline" className={reader.online ? "border-success/30 text-success" : "border-destructive/30 text-destructive"}>
                    {reader.online ? "Online" : "Offline"}
                  </Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
                  {reader.ip && <span>IP: {reader.ip}</span>}
                  {reader.firmware && <span>FW: {reader.firmware}</span>}
                  <span>Visto: {timeAgo(reader.last_seen)}</span>
                </div>
                <div className="mt-3 flex gap-1.5">
                  <Button size="sm" variant="outline" className="h-7 text-[10px] px-2" onClick={() => handleRotateToken(reader.id)}>
                    <RefreshCw className="h-3 w-3 mr-1" /> Token
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-[10px] px-2" onClick={() => handleToggleMaintenance(reader)}>
                    <Settings className="h-3 w-3 mr-1" /> {reader.maintenance_mode ? "Ativar" : "Manutenção"}
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-[10px] px-2 text-destructive" onClick={() => handleToggleBlock(reader)}>
                    <Shield className="h-3 w-3 mr-1" /> Bloquear
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Blocked Readers */}
      {blockedReaders.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-foreground mb-3">Leitores Bloqueados</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {blockedReaders.map((reader) => (
              <Card key={reader.id} className="border-0 shadow-card p-5 opacity-60">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                    <Shield className="h-5 w-5 text-destructive" />
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="h-7 text-[10px] px-2" onClick={() => handleToggleBlock(reader)}>
                      Desbloquear
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => handleDelete(reader.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-semibold text-foreground">{reader.name || reader.device_id}</h3>
                  <p className="text-xs text-muted-foreground">{reader.location}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Approval Dialog */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Aprovar Leitor RFID</DialogTitle>
          </DialogHeader>
          {selectedReader && (
            <div className="grid gap-4 py-2">
              <div className="rounded-lg bg-muted/50 p-3 text-xs">
                <p><strong>Device:</strong> {selectedReader.device_id}</p>
                {selectedReader.mac && <p><strong>MAC:</strong> {selectedReader.mac}</p>}
                {selectedReader.ip && <p><strong>IP:</strong> {selectedReader.ip}</p>}
                {selectedReader.firmware && <p><strong>Firmware:</strong> {selectedReader.firmware}</p>}
              </div>
              <div className="grid gap-2">
                <Label>Nome do Portão *</Label>
                <Input placeholder="Ex: Portão A" value={approveForm.name}
                  onChange={(e) => setApproveForm((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label>Localização</Label>
                <Input placeholder="Ex: Entrada Principal" value={approveForm.location}
                  onChange={(e) => setApproveForm((p) => ({ ...p, location: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Horário Início</Label>
                  <Input type="time" value={approveForm.allowed_start_time}
                    onChange={(e) => setApproveForm((p) => ({ ...p, allowed_start_time: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Horário Fim</Label>
                  <Input type="time" value={approveForm.allowed_end_time}
                    onChange={(e) => setApproveForm((p) => ({ ...p, allowed_end_time: e.target.value }))} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={approveForm.allow_outside_schedule}
                  onCheckedChange={(v) => setApproveForm((p) => ({ ...p, allow_outside_schedule: v }))} />
                <Label>Permitir funcionamento fora do horário</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveOpen(false)}>Cancelar</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={handleApprove}>
              <Check className="h-4 w-4 mr-1" /> Confirmar Aprovação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Leitor — {editReader?.name || editReader?.device_id}</DialogTitle>
          </DialogHeader>
          {editReader && (
            <Tabs defaultValue="general" className="mt-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">Geral</TabsTrigger>
                <TabsTrigger value="display">Display LCD</TabsTrigger>
                <TabsTrigger value="security">Segurança</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 mt-4">
                <div className="grid gap-2">
                  <Label>Nome do Portão</Label>
                  <Input value={editReader.name || ""} onChange={(e) => setEditReader({ ...editReader, name: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Localização</Label>
                  <Input value={editReader.location || ""} onChange={(e) => setEditReader({ ...editReader, location: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Horário Início</Label>
                    <Input type="time" value={editReader.allowed_start_time || ""} onChange={(e) => setEditReader({ ...editReader, allowed_start_time: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Horário Fim</Label>
                    <Input type="time" value={editReader.allowed_end_time || ""} onChange={(e) => setEditReader({ ...editReader, allowed_end_time: e.target.value })} />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={editReader.allow_outside_schedule} onCheckedChange={(v) => setEditReader({ ...editReader, allow_outside_schedule: v })} />
                  <Label>Permitir fora do horário</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={editReader.maintenance_mode} onCheckedChange={(v) => setEditReader({ ...editReader, maintenance_mode: v })} />
                  <Label>Modo Manutenção</Label>
                </div>
              </TabsContent>

              <TabsContent value="display" className="space-y-4 mt-4">
                <div className="grid gap-2">
                  <Label>Mensagem de Status</Label>
                  <Input value={editReader.display_status_message || ""} onChange={(e) => setEditReader({ ...editReader, display_status_message: e.target.value })} placeholder="Ex: Saída do Período da Tarde" />
                </div>
                <div className="grid gap-2">
                  <Label>Mensagem Pré-fila</Label>
                  <Input value={editReader.display_pre_queue_message || ""} onChange={(e) => setEditReader({ ...editReader, display_pre_queue_message: e.target.value })} placeholder="Aguarde o horário de saída" />
                </div>
                <div className="grid gap-2">
                  <Label>Mensagem de Liberação</Label>
                  <Input value={editReader.display_release_message || ""} onChange={(e) => setEditReader({ ...editReader, display_release_message: e.target.value })} placeholder="Passe sua TAG e aguarde" />
                </div>
                <div className="grid gap-2">
                  <Label>Timeout mensagem temporária (segundos)</Label>
                  <Input type="number" value={editReader.temporary_message_timeout} onChange={(e) => setEditReader({ ...editReader, temporary_message_timeout: Number(e.target.value) })} />
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-4 mt-4">
                <div className="grid gap-2">
                  <Label>Faixa de IP Permitida</Label>
                  <Input value={editReader.allowed_ip_range || ""} onChange={(e) => setEditReader({ ...editReader, allowed_ip_range: e.target.value })} placeholder="Ex: 192.168.1.0/24" />
                </div>
                <div className="grid gap-2">
                  <Label>MAC Permitido</Label>
                  <Input value={editReader.allowed_mac || ""} onChange={(e) => setEditReader({ ...editReader, allowed_mac: e.target.value })} placeholder="Ex: AA:BB:CC:DD:EE:FF" />
                </div>
                <Separator />
                <div className="rounded-lg bg-muted/50 p-3 text-xs space-y-1">
                  <p><strong>Device ID:</strong> {editReader.device_id}</p>
                  <p><strong>Token:</strong> {editReader.token ? `${editReader.token.substring(0, 12)}...` : "N/A"}</p>
                  <p><strong>IP Atual:</strong> {editReader.ip || "N/A"}</p>
                  <p><strong>MAC:</strong> {editReader.mac || "N/A"}</p>
                  <p><strong>Firmware:</strong> {editReader.firmware || "N/A"}</p>
                </div>
                <Button variant="outline" size="sm" className="gap-1" onClick={() => handleRotateToken(editReader.id)}>
                  <RefreshCw className="h-3.5 w-3.5" /> Rotacionar Token
                </Button>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={handleSaveEdit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
