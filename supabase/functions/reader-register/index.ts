import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { device_id, mac, ip, firmware } = await req.json();

    if (!device_id) {
      return new Response(JSON.stringify({ error: "device_id is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if reader already exists
    const { data: existing } = await supabase
      .from("readers")
      .select("id, status, token")
      .eq("device_id", device_id)
      .maybeSingle();

    if (existing) {
      // Update existing reader
      await supabase.from("readers").update({
        ip, firmware, mac, last_seen: new Date().toISOString(), online: true,
      }).eq("id", existing.id);

      return new Response(JSON.stringify({
        status: existing.status,
        approved: existing.status === "active",
        token: existing.status === "active" ? existing.token : null,
        message: existing.status === "pending" ? "Aguardando aprovação do administrador" :
                 existing.status === "blocked" ? "Dispositivo bloqueado" : "Registrado com sucesso",
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Create new pending reader
    await supabase.from("readers").insert({
      device_id, mac, ip, firmware, status: "pending", online: true, last_seen: new Date().toISOString(),
    });

    return new Response(JSON.stringify({
      status: "pending",
      approved: false,
      token: null,
      message: "Dispositivo registrado. Aguardando aprovação do administrador.",
    }), { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
