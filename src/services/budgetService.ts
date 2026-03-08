import { supabase } from '../lib/supabase';
import type { BudgetItem } from '@shared/types/budget';

export async function fetchItems(): Promise<BudgetItem[]> {
  const { data, error } = await supabase
    .from('budget_items')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as BudgetItem[];
}

export async function addItem(item: Omit<BudgetItem, 'id'>): Promise<BudgetItem> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('budget_items')
    .insert([{ ...item, user_id: user.id }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as BudgetItem;
}

export async function updateItem(
  id: string,
  changes: Partial<Omit<BudgetItem, 'id'>>,
): Promise<BudgetItem> {
  const { data, error } = await supabase
    .from('budget_items')
    .update(changes)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as BudgetItem;
}

export async function deleteItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('budget_items')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}
