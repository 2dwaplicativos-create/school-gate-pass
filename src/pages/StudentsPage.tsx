import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Volume2, RefreshCw, Edit, Trash2 } from "lucide-react";
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

const students = [
  { id: 1, name: "Ana Silva", grade: "5º Ano", class: "A", period: "Vespertino", guardians: ["Maria Silva (Mãe)", "José Silva (Pai)"], hasAudio: true },
  { id: 2, name: "Pedro Santos", grade: "3º Ano", class: "B", period: "Matutino", guardians: ["José Santos (Pai)"], hasAudio: true },
  { id: 3, name: "Maria Oliveira", grade: "1º Ano", class: "C", period: "Vespertino", guardians: ["Ana Oliveira (Mãe)", "Transporte ABC (Perua)"], hasAudio: false },
  { id: 4, name: "João Costa", grade: "4º Ano", class: "A", period: "Matutino", guardians: ["Ana Costa (Mãe)"], hasAudio: true },
  { id: 5, name: "Lucas Pereira", grade: "2º Ano", class: "B", period: "Vespertino", guardians: ["Carlos Pereira (Pai)", "Rosa Pereira (Avó)"], hasAudio: true },
];

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.grade.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alunos</h1>
          <p className="text-sm text-muted-foreground">{students.length} alunos cadastrados</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground shadow-soft gap-2">
              <Plus className="h-4 w-4" /> Novo Aluno
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Cadastrar Aluno</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nome</Label>
                <Input placeholder="Nome completo do aluno" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Série</Label>
                  <Input placeholder="Ex: 5º Ano" />
                </div>
                <div className="grid gap-2">
                  <Label>Turma</Label>
                  <Input placeholder="Ex: A" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Período de Saída</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Selecione o período" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matutino">Matutino</SelectItem>
                    <SelectItem value="vespertino">Vespertino</SelectItem>
                    <SelectItem value="integral">Integral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Texto TTS (opcional)</Label>
                <Input placeholder="Ex: Atenção, Ana do 5º Ano" />
              </div>
              <Button className="gradient-primary text-primary-foreground">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar aluno por nome ou série..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <Card className="border-0 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nome</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Série/Turma</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Período</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Responsáveis</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Áudio</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr key={student.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{student.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{student.grade} {student.class}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="text-xs">{student.period}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {student.guardians.map((g, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{g}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {student.hasAudio ? (
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground">
                          <Volume2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground">
                          <RefreshCw className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-xs border-warning/30 text-warning">Pendente</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
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
