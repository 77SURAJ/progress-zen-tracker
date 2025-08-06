import { DashboardCard } from "./DashboardCard";
import { Progress } from "@/components/ui/progress";
import { CircularProgress } from "./CircularProgress";
import { Trophy, Star } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface StudySession {
  id: string;
  completed: boolean;
  startTime: string | null;
  endTime: string | null;
  isActive: boolean;
}

interface ClassItem {
  id: string;
  name: string;
  attended: boolean;
}

interface FoodItem {
  id: string;
  name: string;
  quantity: string;
  calories: number;
  isJunk?: boolean;
}

interface StudySessionConfig {
  sessionCount: number;
  sessionDuration: number;
  pointsPerSession: number;
}

export function PointsTracker() {
  // Get data from localStorage
  const [wokeUp3AM] = useLocalStorage('wokeUp3AM', false);
  const [morningSalad] = useLocalStorage('morningSalad', '');
  const [exerciseDone] = useLocalStorage('exerciseDone', false);
  const [dayStudySessions] = useLocalStorage<StudySession[]>('dayStudySessions', []);
  const [afterStudySessions] = useLocalStorage<StudySession[]>('afterStudySessions', []);
  const [nightStudySessions] = useLocalStorage<StudySession[]>('nightStudySessions', []);
  const [bedtime] = useLocalStorage('bedtime', '');
  const [wakeupTime] = useLocalStorage('wakeupTime', '');
  const [junkFoodItems] = useLocalStorage<FoodItem[]>('junkFoodItems', []);
  const [studyConfig] = useLocalStorage<StudySessionConfig>('studyConfig', {
    sessionCount: 3,
    sessionDuration: 80,
    pointsPerSession: 8
  });

  // Calculate points
  let totalPoints = 0;
  const pointsBreakdown = [];

  // Wake up at 3 AM (10 points)
  if (wokeUp3AM) {
    totalPoints += 10;
    pointsBreakdown.push({ task: "Woke up by 3 AM", points: 10 });
  }

  // Morning salad (5 points)
  if (morningSalad === 'had') {
    totalPoints += 5;
    pointsBreakdown.push({ task: "Morning salad", points: 5 });
  }

  // Study sessions (configurable points per session)
  const allSessions = [...dayStudySessions, ...afterStudySessions, ...nightStudySessions];
  const completedSessions = allSessions.filter(session => session.completed);
  const sessionPoints = completedSessions.length * studyConfig.pointsPerSession;
  totalPoints += sessionPoints;
  if (sessionPoints > 0) {
    pointsBreakdown.push({ task: `${completedSessions.length} study sessions`, points: sessionPoints });
  }

  // Exercise (10 points)
  if (exerciseDone) {
    totalPoints += 10;
    pointsBreakdown.push({ task: "Exercise completed", points: 10 });
  }

  // Sleep by 10 PM (5 points) - check if bedtime is before 22:00
  if (bedtime && bedtime <= '22:00') {
    totalPoints += 5;
    pointsBreakdown.push({ task: "Sleep by 10 PM", points: 5 });
  }

  // Junk food penalty (-6 points)
  if (junkFoodItems.length > 0) {
    totalPoints -= 6;
    pointsBreakdown.push({ task: "Junk food penalty", points: -6 });
  }

  const maxPoints = 100;
  const progressPercentage = Math.min((totalPoints / maxPoints) * 100, 100);
  
  // Determine rating based on points
  let rating = "Needs Improvement";
  let ratingColor = "text-destructive";
  let ratingIcon = "😔";
  
  if (totalPoints >= 80) {
    rating = "Excellent!";
    ratingColor = "text-success";
    ratingIcon = "🏆";
  } else if (totalPoints >= 60) {
    rating = "Good Progress";
    ratingColor = "text-warning";
    ratingIcon = "⭐";
  } else if (totalPoints >= 40) {
    rating = "Fair";
    ratingColor = "text-info";
    ratingIcon = "👍";
  }

  return (
    <DashboardCard
      title="Daily Points Tracker"
      icon={<Trophy className="h-5 w-5 text-warning" />}
      completed={totalPoints >= 80}
    >
      <div className="space-y-4">
        {/* Circular Progress Display */}
        <div className="flex items-center justify-center mb-4">
          <CircularProgress 
            value={totalPoints} 
            max={maxPoints}
            size={160}
            strokeWidth={12}
          >
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {totalPoints}
              </div>
              <div className="text-sm text-muted-foreground">
                /{maxPoints}
              </div>
              <div className={`text-xs font-medium ${ratingColor} flex items-center justify-center gap-1 mt-1`}>
                <span>{ratingIcon}</span>
                {rating}
              </div>
            </div>
          </CircularProgress>
        </div>

        {/* Linear Progress Bar */}
        <Progress value={progressPercentage} className="h-2" />

        {/* Points Breakdown */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Points Breakdown:</h4>
          {pointsBreakdown.length > 0 ? (
            <div className="space-y-1">
              {pointsBreakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span>{item.task}</span>
                  <span className={`font-medium ${item.points > 0 ? 'text-success' : 'text-destructive'}`}>
                    {item.points > 0 ? '+' : ''}{item.points}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No points earned yet today</p>
          )}
        </div>

        {/* Motivational Message */}
        {totalPoints < 40 && (
          <div className="p-3 bg-muted rounded-lg text-center">
            <Star className="h-5 w-5 text-warning mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Keep going! Every small step counts towards your goals.
            </p>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}