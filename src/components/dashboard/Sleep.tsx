import { DashboardCard } from "./DashboardCard";
import { Input } from "@/components/ui/input";
import { Moon } from "lucide-react";
import { useDailyProgressSync } from "@/hooks/useDailyProgressSync";

export function Sleep() {
  const { dailyProgress, updateSleepTimes } = useDailyProgressSync();
  
  // Convert ISO strings back to time format for inputs
  const bedtime = dailyProgress?.bedtime ? 
    new Date(dailyProgress.bedtime).toTimeString().slice(0, 5) : '';
  const wakeupTime = dailyProgress?.wake_time ? 
    new Date(dailyProgress.wake_time).toTimeString().slice(0, 5) : '';

  const isCompleted = bedtime !== '' && wakeupTime !== '';

  const calculateSleepHours = () => {
    if (!bedtime || !wakeupTime) return 0;
    
    const bedDate = new Date(`2024-01-01 ${bedtime}`);
    let wakeDate = new Date(`2024-01-01 ${wakeupTime}`);
    
    // If wake time is earlier than bedtime, assume next day
    if (wakeDate <= bedDate) {
      wakeDate = new Date(`2024-01-02 ${wakeupTime}`);
    }
    
    const diffMs = wakeDate.getTime() - bedDate.getTime();
    return Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10;
  };

  const sleepHours = calculateSleepHours();

  return (
    <DashboardCard
      title="Sleep Tracking"
      icon={<Moon className="h-5 w-5 text-primary" />}
      completed={isCompleted}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Bedtime</label>
            <Input
              type="time"
              value={bedtime}
              onChange={(e) => updateSleepTimes(e.target.value, undefined)}
              className="bg-secondary border-border"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Wake-up Time</label>
            <Input
              type="time"
              value={wakeupTime}
              onChange={(e) => updateSleepTimes(undefined, e.target.value)}
              className="bg-secondary border-border"
            />
          </div>
        </div>

        {isCompleted && (
          <div className="p-3 bg-gradient-primary rounded-lg animate-scale-in">
            <div className="text-center">
              <p className="text-sm font-medium text-primary-foreground">
                Sleep Duration: {sleepHours} hours
              </p>
              <p className="text-xs text-primary-foreground/80 mt-1">
                {sleepHours >= 7 && sleepHours <= 9 
                  ? "Perfect sleep duration! 😴" 
                  : sleepHours < 7 
                    ? "Try to get more sleep 💤"
                    : "Maybe a bit too much sleep 🌅"
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}