import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Download, Upload, CheckCircle } from "lucide-react";

export default function UpdatesSettings() {
  return (
    <div className="space-y-6">
      {/* System Update */}
      <Card className="border-0 shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground">Atualização do Sistema</h2>
        <Separator className="my-4" />
        <div className="grid gap-4">
          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
            <div>
              <Label className="text-muted-foreground">Versão Atual</Label>
              <p className="text-lg font-semibold text-foreground mt-1">v1.0.0</p>
            </div>
            <Badge className="bg-primary/10 text-primary"><CheckCircle className="h-3 w-3 mr-1" /> Atualizado</Badge>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="gap-2"><RefreshCw className="h-3.5 w-3.5" /> Verificar Atualização</Button>
            <Button size="sm" className="gradient-primary text-primary-foreground gap-2"><Download className="h-3.5 w-3.5" /> Atualizar Agora</Button>
          </div>
        </div>
      </Card>

      {/* Firmware ESP32 */}
      <Card className="border-0 shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground">Firmware ESP32</h2>
        <Separator className="my-4" />
        <div className="grid gap-4">
          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
            <div>
              <Label className="text-muted-foreground">Versão Disponível</Label>
              <p className="text-lg font-semibold text-foreground mt-1">—</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="h-3.5 w-3.5" /> Upload de Firmware
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-3.5 w-3.5" /> Atualizar Leitores Selecionados
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
