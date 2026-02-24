import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

const periods = [
  { id: 1, name: "Matutino", start: "11:30", end: "12:00", preQueue: 15, days: ["Seg", "Ter", "Qua", "Qui", "Sex"], active: true, students: 142 },
  { id: 2, name: "Vespertino", start: "17:00", end: "17:30", preQueue: 10, days: ["Seg", "Ter", "Qua", "Qui", "Sex"], active: true, students: 186 },
  { id: 3, name: "Integral", start: "17:30", end: "18:00", preQueue: 15, days: ["Seg", "Ter", "Qua", "Qui", "Sex"], active: true, students: 84 },
  { id: 4, name: "Sábado Letivo", start: "11:30", end: "12:00", preQueue: 10, days: ["Sáb"], active: false, students: 0 },
];

const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function PeriodsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Períodos de Saída</h1>
          <p className="text-sm text-muted-foreground">Configure os horários de saída</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground shadow-soft gap-2">
              <Plus className="h-4 w-4" /> Novo Período
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Cadastrar Período</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nome do Período</Label>
                <Input placeholder="Ex: Vespertino" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Horário de Início</Label>
                  <Input type="time" />
                </div>
                <div className="grid gap-2">
                  <Label>Horário de Término</Label>
                  <Input type="time" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Minutos de Pré-Fila</Label>
                <Input type="number" placeholder="15" />
              </div>
              <div className="grid gap-2">
                <Label>Dias da Semana</Label>
                <div className="flex flex-wrap gap-3">
                  {weekDays.map((day) => (
                    <label key={day} className="flex items-center gap-1.5">
                      <Checkbox />
                      <span className="text-sm">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button className="gradient-primary text-primary-foreground">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {periods.map((period) => (
          <Card key={period.id} className="border-0 shadow-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-foreground">{period.name}</h3>
                  <Badge variant="outline" className={period.active ? "border-success/30 text-success" : "border-muted-foreground/30 text-muted-foreground"}>
                    {period.active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {period.start} – {period.end} · Pré-fila: {period.preQueue}min
                </p>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Edit className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-1">
                {weekDays.map((day) => (
                  <span
                    key={day}
                    className={`flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-medium ${
                      period.days.includes(day)
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {day[0]}
                  </span>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{period.students} alunos</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
