import { DashboardCard } from "./DashboardCard";
import { AnimatedToggle } from "./AnimatedToggle";
import { Dumbbell } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function Exercise() {
  const [exerciseDone, setExerciseDone] = useLocalStorage('exerciseDone', false);

  return (
    <DashboardCard
      title="Exercise"
      icon={<Dumbbell className="h-5 w-5 text-success" />}
      completed={exerciseDone}
    >
      <div className="space-y-4">
        <AnimatedToggle
          checked={exerciseDone}
          onCheckedChange={setExerciseDone}
          label="Exercise completed today"
        />
        
        {exerciseDone && (
          <div className="text-center p-4 bg-gradient-success rounded-lg animate-scale-in">
            <div className="text-4xl animate-bounce-subtle">💪</div>
            <p className="text-sm font-medium text-success-foreground mt-2">
              Great job! Keep up the momentum!
            </p>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}