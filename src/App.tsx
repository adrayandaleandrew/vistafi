import { useState, useEffect } from "react";
import { BudgetForm } from "./components/BudgetForm";
import { BudgetItemList } from "./components/BudgetItemList";
import { BudgetSummary } from "./components/BudgetSummary";
import { FilterBar } from "./components/FilterBar";
import { EditModal } from "./components/EditModal";
import { mockBudgetItems } from "@shared/data/mockData";
import { BudgetItem, BudgetCategory } from "@shared/types/budget";
import { calculateBudgetSummary } from "@shared/utils/budgetUtils";

function App() {
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
    localStorage.setItem('vistafi-items', JSON.stringify(budgetItems));
  }, [budgetItems]);

  const handleAddItem = (newItem: BudgetItem) => setBudgetItems(curr => [...curr, newItem]);

  const handleDeleteItem = (id: string) => setBudgetItems(curr => curr.filter(i => i.id !== id));

  const handleEditItem = (item: BudgetItem) => {
    setItemToEdit(item);
  };

  const handleSaveEdit = (updated: BudgetItem) => {
    setBudgetItems(curr => curr.map(i => i.id === updated.id ? updated : i));
    setItemToEdit(null);
  };

  const handleCancelEdit = () => {
    setItemToEdit(null);
  };

  const summary = calculateBudgetSummary(budgetItems);

  const filteredItems = budgetItems
    .filter(item => filterCategory === 'all' || item.category === filterCategory)
    .filter(item => item.description.toLowerCase().includes(searchQuery.toLowerCase().trim()));

  return (
    <div className="min-h-screen bg-canvas">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-ink">VistaFi</h1>
          <p className="text-sm text-muted">Simple Budget Planner</p>
        </header>

        <BudgetSummary summary={summary} />

        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6 mt-8">
          <BudgetForm onAddItem={handleAddItem} />
          <div>
            <FilterBar
              active={filterCategory}
              onChange={setFilterCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <BudgetItemList
              items={filteredItems}
              onDeleteItem={handleDeleteItem}
              onEditItem={handleEditItem}
            />
          </div>
        </div>
      </div>

      {itemToEdit ? (
        <EditModal
          item={itemToEdit}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      ) : null}
    </div>
  );
}

export default App;
