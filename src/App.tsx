import { BudgetForm } from "./components/BudgetForm";
import { BudgetItemList } from "./components/BudgetItemList";
import { BudgetSummary } from "./components/BudgetSummary";
import { FilterBar } from "./components/FilterBar";
import { EditModal } from "./components/EditModal";
import { useBudget } from "./hooks/useBudget";

function App() {
  const {
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
  } = useBudget();

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
