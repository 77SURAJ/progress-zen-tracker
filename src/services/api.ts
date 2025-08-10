import { supabase } from "@/integrations/supabase/client";

export type MealType = "breakfast" | "snack" | "dinner";

export async function getDailyProgress(userId: string, date: string) {
  const { data, error } = await supabase
    .from("daily_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("entry_date", date)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function ensureDailyProgress(userId: string, date: string) {
  let existing = await getDailyProgress(userId, date);
  if (!existing) {
    const { error } = await supabase.from("daily_progress").insert({ user_id: userId, entry_date: date });
    if (error) throw error;
    existing = await getDailyProgress(userId, date);
  }
  return existing;
}

export async function addMealLog(params: { userId: string; date: string; meal_type: MealType; item: string; quantity: string; calories: number; junk: boolean; }) {
  const { error } = await supabase.from("meal_logs").insert({
    user_id: params.userId,
    entry_date: params.date,
    meal_type: params.meal_type,
    item: params.item,
    quantity: params.quantity,
    calories: params.calories,
    junk: params.junk,
  });
  if (error) throw error;
}

export async function startStudySession(params: { userId: string; date: string; slot: string; }) {
  const { data, error } = await supabase.from("study_logs").insert({
    user_id: params.userId,
    session_date: params.date,
    slot: params.slot,
    start_ts: new Date().toISOString(),
  }).select("id").single();
  if (error) throw error;
  return data?.id as string;
}

export async function endStudySession(params: { id: string }) {
  const { data, error } = await supabase
    .from("study_logs")
    .update({ end_ts: new Date().toISOString(), completed: true })
    .eq("id", params.id)
    .select("start_ts, end_ts")
    .single();
  if (error) throw error;
  return data;
}

export async function recomputeDailyProgress(userId: string, date: string) {
  const { data, error } = await supabase.functions.invoke("compute-daily-progress", {
    body: { user_id: userId, date },
  });
  if (error) throw error;
  return data;
}
