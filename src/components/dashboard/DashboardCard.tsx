import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  completed?: boolean;
}

export function DashboardCard({ title, icon, children, className, completed }: DashboardCardProps) {
  return (
    <Card className={cn(
      "bg-card/50 border-border/50 shadow-card backdrop-blur-sm transition-all duration-300 hover:shadow-glow animate-fade-in",
      completed && "ring-2 ring-success/50",
      className
    )}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-foreground">
          {icon}
          {title}
          {completed && (
            <span className="ml-auto text-success animate-bounce-subtle">✓</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}