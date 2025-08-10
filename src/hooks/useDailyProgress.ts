import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/auth/AuthProvider";
import { ensureDailyProgress, getDailyProgress, recomputeDailyProgress } from "@/services/api";
import { supabase } from "@/integrations/supabase/client";

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export const useDailyProgress = (date: string = formatDate(new Date())) => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    enabled: !!user,
    queryKey: ["daily_progress", user?.id, date],
    queryFn: async () => {
      if (!user) return null;
      const row = await getDailyProgress(user.id, date);
      if (row) return row;
      return await ensureDailyProgress(user.id, date);
    },
  });

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("daily-progress-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "daily_progress", filter: `user_id=eq.${user.id}` }, (payload) => {
        const newRow = (payload.new as any) || (payload.old as any);
        if (!newRow || newRow.entry_date !== date) return;
        qc.setQueryData(["daily_progress", user.id, date], newRow);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, date, qc]);

  const recompute = async () => {
    if (!user) return;
    await recomputeDailyProgress(user.id, date);
  };

  return { ...query, recompute };
};
