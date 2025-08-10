import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ComputeRequest {
  user_id: string;
  date: string; // YYYY-MM-DD
}

function toDateOnly(dateStr: string) {
  return dateStr.slice(0, 10);
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: "Missing Supabase service credentials" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { user_id, date }: ComputeRequest = await req.json();
    if (!user_id || !date) {
      return new Response(JSON.stringify({ error: "Missing user_id or date" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const entry_date = toDateOnly(date);

    // 1) Ensure daily_progress row exists
    let { data: row, error: selErr } = await supabase
      .from("daily_progress")
      .select("*")
      .eq("user_id", user_id)
      .eq("entry_date", entry_date)
      .maybeSingle();

    if (selErr) throw selErr;

    if (!row) {
      const { error: insErr } = await supabase.from("daily_progress").insert({
        user_id,
        entry_date,
      });
      if (insErr) throw insErr;
      const res = await supabase
        .from("daily_progress")
        .select("*")
        .eq("user_id", user_id)
        .eq("entry_date", entry_date)
        .single();
      row = res.data;
    }

    // 2) Aggregate related logs
    const [mealsRes, studiesRes] = await Promise.all([
      supabase
        .from("meal_logs")
        .select("junk, calories")
        .eq("user_id", user_id)
        .eq("entry_date", entry_date),
      supabase
        .from("study_logs")
        .select("completed, duration_minutes")
        .eq("user_id", user_id)
        .eq("session_date", entry_date),
    ]);

    if (mealsRes.error) throw mealsRes.error;
    if (studiesRes.error) throw studiesRes.error;

    const junkIncidents = (mealsRes.data || []).filter((m: any) => !!m.junk).length;
    const studyCompletedCount = (studiesRes.data || []).filter((s: any) => !!s.completed).length;

    // 3) Load points config (optional)
    const defaults: Record<string, number> = {
      wake_3am: 10,
      morning_salad: 5,
      exercise_done: 10,
      study_per_session: 8,
      sleep_10am: 5,
      class_point: 1,
      micro_point: 1,
      junk_penalty: 6, // subtract later
      max_raw: 100,
    };

    const cfgRes = await supabase.from("points_config").select("key,value");
    const config = { ...defaults } as Record<string, number>;
    if (!cfgRes.error && cfgRes.data) {
      for (const row of cfgRes.data) {
        if (row.key && typeof row.value === "number") config[row.key] = row.value;
      }
    }

    // 4) Compute points
    const dp = row as any;
    let raw = 0;
    if (dp.wake_3am) raw += config.wake_3am;
    if (dp.morning_salad) raw += config.morning_salad;
    if (dp.exercise_done) raw += config.exercise_done;
    raw += studyCompletedCount * config.study_per_session;

    // Sleep 10am special flag (we'll infer if wake_time is around 10:00)
    // This is placeholder; real logic may differ per spec
    if (dp.bedtime) {
      // no-op
    }
    if (dp.wake_time) {
      const wt = new Date(dp.wake_time);
      if (wt.getHours() === 10) raw += config.sleep_10am;
    }

    // Classes points from json array length if present
    try {
      const cls = Array.isArray(dp.classes) ? dp.classes : [];
      raw += Math.min(10, cls.filter((c: any) => c?.attended).length * config.class_point);
    } catch {}

    raw -= junkIncidents * config.junk_penalty;
    raw = Math.max(0, raw);

    const normalized = Math.round((raw / config.max_raw) * 100 * 100) / 100;

    const breakdown = {
      wake_3am: dp.wake_3am ? config.wake_3am : 0,
      morning_salad: dp.morning_salad ? config.morning_salad : 0,
      study: studyCompletedCount * config.study_per_session,
      exercise: dp.exercise_done ? config.exercise_done : 0,
      sleep_10am: 0, // simplified placeholder
      junk_penalty: -junkIncidents * config.junk_penalty,
    };

    const { error: updErr } = await supabase
      .from("daily_progress")
      .update({ points_total: normalized, points_breakdown: breakdown })
      .eq("id", dp.id);
    if (updErr) throw updErr;

    const { data: updated } = await supabase
      .from("daily_progress")
      .select("*")
      .eq("id", dp.id)
      .single();

    return new Response(JSON.stringify(updated), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("compute-daily-progress error", error);
    return new Response(JSON.stringify({ error: error?.message ?? "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
