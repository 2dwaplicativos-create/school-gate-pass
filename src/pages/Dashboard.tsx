import { Card } from "@/components/ui/card";
import { GraduationCap, Users, Clock, Radio, TrendingUp, ListOrdered } from "lucide-react";

const stats = [
  { label: "Total de Alunos", value: "412", icon: GraduationCap, gradient: "gradient-primary" },
  { label: "Na Fila", value: "23", icon: ListOrdered, gradient: "gradient-warning" },
  { label: "Período Ativo", value: "Vespertino", icon: Clock, gradient: "gradient-success" },
  { label: "Leitores Online", value: "3/4", icon: Radio, gradient: "gradient-info" },
];

const recentCalls = [
  { student: "Ana Silva", grade: "5º Ano A", time: "14:32", status: "Chamado" },
  { student: "Pedro Santos", grade: "3º Ano B", time: "14:30", status: "Aguardando" },
  { student: "Maria Oliveira", grade: "1º Ano C", time: "14:28", status: "Na fila" },
  { student: "João Costa", grade: "4º Ano A", time: "14:25", status: "Chamado" },
  { student: "Lucas Pereira", grade: "2º Ano B", time: "14:22", status: "Na fila" },
];

const statusColors: Record<string, string> = {
  "Chamado": "bg-success/10 text-success",
  "Aguardando": "bg-warning/10 text-warning",
  "Na fila": "bg-info/10 text-info",
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral do sistema de saída escolar</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-card border-0 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.gradient}`}>
                <stat.icon className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart placeholder */}
        <Card className="shadow-card border-0 p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Chamadas do Dia</h3>
              <p className="text-xs text-muted-foreground">Distribuição por hora</p>
            </div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex h-48 items-end gap-2">
            {[20, 45, 30, 80, 65, 90, 55, 40, 70, 35, 50, 25].map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md gradient-primary opacity-80 transition-all hover:opacity-100"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[9px] text-muted-foreground">{7 + i}h</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent calls */}
        <Card className="shadow-card border-0 p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Chamadas Recentes</h3>
          <div className="space-y-3">
            {recentCalls.map((call, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{call.student}</p>
                  <p className="text-xs text-muted-foreground">{call.grade} · {call.time}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColors[call.status]}`}>
                  {call.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
