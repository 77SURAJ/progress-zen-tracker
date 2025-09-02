import { DashboardCard } from "./DashboardCard";
import { AnimatedToggle } from "./AnimatedToggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sunrise } from "lucide-react";
import { useDailyProgressSync } from "@/hooks/useDailyProgressSync";

export function MorningRoutine() {
  const { dailyProgress, updateField } = useDailyProgressSync();
  
  const wokeUp3AM = dailyProgress?.wake_3am || false;
  const morningSalad = dailyProgress?.morning_salad || false;
  const isCompleted = wokeUp3AM && morningSalad;

  return (
    <DashboardCard
      title="Morning Routine"
      icon={<Sunrise className="h-5 w-5 text-warning" />}
      completed={isCompleted}
    >
      <div className="space-y-4">
        <AnimatedToggle
          checked={wokeUp3AM}
          onCheckedChange={(checked) => updateField('wake_3am', checked)}
          label="Woke up by 3 AM"
        />
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Morning Salad</label>
          <Select 
            value={morningSalad ? "had" : "skipped"} 
            onValueChange={(value) => updateField('morning_salad', value === "had")}
          >
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="had">Had morning salad</SelectItem>
              <SelectItem value="skipped">Skipped</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </DashboardCard>
  );
}