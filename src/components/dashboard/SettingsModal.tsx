import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Plus, Trash2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "sonner";

interface Subject {
  id: string;
  name: string;
}

interface StudySessionConfig {
  sessionCount: number;
  sessionDuration: number; // in minutes
  pointsPerSession: number;
}

export function SettingsModal() {
  const [subjects, setSubjects] = useLocalStorage<Subject[]>('customSubjects', []);
  const [studyConfig, setStudyConfig] = useLocalStorage<StudySessionConfig>('studyConfig', {
    sessionCount: 3,
    sessionDuration: 80,
    pointsPerSession: 8
  });
  
  const [newSubjectName, setNewSubjectName] = useState('');
  const [open, setOpen] = useState(false);

  const addSubject = () => {
    if (!newSubjectName.trim()) return;
    
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: newSubjectName.trim()
    };
    
    setSubjects([...subjects, newSubject]);
    setNewSubjectName('');
    toast.success("Subject added successfully!");
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter(sub => sub.id !== id));
    toast.success("Subject removed successfully!");
  };

  const updateStudyConfig = (updates: Partial<StudySessionConfig>) => {
    setStudyConfig({ ...studyConfig, ...updates });
    toast.success("Study settings updated!");
  };

  const resetToDefaults = () => {
    const defaultSubjects: Subject[] = [
      { id: '1', name: 'Applied Mathematics' },
      { id: '2', name: 'Applied Physics' },
      { id: '3', name: 'BEEE' },
      { id: '4', name: 'PPS' },
      { id: '5', name: 'EVS' },
      { id: '6', name: 'Applied Physics Laboratory' },
      { id: '7', name: 'PPS Lab' },
      { id: '8', name: 'ETW' },
      { id: '9', name: 'EGD' }
    ];
    
    setSubjects(defaultSubjects);
    setStudyConfig({
      sessionCount: 3,
      sessionDuration: 80,
      pointsPerSession: 8
    });
    toast.success("Settings reset to defaults!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Customize
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize Your Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="subjects" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="study">Study Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="subjects" className="space-y-4">
            <div className="space-y-2">
              <Label>Add New Subject</Label>
              <div className="flex gap-2">
                <Input
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="Enter subject name"
                  onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                />
                <Button onClick={addSubject} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Your Subjects</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {subjects.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No custom subjects. Add some above or reset to defaults.
                  </p>
                ) : (
                  subjects.map((subject) => (
                    <div key={subject.id} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{subject.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSubject(subject.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <Button onClick={resetToDefaults} variant="outline" className="w-full">
              Reset to B.Tech Defaults
            </Button>
          </TabsContent>
          
          <TabsContent value="study" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Sessions per Study Slot</Label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={studyConfig.sessionCount}
                  onChange={(e) => updateStudyConfig({ sessionCount: parseInt(e.target.value) || 3 })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Session Duration (minutes)</Label>
                <Input
                  type="number"
                  min="15"
                  max="120"
                  value={studyConfig.sessionDuration}
                  onChange={(e) => updateStudyConfig({ sessionDuration: parseInt(e.target.value) || 80 })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Points per Session</Label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={studyConfig.pointsPerSession}
                  onChange={(e) => updateStudyConfig({ pointsPerSession: parseInt(e.target.value) || 8 })}
                />
              </div>
              
              <div className="p-3 bg-muted rounded text-sm">
                <p><strong>Current Setup:</strong></p>
                <p>• {studyConfig.sessionCount} sessions per study slot</p>
                <p>• {studyConfig.sessionDuration} minutes each</p>
                <p>• {studyConfig.pointsPerSession} points per completed session</p>
                <p>• Max {studyConfig.sessionCount * studyConfig.pointsPerSession * 3} points from all study slots</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}