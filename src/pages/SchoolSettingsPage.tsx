import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Globe, Radio, Volume2, Bus, CreditCard, Shield, Database, Activity, RefreshCw } from "lucide-react";
import GeneralSettings from "@/components/settings/GeneralSettings";
import NetworkSettings from "@/components/settings/NetworkSettings";
import ReadersSettings from "@/components/settings/ReadersSettings";
import AudioSettings from "@/components/settings/AudioSettings";
import TransportSettings from "@/components/settings/TransportSettings";
import RFIDSettings from "@/components/settings/RFIDSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import DatabaseSettings from "@/components/settings/DatabaseSettings";
import MonitoringSettings from "@/components/settings/MonitoringSettings";
import UpdatesSettings from "@/components/settings/UpdatesSettings";

const tabs = [
  { value: "geral", label: "Geral", icon: Settings },
  { value: "rede", label: "Rede", icon: Globe },
  { value: "leitores", label: "Leitores", icon: Radio },
  { value: "audio", label: "Áudio", icon: Volume2 },
  { value: "transporte", label: "Transporte", icon: Bus },
  { value: "rfid", label: "RFID", icon: CreditCard },
  { value: "seguranca", label: "Segurança", icon: Shield },
  { value: "banco", label: "Banco de Dados", icon: Database },
  { value: "monitoramento", label: "Monitoramento", icon: Activity },
  { value: "atualizacoes", label: "Atualizações", icon: RefreshCw },
];

export default function SchoolSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground">Configurações administrativas, técnicas e operacionais do sistema</p>
      </div>

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="flex h-auto flex-wrap gap-1 bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="gap-1.5 rounded-lg border border-transparent px-3 py-2 text-xs font-medium data-[state=active]:border-primary/20 data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6">
          <TabsContent value="geral"><GeneralSettings /></TabsContent>
          <TabsContent value="rede"><NetworkSettings /></TabsContent>
          <TabsContent value="leitores"><ReadersSettings /></TabsContent>
          <TabsContent value="audio"><AudioSettings /></TabsContent>
          <TabsContent value="transporte"><TransportSettings /></TabsContent>
          <TabsContent value="rfid"><RFIDSettings /></TabsContent>
          <TabsContent value="seguranca"><SecuritySettings /></TabsContent>
          <TabsContent value="banco"><DatabaseSettings /></TabsContent>
          <TabsContent value="monitoramento"><MonitoringSettings /></TabsContent>
          <TabsContent value="atualizacoes"><UpdatesSettings /></TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
