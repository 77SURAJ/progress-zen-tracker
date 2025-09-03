import { useState } from "react";
import { DashboardCard } from "./DashboardCard";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "@/components/ui/simple-chart";
import { BarChart3, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useWeeklyProgress } from "@/hooks/useWeeklyProgress";

type ChartType = 'wakeUp' | 'calories' | 'study' | 'exercise';

export function WeeklySummary() {
  const [activeChart, setActiveChart] = useState<ChartType>('wakeUp');
  const [weekOffset, setWeekOffset] = useState(0);
  const { data: weeklyResult, isLoading, error } = useWeeklyProgress(weekOffset);
  
  const weeklyData = weeklyResult?.data || [];
  const stats = weeklyResult?.stats;

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

  if (error) {
    return (
      <DashboardCard
        title="Weekly Summary"
        icon={<BarChart3 className="h-5 w-5 text-info" />}
        className="col-span-full"
      >
        <div className="space-y-4 py-8">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-destructive mb-2">
              Failed to load weekly data
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              We couldn't fetch your weekly progress at this moment.
            </p>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4 text-sm">
            <p className="font-medium mb-2">Possible reasons:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Network issue (check your internet connection)</li>
              <li>• Server is temporarily unavailable</li>
              <li>• Data source returned incomplete or invalid values</li>
            </ul>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-sm">
            <p className="font-medium mb-2">👉 What happens now:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• If some data is missing → those days will show as <strong>0</strong> in the graph</li>
              <li>• If no data is available for the whole week → this error will be shown</li>
            </ul>
          </div>

          <div className="text-center pt-4">
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="mr-2"
            >
              Try Again
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Please try again later if the issue persists.
            </p>
          </div>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="Weekly Summary"
      icon={<BarChart3 className="h-5 w-5 text-info" />}
      className="col-span-full"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
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
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setWeekOffset(prev => prev - 1)}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              {weekOffset === 0 ? 'This Week' : `${Math.abs(weekOffset)} week${Math.abs(weekOffset) > 1 ? 's' : ''} ${weekOffset < 0 ? 'ago' : 'ahead'}`}
            </span>
            <Button
              onClick={() => setWeekOffset(prev => prev + 1)}
              variant="outline"
              size="sm"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading weekly data...</span>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {config.type === 'line' ? (
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="day" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                    domain={config.dataKey === 'wakeUp' ? [0, 12] : ['dataMin - 1', 'dataMax + 1']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                    formatter={(value, name) => {
                      if (config.dataKey === 'wakeUp' && value === null) {
                        return ['No data', name];
                      }
                      return [value, name];
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={config.dataKey}
                    stroke={config.color}
                    strokeWidth={3}
                    dot={{ fill: config.color, r: 6 }}
                    activeDot={{ r: 8, stroke: config.color, strokeWidth: 2 }}
                    connectNulls={false}
                  />
                </LineChart>
              ) : (
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="day" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                    domain={[0, 'dataMax + 1']}
                  />
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
        )}

        {/* Show helpful message when no data exists for the week */}
        {!isLoading && weeklyData.every(d => d.calories === 0 && d.studySessions === 0 && d.exercise === 0 && d.wakeUp === null) && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              No activity data for this week yet. Start tracking your daily progress to see your trends!
            </p>
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{stats.wakeUpConsistency}%</div>
              <div className="text-sm text-muted-foreground">Wake-up Consistency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-info">{stats.avgCaloriesPerDay.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Avg Calories/Day</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{stats.studyCompletion}%</div>
              <div className="text-sm text-muted-foreground">Study Completion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.exerciseAdherence}%</div>
              <div className="text-sm text-muted-foreground">Exercise Adherence</div>
            </div>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}