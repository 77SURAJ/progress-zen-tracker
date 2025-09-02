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

      // Aggregate data by date
      const dailyMap = new Map(dailyData?.map(d => [d.entry_date, d]) || []);
      const calorieMap = new Map<string, number>();
      const studyMap = new Map<string, number>();

      // Sum calories by date
      mealData?.forEach(meal => {
        const current = calorieMap.get(meal.entry_date) || 0;
        calorieMap.set(meal.entry_date, current + (Number(meal.calories) || 0));
      });

      // Count completed study sessions by date
      studyData?.forEach(study => {
        if (study.completed) {
          const current = studyMap.get(study.session_date) || 0;
          studyMap.set(study.session_date, current + 1);
        }
      });

      // Build weekly data array
      const weeklyData: WeeklyData[] = weekDates.map((date, index) => {
        const dailyProgress = dailyMap.get(date);
        const wakeTime = dailyProgress?.wake_time;
        
        let wakeUp: number | null = null;
        if (wakeTime) {
          const wake = new Date(wakeTime);
          wakeUp = wake.getHours() + wake.getMinutes() / 60;
        }

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayOfWeek = new Date(date).getDay();

        return {
          day: dayNames[dayOfWeek],
          date,
          wakeUp,
          calories: calorieMap.get(date) || 0,
          studySessions: studyMap.get(date) || 0,
          exercise: dailyProgress?.exercise_done ? 1 : 0,
        };
      });

      // Calculate stats
      const validWakeUps = weeklyData.filter(d => d.wakeUp !== null && d.wakeUp <= 4); // Wake up by 4 AM is good
      const wakeUpConsistency = weeklyData.length > 0 ? (validWakeUps.length / weeklyData.length) * 100 : 0;

      const totalCalories = weeklyData.reduce((sum, d) => sum + d.calories, 0);
      const avgCaloriesPerDay = weeklyData.length > 0 ? Math.round(totalCalories / weeklyData.length) : 0;

      const totalStudySessions = weeklyData.reduce((sum, d) => sum + d.studySessions, 0);
      const expectedSessions = weeklyData.length * 3; // 3 sessions per day expected
      const studyCompletion = expectedSessions > 0 ? (totalStudySessions / expectedSessions) * 100 : 0;

      const exerciseDays = weeklyData.filter(d => d.exercise === 1).length;
      const exerciseAdherence = weeklyData.length > 0 ? (exerciseDays / weeklyData.length) * 100 : 0;

      const stats: WeeklyStats = {
        wakeUpConsistency: Math.round(wakeUpConsistency),
        avgCaloriesPerDay,
        studyCompletion: Math.round(studyCompletion),
        exerciseAdherence: Math.round(exerciseAdherence),
      };

      return { data: weeklyData, stats };
    },
  });
};