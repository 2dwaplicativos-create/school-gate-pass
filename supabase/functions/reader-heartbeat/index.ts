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

    // Validate token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: reader } = await supabase
      .from("readers")
      .select("id, status, maintenance_mode, ip, allowed_ip_range, allowed_mac")
      .eq("token", token)
      .eq("status", "active")
      .maybeSingle();

    if (!reader) {
      return new Response(JSON.stringify({ error: "Invalid token or reader not active" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));

    // Update heartbeat
    await supabase.from("readers").update({
      last_seen: new Date().toISOString(),
      online: true,
      ...(body.ip ? { ip: body.ip } : {}),
      ...(body.firmware ? { firmware: body.firmware } : {}),
    }).eq("id", reader.id);

    // Also mark offline readers that haven't sent heartbeat in 60s
    await supabase.rpc("mark_offline_readers").catch(() => {
      // Function may not exist yet, ignore
    });

    return new Response(JSON.stringify({
      status: "ok",
      maintenance_mode: reader.maintenance_mode,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
