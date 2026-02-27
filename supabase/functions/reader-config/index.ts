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
      .select("*")
      .eq("token", token)
      .eq("status", "active")
      .maybeSingle();

    if (!reader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      display_mode: "server_controlled",
      current_status_message: reader.display_status_message || "Aguarde o horário de saída",
      pre_queue_message: reader.display_pre_queue_message || "Aguarde o horário de saída",
      release_message: reader.display_release_message || "Passe sua TAG e aguarde",
      temporary_message_timeout: reader.temporary_message_timeout || 3,
      maintenance_mode: reader.maintenance_mode,
      name: reader.name,
      location: reader.location,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
