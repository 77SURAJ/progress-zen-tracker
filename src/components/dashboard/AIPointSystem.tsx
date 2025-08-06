import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface AIPointSuggestion {
  activity: string;
  suggestedPoints: number;
  reason: string;
  timestamp: string;
}

export function AIPointSystem() {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useLocalStorage<AIPointSuggestion[]>('aiPointSuggestions', []);

  const analyzeActivity = async () => {
    if (!input.trim()) {
      toast.error("Please describe an activity to analyze");
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis (in a real app, this would call an AI API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simple rule-based analysis for demo
      const activity = input.toLowerCase();
      let suggestedPoints = 0;
      let reason = "";
      
      if (activity.includes('study') || activity.includes('learn')) {
        suggestedPoints = Math.floor(Math.random() * 5) + 6; // 6-10 points
        reason = "Educational activities contribute significantly to personal growth";
      } else if (activity.includes('exercise') || activity.includes('workout')) {
        suggestedPoints = Math.floor(Math.random() * 3) + 8; // 8-10 points
        reason = "Physical activity is essential for health and should be highly rewarded";
      } else if (activity.includes('eat') || activity.includes('food')) {
        if (activity.includes('junk') || activity.includes('fast food')) {
          suggestedPoints = -Math.floor(Math.random() * 4) - 3; // -3 to -6 points
          reason = "Unhealthy eating habits should have point penalties";
        } else {
          suggestedPoints = Math.floor(Math.random() * 3) + 3; // 3-5 points
          reason = "Healthy eating habits deserve positive reinforcement";
        }
      } else if (activity.includes('sleep') || activity.includes('rest')) {
        suggestedPoints = Math.floor(Math.random() * 3) + 4; // 4-6 points
        reason = "Proper rest is crucial for productivity and health";
      } else if (activity.includes('wake up early') || activity.includes('morning')) {
        suggestedPoints = Math.floor(Math.random() * 5) + 8; // 8-12 points
        reason = "Early rising demonstrates discipline and maximizes productive hours";
      } else {
        suggestedPoints = Math.floor(Math.random() * 4) + 2; // 2-5 points
        reason = "General positive activities deserve some recognition";
      }

      const newSuggestion: AIPointSuggestion = {
        activity: input.trim(),
        suggestedPoints,
        reason,
        timestamp: new Date().toISOString()
      };

      setSuggestions([newSuggestion, ...suggestions.slice(0, 4)]); // Keep last 5
      setInput('');
      
      toast.success(`AI suggests ${suggestedPoints} points for this activity!`);
    } catch (error) {
      toast.error("Failed to analyze activity. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Brain className="h-5 w-5" />
          AI Point Advisor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Describe an activity and I'll suggest how many points it should be worth... (e.g., 'Completed 2 hours of focused study', 'Went for a 30-minute jog', 'Had a healthy breakfast')"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
          />
          <Button 
            onClick={analyzeActivity}
            disabled={isAnalyzing || !input.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Analyze Activity
              </>
            )}
          </Button>
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Recent AI Suggestions:</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg text-sm">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium">{suggestion.activity}</span>
                    <span className={`font-bold ${suggestion.suggestedPoints > 0 ? 'text-success' : 'text-destructive'}`}>
                      {suggestion.suggestedPoints > 0 ? '+' : ''}{suggestion.suggestedPoints} pts
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs">{suggestion.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center">
          💡 Use AI suggestions to create a personalized point system that motivates you!
        </div>
      </CardContent>
    </Card>
  );
}