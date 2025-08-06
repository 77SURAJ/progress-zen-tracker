import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MorningRoutine } from "@/components/dashboard/MorningRoutine";
import { CalorieCalculator } from "@/components/dashboard/CalorieCalculator";
import { StudySessions } from "@/components/dashboard/StudySessions";
import { Classes } from "@/components/dashboard/Classes";
import { Exercise } from "@/components/dashboard/Exercise";
import { Sleep } from "@/components/dashboard/Sleep";
import { WeeklySummary } from "@/components/dashboard/WeeklySummary";
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

const Index = () => {
  const [currentView, setCurrentView] = useState<'daily' | 'weekly'>('daily');
  const [breakfastItems, setBreakfastItems] = useLocalStorage<FoodItem[]>('breakfastItems', []);
  const [snackItems, setSnackItems] = useLocalStorage<FoodItem[]>('snackItems', []);
  const [dinnerItems, setDinnerItems] = useLocalStorage<FoodItem[]>('dinnerItems', []);

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
          
          <div className="flex justify-center gap-4 pt-4">
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
          </div>
        </div>

        {currentView === 'daily' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

            {/* Study Sessions */}
            <StudySessions 
              title="Study Sessions (Day)"
              sessionCount={3}
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

            {/* Exercise */}
            <Exercise />

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
          </div>
        ) : (
          <WeeklySummary />
        )}
      </div>
    </div>
  );
};

export default Index;