import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useDailyProgress } from "./useDailyProgress";

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export const useDailyProgressSync = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const today = formatDate(new Date());
  const { data: dailyProgress, recompute } = useDailyProgress(today);

  const updateField = async (field: string, value: any) => {
    if (!user || !dailyProgress) return;

    try {
      const { error } = await supabase
        .from("daily_progress")
        .update({ [field]: value })
        .eq("id", dailyProgress.id);

      if (error) throw error;

      // Trigger recompute to recalculate points
      await recompute();
      
      // Invalidate weekly data to refresh charts
      qc.invalidateQueries({ queryKey: ["weekly_progress"] });
    } catch (error) {
      console.error(`Failed to update ${field}:`, error);
    }
  };

  const updateSleepTimes = async (bedtime?: string, wakeTime?: string) => {
    if (!user || !dailyProgress) return;

    try {
      const updates: any = {};
      
      if (bedtime !== undefined) {
        if (bedtime) {
          const bedDate = new Date();
          const [hours, minutes] = bedtime.split(':').map(Number);
          bedDate.setHours(hours, minutes, 0, 0);
          updates.bedtime = bedDate.toISOString();
        } else {
          updates.bedtime = null;
        }
      }

      if (wakeTime !== undefined) {
        if (wakeTime) {
          const wakeDate = new Date();
          const [hours, minutes] = wakeTime.split(':').map(Number);
          wakeDate.setHours(hours, minutes, 0, 0);
          updates.wake_time = wakeDate.toISOString();
        } else {
          updates.wake_time = null;
        }
      }

      const { error } = await supabase
        .from("daily_progress")
        .update(updates)
        .eq("id", dailyProgress.id);

      if (error) throw error;

      await recompute();
      qc.invalidateQueries({ queryKey: ["weekly_progress"] });
    } catch (error) {
      console.error("Failed to update sleep times:", error);
    }
  };

  return {
    dailyProgress,
    updateField,
    updateSleepTimes,
    recompute
  };
};