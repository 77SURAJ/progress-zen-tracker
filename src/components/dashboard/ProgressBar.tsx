import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  animated?: boolean;
}

export function ProgressBar({ value, max, className, animated = true }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className={cn("w-full bg-muted rounded-full h-2", className)}>
      <div
        className={cn(
          "h-full bg-gradient-primary rounded-full transition-all duration-500",
          animated && "animate-progress-fill"
        )}
        style={{ 
          width: `${percentage}%`,
          '--progress-value': `${percentage}%`
        } as React.CSSProperties}
      />
    </div>
  );
}