import { useEffect, useMemo, useRef, useState } from "react";
import { DashboardCard } from "./DashboardCard";
import { CalorieCalculator } from "./CalorieCalculator";
import { useAuth } from "@/components/auth/AuthProvider";
import { addMealLog } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface FoodItem { id: string; name: string; quantity: string; calories: number; isJunk?: boolean; }

export function MealsModule({ title, mealType }: { title: string; mealType: "breakfast"|"snack"|"dinner" }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<FoodItem[]>([]);
  const persisted = useRef<Set<string>>(new Set());

  const today = useMemo(() => new Date().toISOString().slice(0,10), []);

  useEffect(() => {
    // Persist any new items into meal_logs
    if (!user) return;
    const toPersist = items.filter(i => !persisted.current.has(i.id));
    (async () => {
      for (const i of toPersist) {
        try {
          await addMealLog({
            userId: user.id,
            date: today,
            meal_type: mealType,
            item: i.name,
            quantity: i.quantity,
            calories: i.calories,
            junk: !!i.isJunk,
          });
          persisted.current.add(i.id);
        } catch (e: any) {
          toast({ title: "Failed to save meal", description: e.message });
        }
      }
    })();
  }, [items, mealType, today, user, toast]);

  return (
    <DashboardCard title={title}>
      <CalorieCalculator title={title} items={items} onItemsChange={setItems} showJunkDetection />
    </DashboardCard>
  );
}
