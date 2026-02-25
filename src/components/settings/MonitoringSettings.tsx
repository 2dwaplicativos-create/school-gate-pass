import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Cpu, HardDrive, MemoryStick, Thermometer, Wifi, Activity, Radio } from "lucide-react";

function MetricCard({ icon: Icon, label, value, unit, progress }: { icon: any; label: string; value: string; unit: string; progress?: number }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <Label className="text-muted-foreground">{label}</Label>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}<span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span></p>
      {progress !== undefined && <Progress value={progress} className="mt-2 h-1.5" />}
    </div>
  );
}

export default function MonitoringSettings() {
  return (
    <div className="space-y-6">
      {/* System */}
      <Card className="border-0 shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2"><Activity className="h-4 w-4" /> Sistema</h2>
        <p className="text-xs text-muted-foreground mt-1">Métricas em tempo real do servidor</p>
        <Separator className="my-4" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard icon={Cpu} label="CPU" value="—" unit="%" progress={0} />
          <MetricCard icon={MemoryStick} label="Memória" value="—" unit="%" progress={0} />
          <MetricCard icon={HardDrive} label="Disco" value="—" unit="%" progress={0} />
          <MetricCard icon={Thermometer} label="Temperatura" value="—" unit="°C" />
          <MetricCard icon={Wifi} label="Uso de Rede" value="—" unit="KB/s" />
        </div>
      </Card>

      {/* Readers Status */}
      <Card className="border-0 shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2"><Radio className="h-4 w-4" /> Leitores</h2>
        <Separator className="my-4" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border p-4 text-center">
            <Badge className="bg-primary/10 text-primary mb-2">Online</Badge>
            <p className="text-3xl font-bold text-foreground">—</p>
          </div>
          <div className="rounded-lg border border-border p-4 text-center">
            <Badge variant="destructive" className="mb-2">Offline</Badge>
            <p className="text-3xl font-bold text-foreground">—</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <Label className="text-muted-foreground text-xs">Tempo de Resposta Médio</Label>
            <p className="text-2xl font-bold text-foreground mt-1">— <span className="text-sm font-normal text-muted-foreground">ms</span></p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <Label className="text-muted-foreground text-xs">Perda de Pacotes</Label>
            <p className="text-2xl font-bold text-foreground mt-1">— <span className="text-sm font-normal text-muted-foreground">%</span></p>
          </div>
        </div>
      </Card>
    </div>
  );
}
