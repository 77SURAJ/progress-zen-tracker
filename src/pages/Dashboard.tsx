import { Link } from "react-router-dom";
import { useDailyProgress } from "@/hooks/useDailyProgress";
import { useAuth } from "@/components/auth/AuthProvider";
import { CircularProgress } from "@/components/dashboard/CircularProgress";
import { ProgressBar } from "@/components/dashboard/ProgressBar";
import { MealsModule } from "@/components/dashboard/MealsModule";
import { StudySessions } from "@/components/dashboard/StudySessions";
import { JunkFood } from "@/components/dashboard/JunkFood";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: daily, isLoading, recompute } = useDailyProgress();

  if (!user) {
    return (
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Daily Progress Tracker</h1>
        <p className="text-muted-foreground mb-4">Please sign in to view your dashboard.</p>
        <Button asChild><Link to="/auth">Go to Sign In</Link></Button>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Dashboard</h1>
          <p className="text-muted-foreground">Track, log, and visualize your day.</p>
        </div>
        <Button onClick={recompute} variant="secondary">Recompute Score</Button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-1">
          <div className="rounded-xl border p-6 bg-card/40">
            <h3 className="font-semibold mb-3">Daily Score</h3>
            <CircularProgress value={Math.round(daily?.points_total ?? 0)} max={100} />
            <div className="mt-4">
              <ProgressBar value={Number(daily?.points_total ?? 0)} max={100} />
            </div>
          </div>
        </div>
        <div className="col-span-1 md:col-span-2">
          <MealsModule title="Breakfast" mealType="breakfast" />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StudySessions title="Study Sessions" sessionCount={7} storageKey="studySessions" />
        <JunkFood />
      </section>
    </main>
  );
}
