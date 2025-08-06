import { useState } from "react";
import { DashboardCard } from "./DashboardCard";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "@/components/ui/simple-chart";
import { BarChart3, TrendingUp } from "lucide-react";

// Mock data for the week
const weeklyData = [
  { day: 'Mon', wakeUp: 3, calories: 1800, studySessions: 3, exercise: 1 },
  { day: 'Tue', wakeUp: 3.5, calories: 2100, studySessions: 2, exercise: 0 },
  { day: 'Wed', wakeUp: 3, calories: 1900, studySessions: 3, exercise: 1 },
  { day: 'Thu', wakeUp: 4, calories: 2300, studySessions: 2, exercise: 1 },
  { day: 'Fri', wakeUp: 3.5, calories: 2000, studySessions: 3, exercise: 0 },
  { day: 'Sat', wakeUp: 5, calories: 2500, studySessions: 1, exercise: 1 },
  { day: 'Sun', wakeUp: 4, calories: 2200, studySessions: 2, exercise: 1 },
];

type ChartType = 'wakeUp' | 'calories' | 'study' | 'exercise';

export function WeeklySummary() {
  const [activeChart, setActiveChart] = useState<ChartType>('wakeUp');

  const chartConfig = {
    wakeUp: {
      title: 'Wake-up Times',
      dataKey: 'wakeUp',
      color: '#8b5cf6',
      type: 'line' as const,
      yLabel: 'Hours'
    },
    calories: {
      title: 'Daily Calories',
      dataKey: 'calories',
      color: '#06b6d4',
      type: 'bar' as const,
      yLabel: 'Calories'
    },
    study: {
      title: 'Study Sessions',
      dataKey: 'studySessions',
      color: '#10b981',
      type: 'bar' as const,
      yLabel: 'Sessions'
    },
    exercise: {
      title: 'Exercise Days',
      dataKey: 'exercise',
      color: '#f59e0b',
      type: 'bar' as const,
      yLabel: 'Days'
    }
  };

  const config = chartConfig[activeChart];

  return (
    <DashboardCard
      title="Weekly Summary"
      icon={<BarChart3 className="h-5 w-5 text-info" />}
      className="col-span-full"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {Object.entries(chartConfig).map(([key, { title }]) => (
            <Button
              key={key}
              onClick={() => setActiveChart(key as ChartType)}
              variant={activeChart === key ? "default" : "outline"}
              size="sm"
              className={activeChart === key ? "bg-gradient-primary" : ""}
            >
              {title}
            </Button>
          ))}
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {config.type === 'line' ? (
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={config.dataKey}
                  stroke={config.color}
                  strokeWidth={3}
                  dot={{ fill: config.color, r: 6 }}
                  activeDot={{ r: 8, stroke: config.color, strokeWidth: 2 }}
                />
              </LineChart>
            ) : (
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar
                  dataKey={config.dataKey}
                  fill={config.color}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">85%</div>
            <div className="text-sm text-muted-foreground">Wake-up Consistency</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-info">2,114</div>
            <div className="text-sm text-muted-foreground">Avg Calories/Day</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">71%</div>
            <div className="text-sm text-muted-foreground">Study Completion</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">71%</div>
            <div className="text-sm text-muted-foreground">Exercise Adherence</div>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}