import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Upload, Save, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const states = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
  "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

export default function SchoolSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações da Escola</h1>
        <p className="text-sm text-muted-foreground">Dados institucionais e personalização</p>
      </div>

      <Card className="border-0 shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground">Dados Institucionais</h2>
        <Separator className="my-4" />

        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label>Nome da Escola</Label>
            <Input placeholder="Ex: Colégio São José" />
          </div>

          <div className="grid gap-2">
            <Label>CNPJ (opcional)</Label>
            <Input placeholder="00.000.000/0000-00" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="grid gap-2 sm:col-span-2">
              <Label>Endereço</Label>
              <Input placeholder="Rua / Avenida" />
            </div>
            <div className="grid gap-2">
              <Label>Número</Label>
              <Input placeholder="Nº" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label>Bairro</Label>
              <Input placeholder="Bairro" />
            </div>
            <div className="grid gap-2">
              <Label>Cidade</Label>
              <Input placeholder="Cidade" />
            </div>
            <div className="grid gap-2">
              <Label>Estado</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
                <SelectContent>
                  {states.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label>CEP</Label>
              <Input placeholder="00000-000" />
            </div>
            <div className="grid gap-2">
              <Label>Telefone</Label>
              <Input placeholder="(00) 0000-0000" />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input placeholder="contato@escola.com" type="email" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="border-0 shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground">Identidade Visual</h2>
        <Separator className="my-4" />

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Logo da Escola</Label>
            <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
              <div className="text-center">
                <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="mt-1 text-xs text-muted-foreground">Arraste ou clique para enviar</p>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Favicon</Label>
            <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
              <div className="text-center">
                <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="mt-1 text-xs text-muted-foreground">Arraste ou clique para enviar</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* System settings */}
      <Card className="border-0 shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground">Configurações do Sistema</h2>
        <Separator className="my-4" />
        <div className="grid gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Tempo de bloqueio para rechamada (min)</Label>
              <Input type="number" placeholder="5" defaultValue={5} />
            </div>
            <div className="grid gap-2">
              <Label>Intervalo entre chamadas (seg)</Label>
              <Input type="number" placeholder="2" defaultValue={2} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Modelo de frase TTS</Label>
            <Input placeholder="Atenção {nome} do {serie}" defaultValue="Atenção {nome} do {serie}" />
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button className="gradient-primary text-primary-foreground shadow-soft gap-2">
          <Save className="h-4 w-4" /> Salvar
        </Button>
        <Button variant="outline" className="gap-2">
          <X className="h-4 w-4" /> Cancelar
        </Button>
      </div>
    </div>
  );
}
