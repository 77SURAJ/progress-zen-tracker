import { useState } from "react";
import { DashboardCard } from "./DashboardCard";
import { ProgressBar } from "./ProgressBar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen, Play, Square } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";

interface StudySession {
  id: string;
  completed: boolean;
  startTime?: string;
  endTime?: string;
  isActive: boolean;
}

interface StudySessionsProps {
  title: string;
  sessionCount: number;
  storageKey: string;
}

export function StudySessions({ title, sessionCount, storageKey }: StudySessionsProps) {
  const [sessions, setSessions] = useLocalStorage<StudySession[]>(storageKey, 
    Array.from({ length: sessionCount }, (_, i) => ({
      id: `${storageKey}-${i}`,
      completed: false,
      isActive: false
    }))
  );

  const completedSessions = sessions.filter(s => s.completed).length;
  const activeSessions = sessions.filter(s => s.isActive).length;

  const toggleSession = (id: string) => {
    setSessions(sessions.map(session => 
      session.id === id 
        ? { ...session, completed: !session.completed, isActive: false }
        : session
    ));
  };

  const startSession = (id: string) => {
    setSessions(sessions.map(session => 
      session.id === id 
        ? { ...session, isActive: true, startTime: new Date().toLocaleTimeString() }
        : { ...session, isActive: false }
    ));
  };

  const stopSession = (id: string) => {
    setSessions(sessions.map(session => 
      session.id === id 
        ? { 
            ...session, 
            isActive: false, 
            endTime: new Date().toLocaleTimeString(),
            completed: true 
          }
        : session
    ));
  };

  return (
    <DashboardCard
      title={title}
      icon={<BookOpen className="h-5 w-5 text-info" />}
      completed={completedSessions === sessionCount}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{completedSessions}/{sessionCount} sessions</span>
          </div>
          <ProgressBar value={completedSessions} max={sessionCount} />
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
                  <span className="font-medium">Session {index + 1} (80 min)</span>
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