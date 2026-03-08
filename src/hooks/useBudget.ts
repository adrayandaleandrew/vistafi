import { useState, useEffect } from "react";
import { BudgetItem, BudgetCategory } from "@shared/types/budget";
import { mockBudgetItems } from "@shared/data/mockData";
import { calculateBudgetSummary } from "@shared/utils/budgetUtils";

export function useBudget() {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(() => {
    const stored = localStorage.getItem('vistafi-items');
    if (stored) {
      try { return JSON.parse(stored) as BudgetItem[]; }
      catch { return mockBudgetItems; }
    }
    return mockBudgetItems;
  });
  const [itemToEdit, setItemToEdit] = useState<BudgetItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<BudgetCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('vistafi-items', JSON.stringify(budgetItems));
    } catch {
      // QuotaExceededError or other storage errors — ignore silently
    }
  }, [budgetItems]);

  const handleAddItem = (newItem: BudgetItem) => setBudgetItems(curr => [...curr, newItem]);

  const handleDeleteItem = (id: string) => setBudgetItems(curr => curr.filter(i => i.id !== id));

  const handleEditItem = (item: BudgetItem) => setItemToEdit(item);

  const handleSaveEdit = (updated: BudgetItem) => {
    setBudgetItems(curr => curr.map(i => i.id === updated.id ? updated : i));
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
    handleAddItem,
    handleDeleteItem,
    handleEditItem,
    handleSaveEdit,
    handleCancelEdit,
  };
}
