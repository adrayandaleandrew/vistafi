import { useState } from 'react';
import { BudgetForm } from './components/BudgetForm';
import { BudgetItemList } from './components/BudgetItemList';
import { BudgetSummary } from './components/BudgetSummary';
import { FilterBar } from './components/FilterBar';
import { EditModal } from './components/EditModal';
import { GoalModal } from './components/GoalModal';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { useAuth } from './context/AuthContext';
import { useBudget } from './hooks/useBudget';
import { useGoals } from './hooks/useGoals';
import { generateCsv, downloadCsv } from './utils/csvExport';
import { calculateCurrentMonthSummary } from '@shared/utils/budgetUtils';

function BudgetApp() {
  const {
    budgetItems,
    itemToEdit,
    filterCategory,
    setFilterCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filteredItems,
    summary,
    isLoading,
    dataError,
    handleAddItem,
    handleDeleteItem,
    handleEditItem,
    handleSaveEdit,
    handleCancelEdit,
  } = useBudget();

  const { goals, handleSetGoal, handleDeleteGoal } = useGoals();
  const [goalsOpen, setGoalsOpen] = useState(false);
  const currentMonthSummary = calculateCurrentMonthSummary(budgetItems);

  const { signOut } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <p className="text-muted text-sm">Loading transactions…</p>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <p role="alert" className="text-expense text-sm">{dataError}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>VistaFi</h1>
            <p className="text-sm text-muted">Simple Budget Planner</p>
          </div>
          <div className="flex items-center gap-2">
            {budgetItems.length > 0 ? (
              <button
                type="button"
                onClick={() => downloadCsv('vistafi-transactions.csv', generateCsv(budgetItems))}
                aria-label="Export transactions as CSV"
                className="min-h-[44px] px-4 text-sm text-muted hover:text-ink cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded-lg"
              >
                Export CSV
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setGoalsOpen(true)}
              aria-label="Set monthly goals"
              className="min-h-[44px] px-4 text-sm text-muted hover:text-ink cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded-lg"
            >
              Goals
            </button>
            <button
              type="button"
              onClick={signOut}
              aria-label="Sign out"
              className="min-h-[44px] px-4 text-sm text-muted hover:text-ink cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded-lg"
            >
              Sign out
            </button>
          </div>
        </header>

        <BudgetSummary summary={summary} goals={goals} currentMonthSummary={currentMonthSummary} />

        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6 mt-8">
          <BudgetForm onAddItem={handleAddItem} />
          <div>
            <FilterBar
              active={filterCategory}
              onChange={setFilterCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
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

      {goalsOpen ? (
        <GoalModal
          goals={goals}
          onSave={(updates) => {
            updates.forEach(u => {
              if (u.targetAmount !== null) {
                handleSetGoal(u.category, u.targetAmount).catch(() => undefined);
              } else {
                const existing = goals.find(g => g.category === u.category);
                if (existing) {
                  handleDeleteGoal(existing.id).catch(() => undefined);
                }
              }
            });
            setGoalsOpen(false);
          }}
          onCancel={() => setGoalsOpen(false)}
        />
      ) : null}
    </div>
  );
}

function App() {
  const { user, isLoading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <p className="text-muted text-sm">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return authView === 'login' ? (
      <LoginPage onShowSignup={() => setAuthView('signup')} />
    ) : (
      <SignupPage onShowLogin={() => setAuthView('login')} />
    );
  }

  return <BudgetApp />;
}

export default App;
