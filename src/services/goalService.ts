import { supabase } from '../lib/supabase';
import type { BudgetGoal, BudgetCategory } from '@shared/types/budget';

export async function fetchGoals(): Promise<BudgetGoal[]> {
  const { data, error } = await supabase
    .from('budget_goals')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(row => ({
    id: row.id as string,
    category: row.category as BudgetCategory,
    targetAmount: row.target_amount as number,
  }));
}

export async function upsertGoal(
  category: BudgetCategory,
  targetAmount: number,
): Promise<BudgetGoal> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await supabase
    .from('budget_goals')
    .upsert(
      { user_id: user.id, category, target_amount: targetAmount },
      { onConflict: 'user_id,category' },
    )
    .select()
    .single();
  if (error) throw error;
  return {
    id: data.id as string,
    category: data.category as BudgetCategory,
    targetAmount: data.target_amount as number,
  };
}

export async function deleteGoal(id: string): Promise<void> {
  const { error } = await supabase
    .from('budget_goals')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
