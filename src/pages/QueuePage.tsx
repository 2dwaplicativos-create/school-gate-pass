import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Radio, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const queueItems = [
  { id: 1, student: "Ana Silva", grade: "5º Ano A", guardian: "Maria Silva (Mãe)", reader: "Portão A", time: "14:32", status: "chamado", elapsed: "2min" },
  { id: 2, student: "Pedro Santos", grade: "3º Ano B", guardian: "José Santos (Pai)", reader: "Portão B", time: "14:30", status: "aguardando", elapsed: "4min" },
  { id: 3, student: "Maria Oliveira", grade: "1º Ano C", guardian: "Transporte Escolar ABC (Perua)", reader: "Portão A", time: "14:28", status: "na_fila", elapsed: "6min" },
  { id: 4, student: "João Costa", grade: "4º Ano A", guardian: "Ana Costa (Mãe)", reader: "Portão A", time: "14:25", status: "chamado", elapsed: "9min" },
  { id: 5, student: "Lucas Pereira", grade: "2º Ano B", guardian: "Carlos Pereira (Pai)", reader: "Portão B", time: "14:22", status: "na_fila", elapsed: "12min" },
];

const statusMap: Record<string, { label: string; class: string }> = {
  chamado: { label: "Chamado", class: "bg-success/10 text-success border-success/20" },
  aguardando: { label: "Aguardando", class: "bg-warning/10 text-warning border-warning/20" },
  na_fila: { label: "Na Fila", class: "bg-info/10 text-info border-info/20" },
};

export default function QueuePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fila em Tempo Real</h1>
          <p className="text-sm text-muted-foreground">Acompanhe as chamadas de saída</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 border-success/30 bg-success/5 text-success">
            <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-soft" />
            Período Ativo
          </Badge>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-0 shadow-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{queueItems.length}</p>
          <p className="text-xs text-muted-foreground">Na fila</p>
        </Card>
        <Card className="border-0 shadow-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">2</p>
          <p className="text-xs text-muted-foreground">Chamados</p>
        </Card>
        <Card className="border-0 shadow-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">47</p>
          <p className="text-xs text-muted-foreground">Atendidos hoje</p>
        </Card>
      </div>

      {/* Queue list */}
      <div className="space-y-3">
        {queueItems.map((item, i) => {
          const status = statusMap[item.status];
          return (
            <Card key={item.id} className="border-0 shadow-card p-4 transition-all hover:shadow-soft">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.student}</p>
                    <p className="text-xs text-muted-foreground">{item.grade} · {item.guardian}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Radio className="h-3 w-3" />
                    {item.reader}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {item.elapsed}
                  </div>
                  <Badge variant="outline" className={status.class}>
                    {status.label}
                  </Badge>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
