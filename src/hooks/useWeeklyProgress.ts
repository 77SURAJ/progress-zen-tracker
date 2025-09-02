import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

export interface WeeklyData {
  day: string;
  date: string;
  wakeUp: number | null;
  calories: number;
  studySessions: number;
  exercise: number;
}

export interface WeeklyStats {
  wakeUpConsistency: number;
  avgCaloriesPerDay: number;
  studyCompletion: number;
  exerciseAdherence: number;
}

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function getWeekDates(startDate: Date) {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(formatDate(date));
  }
  return dates;
}

function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day; // Adjust to start from Sunday
  return new Date(d.setDate(diff));
}

export const useWeeklyProgress = (weekOffset: number = 0) => {
  const { user } = useAuth();

  return useQuery({
    enabled: !!user,
    queryKey: ["weekly_progress", user?.id, weekOffset],
    queryFn: async () => {
      if (!user) return { data: [], stats: null };

      const startOfWeek = getStartOfWeek(new Date());
      startOfWeek.setDate(startOfWeek.getDate() + (weekOffset * 7));
      const weekDates = getWeekDates(startOfWeek);

      // Fetch daily progress data for the week
      const { data: dailyData, error: dailyError } = await supabase
        .from("daily_progress")
        .select("*")
        .eq("user_id", user.id)
        .in("entry_date", weekDates);

      if (dailyError) throw dailyError;

      // Fetch meal logs for calorie calculation
      const { data: mealData, error: mealError } = await supabase
        .from("meal_logs")
        .select("entry_date, calories")
        .eq("user_id", user.id)
        .in("entry_date", weekDates);

      if (mealError) throw mealError;

      // Fetch study logs for session completion
      const { data: studyData, error: studyError } = await supabase
        .from("study_logs")
        .select("session_date, completed")
        .eq("user_id", user.id)
        .in("session_date", weekDates);

      if (studyError) throw studyError;

      // Create maps for efficient data lookup, with safe null handling
      const dailyMap = new Map((dailyData || []).map(d => [d.entry_date, d]));
      const calorieMap = new Map<string, number>();
      const studyMap = new Map<string, number>();

      // Sum calories by date, handling null/undefined values
      (mealData || []).forEach(meal => {
        if (meal.entry_date && meal.calories) {
          const current = calorieMap.get(meal.entry_date) || 0;
          const calories = typeof meal.calories === 'number' ? meal.calories : Number(meal.calories) || 0;
          calorieMap.set(meal.entry_date, current + calories);
        }
      });

      // Count completed study sessions by date, handling null/undefined values
      (studyData || []).forEach(study => {
        if (study.session_date && study.completed === true) {
          const current = studyMap.get(study.session_date) || 0;
          studyMap.set(study.session_date, current + 1);
        }
      });

      // Build weekly data array with graceful handling of missing data
      const weeklyData: WeeklyData[] = weekDates.map((date, index) => {
        const dailyProgress = dailyMap.get(date);
        
        // Safely parse wake time, default to null if missing or invalid
        let wakeUp: number | null = null;
        try {
          if (dailyProgress?.wake_time) {
            const wake = new Date(dailyProgress.wake_time);
            if (!isNaN(wake.getTime())) {
              wakeUp = wake.getHours() + wake.getMinutes() / 60;
            }
          }
        } catch (error) {
          console.warn(`Invalid wake time for ${date}:`, dailyProgress?.wake_time);
        }

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayOfWeek = new Date(date + 'T00:00:00').getDay(); // Add time to avoid timezone issues

        return {
          day: dayNames[dayOfWeek] || 'Day',
          date,
          wakeUp,
          calories: calorieMap.get(date) || 0,
          studySessions: studyMap.get(date) || 0,
          exercise: dailyProgress?.exercise_done ? 1 : 0,
        };
      });

      // Calculate stats with robust null/undefined handling
      const validWakeUps = weeklyData.filter(d => 
        d.wakeUp !== null && 
        !isNaN(d.wakeUp) && 
        d.wakeUp <= 4
      );
      const wakeUpConsistency = weeklyData.length > 0 ? 
        Math.round((validWakeUps.length / weeklyData.length) * 100) : 0;

      const totalCalories = weeklyData.reduce((sum, d) => {
        const calories = typeof d.calories === 'number' && !isNaN(d.calories) ? d.calories : 0;
        return sum + calories;
      }, 0);
      const avgCaloriesPerDay = weeklyData.length > 0 ? Math.round(totalCalories / weeklyData.length) : 0;

      const totalStudySessions = weeklyData.reduce((sum, d) => {
        const sessions = typeof d.studySessions === 'number' && !isNaN(d.studySessions) ? d.studySessions : 0;
        return sum + sessions;
      }, 0);
      const expectedSessions = weeklyData.length * 3; // 3 sessions per day expected
      const studyCompletion = expectedSessions > 0 ? 
        Math.round((totalStudySessions / expectedSessions) * 100) : 0;

      const exerciseDays = weeklyData.filter(d => d.exercise === 1).length;
      const exerciseAdherence = weeklyData.length > 0 ? 
        Math.round((exerciseDays / weeklyData.length) * 100) : 0;

      const stats: WeeklyStats = {
        wakeUpConsistency: Math.max(0, Math.min(100, wakeUpConsistency)),
        avgCaloriesPerDay: Math.max(0, avgCaloriesPerDay),
        studyCompletion: Math.max(0, Math.min(100, studyCompletion)),
        exerciseAdherence: Math.max(0, Math.min(100, exerciseAdherence)),
      };

      return { data: weeklyData, stats };
    },
  });
};