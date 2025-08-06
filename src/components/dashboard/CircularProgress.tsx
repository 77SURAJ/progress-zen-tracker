import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showPercentage?: boolean;
  children?: React.ReactNode;
}

export function CircularProgress({ 
  value, 
  max, 
  size = 120, 
  strokeWidth = 8, 
  className,
  showPercentage = true,
  children 
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((value / max) * 100, 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--info))" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Content in center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children || (
          <>
            <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {value}
            </div>
            {showPercentage && (
              <div className="text-sm text-muted-foreground">
                {Math.round(percentage)}%
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}