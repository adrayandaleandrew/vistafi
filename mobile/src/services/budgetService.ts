import { supabase } from '../lib/supabase'
import type { BudgetItem } from '@shared/types/budget'

export async function fetchItems(): Promise<BudgetItem[]> {
  const { data, error } = await supabase
    .from('budget_items')
    .select('*')
    .order('date', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function addItem(
  userId: string,
  item: Omit<BudgetItem, 'id'>
): Promise<BudgetItem> {
  const { data, error } = await supabase
    .from('budget_items')
    .insert({ ...item, user_id: userId })
    .select()
    .single()

  if (error) throw error
  return data as BudgetItem
}

export async function updateItem(item: BudgetItem): Promise<BudgetItem> {
  const { id, ...fields } = item
  const { data, error } = await supabase
    .from('budget_items')
    .update(fields)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('budget_items')
    .delete()
    .eq('id', id)

  if (error) throw error
}
