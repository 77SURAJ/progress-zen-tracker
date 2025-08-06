import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface AnimatedToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  className?: string;
}

export function AnimatedToggle({ checked, onCheckedChange, label, className }: AnimatedToggleProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-gradient-primary"
      />
      <label className={cn(
        "text-sm font-medium transition-colors duration-200",
        checked ? "text-primary" : "text-muted-foreground"
      )}>
        {label}
      </label>
      {checked && (
        <span className="text-success animate-bounce-subtle">✨</span>
      )}
    </div>
  );
}