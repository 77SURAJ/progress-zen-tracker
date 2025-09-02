import { DashboardCard } from "./DashboardCard";
import { SettingsModal } from "./SettingsModal";
import { Checkbox } from "@/components/ui/checkbox";
import { GraduationCap } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDailyProgressSync } from "@/hooks/useDailyProgressSync";

interface ClassItem {
  id: string;
  name: string;
  attended: boolean;
}

interface Subject {
  id: string;
  name: string;
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
  const { dailyProgress, updateField } = useDailyProgressSync();
  const [customSubjects] = useLocalStorage<Subject[]>('customSubjects', []);
  
  // Get current classes from daily_progress or use defaults
  const savedClasses: ClassItem[] = (() => {
    if (!dailyProgress?.classes || !Array.isArray(dailyProgress.classes)) {
      return defaultClasses;
    }
    try {
      // Validate that the data matches ClassItem structure
      const classes = dailyProgress.classes as unknown as ClassItem[];
      if (classes.every(c => c && typeof c.id === 'string' && typeof c.name === 'string' && typeof c.attended === 'boolean')) {
        return classes;
      }
    } catch {
      // Fall back to defaults if parsing fails
    }
    return defaultClasses;
  })();
  
  // Use custom subjects if available, otherwise use saved/default classes
  const currentSubjects = customSubjects.length > 0 
    ? customSubjects.map(subject => ({
        id: subject.id,
        name: subject.name,
        attended: savedClasses.find(c => c.name === subject.name)?.attended || false
      }))
    : savedClasses;

  const toggleAttendance = (id: string) => {
    const updatedClasses = currentSubjects.map(classItem => 
      classItem.id === id 
        ? { ...classItem, attended: !classItem.attended }
        : classItem
    );
    updateField('classes', updatedClasses);
  };

  const attendedCount = currentSubjects.filter(cls => cls.attended).length;
  const isCompleted = attendedCount === currentSubjects.length;

  return (
    <DashboardCard
      title="Classes"
      icon={<GraduationCap className="h-5 w-5 text-primary" />}
      completed={isCompleted}
    >
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Attended: {attendedCount}/{currentSubjects.length} classes
          </div>
          <SettingsModal />
        </div>
        
        {currentSubjects.map((classItem) => (
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