import { useEffect } from "react";
import { WeeklySummary } from "@/components/dashboard/WeeklySummary";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Weekly() {
  useEffect(() => {
    document.title = "Weekly Summary | Daily Progress Tracker";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Weekly summary of wake-up consistency, calories, study sessions, and exercise adherence in Daily Progress Tracker.");
  }, []);

  return (
    <main className="container mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Weekly Summary</h1>
          <p className="text-muted-foreground">Insights across the last 7 days.</p>
        </div>
        <Button asChild variant="secondary"><Link to="/dashboard">Back to Dashboard</Link></Button>
      </header>

      <section className="grid grid-cols-1 gap-6">
        <WeeklySummary />
      </section>
    </main>
  );
}
