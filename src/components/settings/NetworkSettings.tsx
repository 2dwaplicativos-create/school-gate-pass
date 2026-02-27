import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Wifi, Plus, Trash2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NetworkData {
  id?: string;
  modo_rede: string;
  ip: string;
  mascara_subrede: string;
  gateway: string;
  dns_primario: string;
  dns_secundario: string;
  ip_atual: string;
  gateway_atual: string;
  dns_atual: string;
  nome_servidor: string;
  habilitar_mdns: boolean;
  habilitar_dns_interno: boolean;
  habilitar_dhcp: boolean;
  dhcp_faixa_inicial: string;
  dhcp_faixa_final: string;
  dhcp_tempo_lease_minutos: number;
}

interface DnsRecord {
  id: string;
  hostname: string;
  ip: string;
}

export default function NetworkSettings() {
  const [data, setData] = useState<NetworkData>({
    modo_rede: "DHCP", ip: "", mascara_subrede: "255.255.255.0", gateway: "",
    dns_primario: "8.8.8.8", dns_secundario: "8.8.4.4", ip_atual: "", gateway_atual: "",
    dns_atual: "", nome_servidor: "api.escola.local", habilitar_mdns: false,
    habilitar_dns_interno: false, habilitar_dhcp: false, dhcp_faixa_inicial: "",
    dhcp_faixa_final: "", dhcp_tempo_lease_minutos: 60,
  });
  const [dnsRecords, setDnsRecords] = useState<DnsRecord[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const [net, dns] = await Promise.all([
      supabase.from("network_settings").select("*").limit(1).single(),
      supabase.from("dns_records").select("*").order("hostname"),
    ]);
    if (net.data) setData({ ...net.data });
    if (dns.data) setDnsRecords(dns.data);
  };

  const update = (field: keyof NetworkData, value: any) => setData((p) => ({ ...p, [field]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const { id, ...payload } = data;
      if (id) {
        await supabase.from("network_settings").update(payload).eq("id", id);
      } else {
        await supabase.from("network_settings").insert(payload);
      }
      toast.success("Configurações de rede salvas!");
      fetchAll();
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const addDns = async () => {
    await supabase.from("dns_records").insert({ hostname: "novo.local", ip: "192.168.1.1" });
    fetchAll();
  };

  const deleteDns = async (id: string) => {
    await supabase.from("dns_records").delete().eq("id", id);
    fetchAll();
  };

  return (
    <div className="space-y-6">
      {/* Server Config */}
      <Card className="border-0 shadow-card p-6">
        <h2 className="text-base font-semibold text-foreground">Configuração do Servidor</h2>
        <Separator className="my-4" />
        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label>Modo de Rede</Label>
            <Select value={data.modo_rede} onValueChange={(v) => update("modo_rede", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="DHCP">DHCP (Automático)</SelectItem>
                <SelectItem value="IP_FIXO">IP Fixo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {data.modo_rede === "IP_FIXO" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2"><Label>IP</Label><Input value={data.ip} onChange={(e) => update("ip", e.target.value)} /></div>
              <div className="grid gap-2"><Label>Máscara</Label><Input value={data.mascara_subrede} onChange={(e) => update("mascara_subrede", e.target.value)} /></div>
              <div className="grid gap-2"><Label>Gateway</Label><Input value={data.gateway} onChange={(e) => update("gateway", e.target.value)} /></div>
              <div className="grid gap-2"><Label>DNS Primário</Label><Input value={data.dns_primario} onChange={(e) => update("dns_primario", e.target.value)} /></div>
              <div className="grid gap-2"><Label>DNS Secundário</Label><Input value={data.dns_secundario} onChange={(e) => update("dns_secundario", e.target.value)} /></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="grid gap-2"><Label>IP Atual</Label><Input value={data.ip_atual} readOnly className="bg-muted" /></div>
              <div className="grid gap-2"><Label>Gateway Atual</Label><Input value={data.gateway_atual} readOnly className="bg-muted" /></div>
              <div className="grid gap-2"><Label>DNS Atual</Label><Input value={data.dns_atual} readOnly className="bg-muted" /></div>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="gap-2"><Wifi className="h-3.5 w-3.5" /> Testar Conexão</Button>
            <Button variant="outline" size="sm" className="gap-2"><RefreshCw className="h-3.5 w-3.5" /> Reiniciar Rede</Button>
          </div>
        </div>
      </Card>

      {/* DNS Local */}
      <Card className="border-0 shadow-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">DNS Local</h2>
          <Button size="sm" variant="outline" className="gap-1" onClick={addDns}><Plus className="h-3.5 w-3.5" /> Adicionar</Button>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Nome do Servidor</Label>
            <Input value={data.nome_servidor} onChange={(e) => update("nome_servidor", e.target.value)} />
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2"><Switch checked={data.habilitar_mdns} onCheckedChange={(v) => update("habilitar_mdns", v)} /><Label>mDNS</Label></div>
            <div className="flex items-center gap-2"><Switch checked={data.habilitar_dns_interno} onCheckedChange={(v) => update("habilitar_dns_interno", v)} /><Label>DNS Interno</Label></div>
          </div>
          {dnsRecords.length > 0 && (
            <div className="space-y-2">
              <Label className="text-muted-foreground">Registros DNS</Label>
              {dnsRecords.map((r) => (
                <div key={r.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <Badge variant="secondary">{r.hostname}</Badge>
                  <span className="text-sm text-muted-foreground">→</span>
                  <span className="text-sm font-mono">{r.ip}</span>
                  <Button size="sm" variant="ghost" className="ml-auto h-7 w-7 p-0" onClick={() => deleteDns(r.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Button className="gradient-primary text-primary-foreground shadow-soft gap-2" onClick={save} disabled={saving}>
        <Save className="h-4 w-4" /> {saving ? "Salvando..." : "Salvar Configurações de Rede"}
      </Button>
    </div>
  );
}
