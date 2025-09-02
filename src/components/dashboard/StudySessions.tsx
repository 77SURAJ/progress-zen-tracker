import { useState } from "react";
import { DashboardCard } from "./DashboardCard";
import { ProgressBar } from "./ProgressBar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen, Play, Square } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { startStudySession, endStudySession } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface StudySessionConfig {
  sessionCount: number;
  sessionDuration: number;
  pointsPerSession: number;
}

interface StudySession {
  id: string;
  completed: boolean;
  startTime?: string;
  endTime?: string;
  isActive: boolean;
  dbId?: string;
}

interface StudySessionsProps {
  title: string;
  sessionCount: number;
  storageKey: string;
}

export function StudySessions({ title, sessionCount, storageKey }: StudySessionsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const today = new Date().toISOString().slice(0, 10);
  
  const [studyConfig] = useState<StudySessionConfig>({
    sessionCount: 3,
    sessionDuration: 80,
    pointsPerSession: 8
  });
  
  // Use configured session count and duration
  const actualSessionCount = sessionCount || studyConfig.sessionCount;
  const sessionDuration = studyConfig.sessionDuration;
  
  const [sessions, setSessions] = useState<StudySession[]>(
    Array.from({ length: actualSessionCount }, (_, i) => ({
      id: `${storageKey}-${i}`,
      completed: false,
      isActive: false
    }))
  );

  const completedSessions = sessions.filter(s => s.completed).length;
  const activeSessions = sessions.filter(s => s.isActive).length;
  
  // Ensure sessions array matches the configured count
  if (sessions.length !== actualSessionCount) {
    const updatedSessions = Array.from({ length: actualSessionCount }, (_, i) => 
      sessions[i] || {
        id: `${storageKey}-${i}`,
        completed: false,
        isActive: false
      }
    );
    setSessions(updatedSessions);
  }

  const toggleSession = (id: string) => {
    setSessions(sessions.map(session => 
      session.id === id 
        ? { ...session, completed: !session.completed, isActive: false }
        : session
    ));
  };

  const startSession = async (id: string) => {
    if (!user) return;
    
    try {
      const sessionId = await startStudySession({
        userId: user.id,
        date: today,
        slot: id
      });

      setSessions(sessions.map(session => 
        session.id === id 
          ? { ...session, isActive: true, startTime: new Date().toLocaleTimeString(), dbId: sessionId }
          : { ...session, isActive: false }
      ));
    } catch (error: any) {
      toast({ title: "Failed to start session", description: error.message, variant: "destructive" });
    }
  };

  const stopSession = async (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (!session?.dbId) return;

    try {
      await endStudySession({ id: session.dbId });
      
      setSessions(sessions.map(s => 
        s.id === id 
          ? { 
              ...s, 
              isActive: false, 
              endTime: new Date().toLocaleTimeString(),
              completed: true 
            }
          : s
      ));

      // Trigger recompute and refresh weekly data
      qc.invalidateQueries({ queryKey: ["daily_progress"] });
      qc.invalidateQueries({ queryKey: ["weekly_progress"] });
    } catch (error: any) {
      toast({ title: "Failed to stop session", description: error.message, variant: "destructive" });
    }
  };

  return (
    <DashboardCard
      title={title}
      icon={<BookOpen className="h-5 w-5 text-info" />}
      completed={completedSessions === actualSessionCount}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{completedSessions}/{actualSessionCount} sessions</span>
          </div>
          <ProgressBar value={completedSessions} max={actualSessionCount} />
        </div>

        <div className="space-y-3">
          {sessions.map((session, index) => (
            <div key={session.id} className={cn(
              "p-3 rounded-lg border transition-all duration-300",
              session.completed ? "border-success bg-success/10" : 
              session.isActive ? "border-warning bg-warning/10 animate-pulse" : 
              "border-border bg-secondary"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={session.completed}
                    onCheckedChange={() => toggleSession(session.id)}
                    disabled={session.isActive}
                  />
                  <span className="font-medium">Session {index + 1} ({sessionDuration} min)</span>
                  {session.isActive && (
                    <span className="text-warning text-sm animate-bounce-subtle">
                      Active
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {session.startTime && (
                    <span className="text-xs text-muted-foreground">
                      {session.startTime}
                      {session.endTime && ` - ${session.endTime}`}
                    </span>
                  )}
                  
                  {!session.completed && (
                    <Button
                      onClick={() => session.isActive ? stopSession(session.id) : startSession(session.id)}
                      size="sm"
                      variant={session.isActive ? "destructive" : "default"}
                      className="h-8"
                    >
                      {session.isActive ? (
                        <>
                          <Square className="h-3 w-3 mr-1" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 mr-1" />
                          Start
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}