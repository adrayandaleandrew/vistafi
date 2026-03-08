import { useState, useEffect } from 'react';
import { BudgetItem, BudgetCategory } from '@shared/types/budget';
import { calculateBudgetSummary } from '@shared/utils/budgetUtils';
import { fetchItems, addItem, updateItem, deleteItem } from '../services/budgetService';

export function useBudget() {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [itemToEdit, setItemToEdit] = useState<BudgetItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<BudgetCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetchItems()
      .then(items => setBudgetItems(items))
      .catch(() => setDataError('Could not load transactions. Check your connection.'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddItem = async (newItem: BudgetItem) => {
    const itemData: Omit<BudgetItem, 'id'> = {
      description: newItem.description,
      amount: newItem.amount,
      category: newItem.category,
      date: newItem.date,
    };
    const serverItem = await addItem(itemData);
    setBudgetItems(curr => [...curr, serverItem]);
  };

  const handleDeleteItem = async (id: string) => {
    await deleteItem(id);
    setBudgetItems(curr => curr.filter(i => i.id !== id));
  };

  const handleEditItem = (item: BudgetItem) => setItemToEdit(item);

  const handleSaveEdit = async (updated: BudgetItem) => {
    const { id, ...changes } = updated;
    const serverItem = await updateItem(id, changes);
    setBudgetItems(curr => curr.map(i => i.id === serverItem.id ? serverItem : i));
    setItemToEdit(null);
  };

  const handleCancelEdit = () => setItemToEdit(null);

  const summary = calculateBudgetSummary(budgetItems);

  const filteredItems = budgetItems
    .filter(item => filterCategory === 'all' || item.category === filterCategory)
    .filter(item => item.description.toLowerCase().includes(searchQuery.toLowerCase().trim()));

  return {
    itemToEdit,
    filterCategory,
    setFilterCategory,
    searchQuery,
    setSearchQuery,
    filteredItems,
    summary,
    isLoading,
    dataError,
    handleAddItem,
    handleDeleteItem,
    handleEditItem,
    handleSaveEdit,
    handleCancelEdit,
  };
}
