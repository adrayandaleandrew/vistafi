import { useState, useEffect } from 'react';
import type { BudgetGoal, BudgetCategory } from '@shared/types/budget';
import { fetchGoals, upsertGoal, deleteGoal } from '../services/goalService';

export function useGoals() {
  const [goals, setGoals] = useState<BudgetGoal[]>([]);
  const [goalsLoading, setGoalsLoading] = useState(true);

  useEffect(() => {
    fetchGoals()
      .then(data => setGoals(data))
      .catch(() => setGoals([]))
      .finally(() => setGoalsLoading(false));
  }, []);

  const handleSetGoal = async (category: BudgetCategory, targetAmount: number): Promise<void> => {
    const saved = await upsertGoal(category, targetAmount);
    setGoals(curr => {
      const others = curr.filter(g => g.category !== category);
      return [...others, saved];
    });
  };

  const handleDeleteGoal = async (id: string): Promise<void> => {
    await deleteGoal(id);
    setGoals(curr => curr.filter(g => g.id !== id));
  };

  return { goals, goalsLoading, handleSetGoal, handleDeleteGoal };
}
