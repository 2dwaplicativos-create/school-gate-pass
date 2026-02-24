import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
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

const guardians = [
  { id: 1, name: "Maria Silva", type: "MÃE", phone: "(11) 99999-1111", status: "Ativo", students: ["Ana Silva", "Carlos Silva"], rfid: "A1B2C3D4" },
  { id: 2, name: "José Santos", type: "PAI", phone: "(11) 99999-2222", status: "Ativo", students: ["Pedro Santos"], rfid: "E5F6G7H8" },
  { id: 3, name: "Transporte ABC", type: "PERUA", phone: "(11) 99999-3333", status: "Ativo", students: ["Maria Oliveira", "João Costa", "Lucas Pereira"], rfid: "I9J0K1L2" },
  { id: 4, name: "Rosa Pereira", type: "AVÓ", phone: "(11) 99999-4444", status: "Ativo", students: ["Lucas Pereira"], rfid: "M3N4O5P6" },
  { id: 5, name: "Carlos Mendes", type: "TIO", phone: "(11) 99999-5555", status: "Inativo", students: ["Ana Mendes"], rfid: null },
];

const typeColors: Record<string, string> = {
  "MÃE": "bg-pink-50 text-pink-600 border-pink-200",
  "PAI": "bg-blue-50 text-blue-600 border-blue-200",
  "AVÓ": "bg-purple-50 text-purple-600 border-purple-200",
  "TIO": "bg-orange-50 text-orange-600 border-orange-200",
  "PERUA": "bg-emerald-50 text-emerald-600 border-emerald-200",
};

export default function GuardiansPage() {
  const [search, setSearch] = useState("");
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
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground shadow-soft gap-2">
              <Plus className="h-4 w-4" /> Novo Responsável
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Cadastrar Responsável</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nome</Label>
                <Input placeholder="Nome completo" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Tipo</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pai">Pai</SelectItem>
                      <SelectItem value="mae">Mãe</SelectItem>
                      <SelectItem value="avo">Avó/Avô</SelectItem>
                      <SelectItem value="tio">Tio/Tia</SelectItem>
                      <SelectItem value="perua">Perua</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Telefone</Label>
                  <Input placeholder="(00) 00000-0000" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>UID RFID</Label>
                <Input placeholder="Escaneie ou digite o UID" />
              </div>
              <Button className="gradient-primary text-primary-foreground">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar responsável..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="border-0 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nome</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tipo</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Telefone</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">RFID</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Alunos</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{g.name}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-xs ${typeColors[g.type] || ""}`}>{g.type}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{g.phone}</td>
                  <td className="px-4 py-3">
                    {g.rfid ? (
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{g.rfid}</code>
                    ) : (
                      <Badge variant="outline" className="text-xs border-warning/30 text-warning">Sem tag</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {g.students.map((s, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={g.status === "Ativo" ? "border-success/30 text-success" : "border-destructive/30 text-destructive"}>
                      {g.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Edit className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
