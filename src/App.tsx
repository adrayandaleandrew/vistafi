import { useState, useEffect } from "react";
import "./App.css";
import { BudgetForm } from "./components/BudgetForm";
import { BudgetItemList } from "./components/BudgetItemList";
import { BudgetSummary } from "./components/BudgetSummary";
import { mockBudgetItems } from "./data/mockData";
import { BudgetItem } from "./types/budget";
import { calculateBudgetSummary } from "./utils/budgetUtils";

function App() {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(mockBudgetItems);
  const [itemToEdit, setItemToEdit] = useState<BudgetItem | null>(null);

  const handleAddItem = (newItem: BudgetItem) => {
    setBudgetItems([...budgetItems, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    setBudgetItems(budgetItems.filter((item) => item.id !== id));
  };

  const handleEditItem = (item: BudgetItem) => {
    // For now, just log the item. In a real app, you'd open a modal or form to edit the item
    console.log("Edit item:", item);
    setItemToEdit(item);

    // Here you could open a modal, update form values, etc.
    // This is just a placeholder to demonstrate the edit functionality works
    alert(
      `Edit functionality not fully implemented. Would edit: ${item.description}`
    );
  };

  const summary = calculateBudgetSummary(budgetItems);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">VistaFi</h1>
          <p className="text-gray-600">Simple Budget Planner</p>
        </div>

        <BudgetSummary summary={summary} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <BudgetForm onAddItem={handleAddItem} />
          </div>

          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
            <BudgetItemList
              items={budgetItems}
              onDeleteItem={handleDeleteItem}
              onEditItem={handleEditItem}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
