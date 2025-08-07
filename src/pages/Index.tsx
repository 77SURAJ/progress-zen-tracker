import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ProgressDashboard } from "@/components/dashboard/ProgressDashboard";
import { MorningRoutine } from "@/components/dashboard/MorningRoutine";
import { CalorieCalculator } from "@/components/dashboard/CalorieCalculator";
import { StudySessions } from "@/components/dashboard/StudySessions";
import { Classes } from "@/components/dashboard/Classes";
import { Exercise } from "@/components/dashboard/Exercise";
import { Sleep } from "@/components/dashboard/Sleep";
import { JunkFood } from "@/components/dashboard/JunkFood";
import { PointsTracker } from "@/components/dashboard/PointsTracker";
import { WeeklySummary } from "@/components/dashboard/WeeklySummary";
import { AIPointSystem } from "@/components/dashboard/AIPointSystem";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Calendar, BarChart3, Target } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

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

const Index = () => {
  const [currentView, setCurrentView] = useState<'daily' | 'weekly' | 'progress'>('daily');
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [breakfastItems, setBreakfastItems] = useLocalStorage<FoodItem[]>('breakfastItems', []);
  const [snackItems, setSnackItems] = useLocalStorage<FoodItem[]>('snackItems', []);
  const [dinnerItems, setDinnerItems] = useLocalStorage<FoodItem[]>('dinnerItems', []);
  const [studyConfig] = useLocalStorage<StudySessionConfig>('studyConfig', {
    sessionCount: 3,
    sessionDuration: 80,
    pointsPerSession: 8
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-fade-in">
            Daily Progress Tracker
          </h1>
          <p className="text-xl text-muted-foreground animate-fade-in">
            Track your daily habits and watch your progress grow
          </p>
          
          <div className="flex justify-center gap-4 pt-4 flex-wrap">
            <Button
              onClick={() => setCurrentView('daily')}
              variant={currentView === 'daily' ? 'default' : 'outline'}
              className={currentView === 'daily' ? 'bg-gradient-primary' : ''}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Daily View
            </Button>
            <Button
              onClick={() => setCurrentView('weekly')}
              variant={currentView === 'weekly' ? 'default' : 'outline'}
              className={currentView === 'weekly' ? 'bg-gradient-primary' : ''}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Weekly Summary
            </Button>
            <Button
              onClick={() => setCurrentView('progress')}
              variant={currentView === 'progress' ? 'default' : 'outline'}
              className={currentView === 'progress' ? 'bg-gradient-primary' : ''}
            >
              <Target className="h-4 w-4 mr-2" />
              3D Progress
            </Button>
            <Button
              onClick={signOut}
              variant="ghost"
              className="ml-auto"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {currentView === 'progress' ? (
          <ProgressDashboard />
        ) : currentView === 'daily' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Points Tracker - Featured at top */}
            <div className="md:col-span-2 lg:col-span-3">
              <PointsTracker />
            </div>

            {/* Morning Routine */}
            <MorningRoutine />

            {/* Breakfast */}
            <DashboardCard
              title="Breakfast"
              icon={<Target className="h-5 w-5 text-warning" />}
              completed={breakfastItems.length > 0}
            >
              <CalorieCalculator
                title="Breakfast"
                items={breakfastItems}
                onItemsChange={setBreakfastItems}
              />
            </DashboardCard>

            {/* Study Sessions (Day) */}
            <StudySessions 
              title="Study Sessions (Day)"
              sessionCount={studyConfig.sessionCount}
              storageKey="dayStudySessions"
            />

            {/* Classes */}
            <Classes />

            {/* Snack Break */}
            <DashboardCard
              title="Snack Break"
              icon={<Target className="h-5 w-5 text-info" />}
              completed={snackItems.length > 0}
            >
              <CalorieCalculator
                title="Snacks"
                items={snackItems}
                onItemsChange={setSnackItems}
                showJunkDetection={true}
              />
            </DashboardCard>

            {/* After Noon Study Sessions */}
            <StudySessions 
              title="After Noon Study Session"
              sessionCount={studyConfig.sessionCount}
              storageKey="afterStudySessions"
            />

            {/* Exercise */}
            <Exercise />

            {/* Junk Food Tracking */}
            <JunkFood />

            {/* Dinner */}
            <DashboardCard
              title="Dinner"
              icon={<Target className="h-5 w-5 text-primary" />}
              completed={dinnerItems.length > 0}
            >
              <CalorieCalculator
                title="Dinner"
                items={dinnerItems}
                onItemsChange={setDinnerItems}
              />
            </DashboardCard>

            {/* Night Study */}
            <StudySessions 
              title="Night Study"
              sessionCount={1}
              storageKey="nightStudySessions"
            />

            {/* Sleep */}
            <Sleep />
            
            {/* AI Point System */}
            <div className="md:col-span-2 lg:col-span-1">
              <AIPointSystem />
            </div>
          </div>
        ) : (
          <WeeklySummary />
        )}
      </div>
    </div>
  );
};

export default Index;