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
      .select("id, status, maintenance_mode, allowed_start_time, allowed_end_time, allow_outside_schedule")
      .eq("token", token)
      .eq("status", "active")
      .maybeSingle();

    if (!reader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (reader.maintenance_mode) {
      return new Response(JSON.stringify({
        status: "maintenance",
        display_message: "Leitor em manutenção",
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Check schedule
    if (reader.allowed_start_time && reader.allowed_end_time && !reader.allow_outside_schedule) {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      if (currentTime < reader.allowed_start_time || currentTime > reader.allowed_end_time) {
        return new Response(JSON.stringify({
          status: "outside_schedule",
          display_message: "Fora do horário permitido",
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    const { uid, device_id } = await req.json();

    if (!uid) {
      return new Response(JSON.stringify({ error: "uid is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Find guardian by RFID UID
    const { data: guardian } = await supabase
      .from("guardians")
      .select("id, name")
      .eq("rfid_uid", uid)
      .eq("status", "Ativo")
      .maybeSingle();

    if (!guardian) {
      return new Response(JSON.stringify({
        status: "not_found",
        display_message: "Cartão não cadastrado",
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Find students linked to this guardian
    const { data: links } = await supabase
      .from("student_guardian")
      .select("student_id")
      .eq("guardian_id", guardian.id);

    if (!links || links.length === 0) {
      return new Response(JSON.stringify({
        status: "no_students",
        display_message: `${guardian.name}\nNenhum aluno vinculado`,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const studentIds = links.map((l) => l.student_id);
    const { data: students } = await supabase
      .from("students")
      .select("id, name, grade, class")
      .in("id", studentIds);

    const studentNames = students?.map((s) => s.name).join(", ") || "";
    const firstStudent = students?.[0];

    return new Response(JSON.stringify({
      status: "ok",
      guardian_name: guardian.name,
      student_name: firstStudent?.name || "",
      students: students || [],
      display_message: `${firstStudent?.name || studentNames}\nDirija-se ao portão`,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
