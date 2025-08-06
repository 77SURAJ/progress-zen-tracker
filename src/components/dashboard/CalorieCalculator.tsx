import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";

interface FoodItem {
  id: string;
  name: string;
  quantity: string;
  calories: number;
  isJunk?: boolean;
}

interface CalorieCalculatorProps {
  title: string;
  items: FoodItem[];
  onItemsChange: (items: FoodItem[]) => void;
  showJunkDetection?: boolean;
}

// Simulated AI calorie calculation
const calculateCalories = (name: string, quantity: string): { calories: number; isJunk: boolean } => {
  const foodDatabase: Record<string, { caloriesPerUnit: number; isJunk: boolean }> = {
    'apple': { caloriesPerUnit: 80, isJunk: false },
    'banana': { caloriesPerUnit: 100, isJunk: false },
    'rice': { caloriesPerUnit: 130, isJunk: false },
    'chicken': { caloriesPerUnit: 165, isJunk: false },
    'bread': { caloriesPerUnit: 80, isJunk: false },
    'pizza': { caloriesPerUnit: 285, isJunk: true },
    'burger': { caloriesPerUnit: 354, isJunk: true },
    'fries': { caloriesPerUnit: 365, isJunk: true },
    'chocolate': { caloriesPerUnit: 546, isJunk: true },
    'soda': { caloriesPerUnit: 39, isJunk: true },
    'chips': { caloriesPerUnit: 536, isJunk: true },
  };

  const lowerName = name.toLowerCase();
  const quantityNum = parseFloat(quantity) || 1;
  
  for (const [key, value] of Object.entries(foodDatabase)) {
    if (lowerName.includes(key)) {
      return {
        calories: Math.round(value.caloriesPerUnit * quantityNum),
        isJunk: value.isJunk
      };
    }
  }
  
  // Default estimation
  return {
    calories: Math.round(100 * quantityNum),
    isJunk: false
  };
};

export function CalorieCalculator({ title, items, onItemsChange, showJunkDetection = false }: CalorieCalculatorProps) {
  const [newItem, setNewItem] = useState({ name: '', quantity: '' });

  const addItem = () => {
    if (newItem.name && newItem.quantity) {
      const { calories, isJunk } = calculateCalories(newItem.name, newItem.quantity);
      const item: FoodItem = {
        id: Date.now().toString(),
        name: newItem.name,
        quantity: newItem.quantity,
        calories,
        isJunk: showJunkDetection ? isJunk : undefined
      };
      onItemsChange([...items, item]);
      setNewItem({ name: '', quantity: '' });
    }
  };

  const removeItem = (id: string) => {
    onItemsChange(items.filter(item => item.id !== id));
  };

  const totalCalories = items.reduce((sum, item) => sum + item.calories, 0);
  const hasJunkFood = items.some(item => item.isJunk);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Food item"
          value={newItem.name}
          onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
          className="bg-secondary border-border"
        />
        <Input
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem(prev => ({ ...prev, quantity: e.target.value }))}
          className="bg-secondary border-border w-24"
        />
        <Button onClick={addItem} size="sm" className="bg-gradient-primary">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm">{item.name} ({item.quantity})</span>
              {item.isJunk && (
                <Badge variant="destructive" className="text-xs">Junk Food</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{item.calories} cal</span>
              <Button
                onClick={() => removeItem(item.id)}
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className={cn(
        "flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-300",
        hasJunkFood ? "border-destructive bg-destructive/10" : "border-success bg-success/10"
      )}>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <span className="font-medium">Total Calories</span>
          {hasJunkFood && showJunkDetection && (
            <Badge variant="destructive" className="text-xs animate-bounce-subtle">
              Contains Junk Food!
            </Badge>
          )}
        </div>
        <span className="text-lg font-bold text-primary">{totalCalories}</span>
      </div>
    </div>
  );
}