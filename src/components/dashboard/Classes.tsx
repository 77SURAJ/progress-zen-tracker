import { DashboardCard } from "./DashboardCard";
import { Checkbox } from "@/components/ui/checkbox";
import { GraduationCap } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface ClassItem {
  id: string;
  name: string;
  attended: boolean;
}

const defaultClasses: ClassItem[] = [
  { id: 'applied-math', name: 'Applied Mathematics', attended: false },
  { id: 'applied-physics', name: 'Applied Physics', attended: false },
  { id: 'beee', name: 'BEEE', attended: false },
  { id: 'pps', name: 'PPS', attended: false },
  { id: 'evs', name: 'EVS', attended: false },
  { id: 'physics-lab', name: 'Applied Physics Laboratory', attended: false },
  { id: 'pps-lab', name: 'PPS Lab', attended: false },
  { id: 'etw', name: 'ETW', attended: false },
  { id: 'egd', name: 'EGD', attended: false },
];

export function Classes() {
  const [classes, setClasses] = useLocalStorage<ClassItem[]>('classes', defaultClasses);

  const toggleAttendance = (id: string) => {
    setClasses(classes.map(cls => 
      cls.id === id ? { ...cls, attended: !cls.attended } : cls
    ));
  };

  const attendedCount = classes.filter(cls => cls.attended).length;
  const isCompleted = attendedCount === classes.length;

  return (
    <DashboardCard
      title="Classes"
      icon={<GraduationCap className="h-5 w-5 text-primary" />}
      completed={isCompleted}
    >
      <div className="space-y-3">
        <div className="text-sm text-muted-foreground">
          Attended: {attendedCount}/{classes.length} classes
        </div>
        
        {classes.map((classItem) => (
          <div key={classItem.id} className="flex items-center space-x-2">
            <Checkbox
              checked={classItem.attended}
              onCheckedChange={() => toggleAttendance(classItem.id)}
              className="data-[state=checked]:bg-gradient-primary"
            />
            <label className="text-sm font-medium cursor-pointer flex-1">
              {classItem.name}
            </label>
            {classItem.attended && (
              <span className="text-success text-sm">✓</span>
            )}
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}