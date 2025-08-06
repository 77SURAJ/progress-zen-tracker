import { DashboardCard } from "./DashboardCard";
import { CalorieCalculator } from "./CalorieCalculator";
import { Candy } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface FoodItem {
  id: string;
  name: string;
  quantity: string;
  calories: number;
  isJunk?: boolean;
}

export function JunkFood() {
  const [junkFoodItems, setJunkFoodItems] = useLocalStorage<FoodItem[]>('junkFoodItems', []);
  
  const hasJunkFood = junkFoodItems.length > 0;

  return (
    <DashboardCard
      title="Junk Food Tracking"
      icon={<Candy className="h-5 w-5 text-destructive" />}
      completed={false} // Never mark as "completed" since it's a penalty
    >
      <CalorieCalculator
        title="Junk Food"
        items={junkFoodItems}
        onItemsChange={setJunkFoodItems}
        showJunkDetection={true}
      />
      
      {hasJunkFood && (
        <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
          <p className="text-sm text-destructive font-medium">
            ⚠️ Junk food consumed today (-6 points penalty)
          </p>
        </div>
      )}
    </DashboardCard>
  );
}