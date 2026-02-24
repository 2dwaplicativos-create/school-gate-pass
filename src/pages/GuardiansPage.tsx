import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Wifi } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Guardian {
  id: string;
  name: string;
  type: string;
  phone: string | null;
  status: string;
  rfid_uid: string | null;
  created_at: string;
}

const typeColors: Record<string, string> = {
  MAE: "bg-pink-50 text-pink-600 border-pink-200",
  PAI: "bg-blue-50 text-blue-600 border-blue-200",
  AVO: "bg-purple-50 text-purple-600 border-purple-200",
  TIO: "bg-orange-50 text-orange-600 border-orange-200",
  PERUA: "bg-emerald-50 text-emerald-600 border-emerald-200",
};

const typeLabels: Record<string, string> = {
  PAI: "Pai", MAE: "Mãe", AVO: "Avó/Avô", TIO: "Tio/Tia", PERUA: "Perua",
};

export default function GuardiansPage() {
  const [search, setSearch] = useState("");
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGuardian, setEditingGuardian] = useState<Guardian | null>(null);

  // Form
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [phone, setPhone] = useState("");
  const [rfidUid, setRfidUid] = useState("");
  const [scanning, setScanning] = useState(false);

  // Guardian students map
  const [guardianStudents, setGuardianStudents] = useState<Record<string, string[]>>({});

  const fetchData = async () => {
    setLoading(true);
    const [guardiansRes, linksRes, studentsRes] = await Promise.all([
      supabase.from("guardians").select("*").order("name"),
      supabase.from("student_guardian").select("student_id, guardian_id"),
      supabase.from("students").select("id, name"),
    ]);

    if (guardiansRes.data) setGuardians(guardiansRes.data);

    if (linksRes.data && studentsRes.data) {
      const map: Record<string, string[]> = {};
      for (const link of linksRes.data) {
        const student = studentsRes.data.find((s) => s.id === link.student_id);
        if (student) {
          if (!map[link.guardian_id]) map[link.guardian_id] = [];
          map[link.guardian_id].push(student.name);
        }
      }
      setGuardianStudents(map);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setName(""); setType(""); setPhone(""); setRfidUid(""); setEditingGuardian(null);
  };

  const openEdit = (g: Guardian) => {
    setEditingGuardian(g);
    setName(g.name);
    setType(g.type);
    setPhone(g.phone || "");
    setRfidUid(g.rfid_uid || "");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name || !type) {
      toast.error("Preencha nome e tipo");
      return;
    }

    try {
      const payload = {
        name, type,
        phone: phone || null,
        rfid_uid: rfidUid || null,
      };

      if (editingGuardian) {
        const { error } = await supabase.from("guardians").update(payload).eq("id", editingGuardian.id);
        if (error) throw error;
        toast.success("Responsável atualizado!");
      } else {
        const { error } = await supabase.from("guardians").insert(payload);
        if (error) throw error;
        toast.success("Responsável cadastrado!");
      }

      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja excluir este responsável?")) return;
    await supabase.from("guardians").delete().eq("id", id);
    toast.success("Responsável excluído");
    fetchData();
  };

  const simulateScan = () => {
    setScanning(true);
    toast.info("Aguardando leitura do RFID...");
    // Simulate scan after 2s
    setTimeout(() => {
      const fakeUid = Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16).toUpperCase()).join("");
      setRfidUid(fakeUid);
      setScanning(false);
      toast.success("Tag RFID lida: " + fakeUid);
    }, 2000);
  };

  const filtered = guardians.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Responsáveis</h1>
          <p className="text-sm text-muted-foreground">{guardians.length} responsáveis cadastrados</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground shadow-soft gap-2">
              <Plus className="h-4 w-4" /> Novo Responsável
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingGuardian ? "Editar Responsável" : "Cadastrar Responsável"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nome Completo</Label>
                <Input placeholder="Nome completo" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Tipo</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PAI">Pai</SelectItem>
                      <SelectItem value="MAE">Mãe</SelectItem>
                      <SelectItem value="AVO">Avó/Avô</SelectItem>
                      <SelectItem value="TIO">Tio/Tia</SelectItem>
                      <SelectItem value="PERUA">Perua</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Telefone</Label>
                  <Input placeholder="(00) 00000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>UUID do Responsável</Label>
                <Input
                  value={editingGuardian?.id || "Gerado automaticamente"}
                  disabled
                  className="bg-muted/50 font-mono text-xs"
                />
              </div>

              <div className="grid gap-2">
                <Label>UID do RFID</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Escaneie ou digite o UID"
                    value={rfidUid}
                    onChange={(e) => setRfidUid(e.target.value)}
                    className="font-mono"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2 shrink-0"
                    onClick={simulateScan}
                    disabled={scanning}
                  >
                    <Wifi className={`h-4 w-4 ${scanning ? "animate-pulse" : ""}`} />
                    {scanning ? "Lendo..." : "Escanear"}
                  </Button>
                </div>
              </div>

              <Button className="gradient-primary text-primary-foreground" onClick={handleSave}>
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar responsável..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card className="border-0 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nome</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tipo</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Telefone</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">UUID</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">RFID</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Alunos</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">Carregando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">Nenhum responsável encontrado</td></tr>
              ) : (
                filtered.map((g) => (
                  <tr key={g.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{g.name}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-xs ${typeColors[g.type] || ""}`}>
                        {typeLabels[g.type] || g.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{g.phone || "—"}</td>
                    <td className="px-4 py-3">
                      <code className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono">{g.id.slice(0, 8)}...</code>
                    </td>
                    <td className="px-4 py-3">
                      {g.rfid_uid ? (
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">{g.rfid_uid}</code>
                      ) : (
                        <Badge variant="outline" className="text-xs border-warning/30 text-warning">Sem tag</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(guardianStudents[g.id] || []).map((s, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                        ))}
                        {!(guardianStudents[g.id]?.length) && <span className="text-xs text-muted-foreground">—</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={g.status === "Ativo" ? "border-success/30 text-success" : "border-destructive/30 text-destructive"}>
                        {g.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => openEdit(g)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => handleDelete(g.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
