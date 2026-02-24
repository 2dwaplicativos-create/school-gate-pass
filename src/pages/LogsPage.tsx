import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

const logs = [
  { id: 1, time: "14:32:15", event: "RFID Lido", details: "Tag A1B2C3D4 - Maria Silva (Mãe) - Portão A", level: "info" },
  { id: 2, time: "14:32:16", event: "Aluno na Fila", details: "Ana Silva adicionada à fila de saída", level: "info" },
  { id: 3, time: "14:32:18", event: "Chamada TTS", details: "Áudio reproduzido: Atenção Ana do 5º Ano", level: "success" },
  { id: 4, time: "14:30:05", event: "RFID Lido", details: "Tag E5F6G7H8 - José Santos (Pai) - Portão B", level: "info" },
  { id: 5, time: "14:28:10", event: "RFID Bloqueado", details: "Tag I9J0K1L2 - Rechamada bloqueada (aguardar 5min)", level: "warning" },
  { id: 6, time: "14:25:00", event: "Leitor Offline", details: "READER-004 (Portão D) ficou offline", level: "error" },
  { id: 7, time: "14:22:30", event: "RFID Lido", details: "Tag I9J0K1L2 - Transporte ABC (Perua) - Portão A", level: "info" },
  { id: 8, time: "14:22:31", event: "Chamada Agrupada", details: "3 alunos chamados: Maria Oliveira, João Costa, Lucas Pereira", level: "success" },
  { id: 9, time: "14:20:00", event: "Período Iniciado", details: "Período Vespertino ativo (17:00 - 17:30)", level: "info" },
  { id: 10, time: "14:15:00", event: "Pré-Fila Aberta", details: "Pré-fila do período Vespertino aberta (10min antes)", level: "info" },
];

const levelStyles: Record<string, string> = {
  info: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  error: "bg-destructive/10 text-destructive",
};

export default function LogsPage() {
  const [search, setSearch] = useState("");
  const filtered = logs.filter((l) =>
    l.event.toLowerCase().includes(search.toLowerCase()) ||
    l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Logs do Sistema</h1>
        <p className="text-sm text-muted-foreground">Registro de eventos e atividades</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar nos logs..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="border-0 shadow-card overflow-hidden">
        <div className="divide-y">
          {filtered.map((log) => (
            <div key={log.id} className="flex items-start gap-4 px-4 py-3 hover:bg-muted/30 transition-colors">
              <code className="mt-0.5 shrink-0 text-xs text-muted-foreground">{log.time}</code>
              <Badge variant="outline" className={`shrink-0 text-[10px] ${levelStyles[log.level]}`}>
                {log.event}
              </Badge>
              <p className="text-sm text-foreground">{log.details}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
