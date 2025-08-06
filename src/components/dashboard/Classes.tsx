import { DashboardCard } from "./DashboardCard";
import { SettingsModal } from "./SettingsModal";
import { Checkbox } from "@/components/ui/checkbox";
import { GraduationCap } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

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
  const [classes, setClasses] = useLocalStorage<ClassItem[]>('classes', defaultClasses);
  const [customSubjects] = useLocalStorage<Subject[]>('customSubjects', []);
  
  // Use custom subjects if available, otherwise use default classes
  const currentSubjects = customSubjects.length > 0 
    ? customSubjects.map(subject => ({
        id: subject.id,
        name: subject.name,
        attended: classes.find(c => c.name === subject.name)?.attended || false
      }))
    : classes;

  const toggleAttendance = (id: string) => {
    const updatedClasses = currentSubjects.map(classItem => 
      classItem.id === id 
        ? { ...classItem, attended: !classItem.attended }
        : classItem
    );
    setClasses(updatedClasses);
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