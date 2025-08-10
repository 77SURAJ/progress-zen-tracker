import { supabase } from "@/integrations/supabase/client";

export type ParsedCalories = {
  items: Array<{ name: string; qty: string; grams: number | null; calories: number; junk: boolean; junk_reason?: string | null }>
  total_calories: number
  junk_incidents: number
  recommendations: string[]
  confidence: number
};

export async function parseAndComputeCalories(text: string): Promise<ParsedCalories> {
  const { data, error } = await supabase.functions.invoke("parse-and-compute-calories", {
    body: { text },
  });

  if (error) {
    throw new Error(error.message || "Failed to parse calories");
  }

  return data as ParsedCalories;
}
