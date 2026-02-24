import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Wifi, WifiOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const readers = [
  { id: 1, name: "Portão A", identifier: "READER-001", status: "online", lastActivity: "Agora", location: "Entrada Principal" },
  { id: 2, name: "Portão B", identifier: "READER-002", status: "online", lastActivity: "2 min atrás", location: "Entrada Lateral" },
  { id: 3, name: "Portão C", identifier: "READER-003", status: "online", lastActivity: "5 min atrás", location: "Estacionamento" },
  { id: 4, name: "Portão D", identifier: "READER-004", status: "offline", lastActivity: "3h atrás", location: "Quadra Esportiva" },
];

export default function RFIDReadersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Leitores RFID</h1>
          <p className="text-sm text-muted-foreground">Gerencie os leitores instalados</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground shadow-soft gap-2">
              <Plus className="h-4 w-4" /> Novo Leitor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Cadastrar Leitor RFID</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nome</Label>
                <Input placeholder="Ex: Portão A" />
              </div>
              <div className="grid gap-2">
                <Label>Identificador</Label>
                <Input placeholder="Ex: READER-001" />
              </div>
              <div className="grid gap-2">
                <Label>Localização</Label>
                <Input placeholder="Ex: Entrada Principal" />
              </div>
              <Button className="gradient-primary text-primary-foreground">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {readers.map((reader) => (
          <Card key={reader.id} className="border-0 shadow-card p-5">
            <div className="flex items-start justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${reader.status === "online" ? "gradient-success" : "bg-muted"}`}>
                {reader.status === "online" ? (
                  <Wifi className="h-5 w-5 text-success-foreground" />
                ) : (
                  <WifiOff className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Edit className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-semibold text-foreground">{reader.name}</h3>
              <p className="text-xs text-muted-foreground">{reader.location}</p>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <code className="rounded bg-muted px-1.5 py-0.5 text-[10px]">{reader.identifier}</code>
              <Badge variant="outline" className={reader.status === "online" ? "border-success/30 text-success" : "border-destructive/30 text-destructive"}>
                {reader.status === "online" ? "Online" : "Offline"}
              </Badge>
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground">Última atividade: {reader.lastActivity}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
