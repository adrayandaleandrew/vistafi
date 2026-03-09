import { useState, useEffect, useRef } from "react";
import { BudgetGoal, BudgetCategory } from "@shared/types/budget";

interface GoalUpdate {
  category: BudgetCategory;
  targetAmount: number | null;
}

interface GoalModalProps {
  goals: BudgetGoal[];
  onSave: (updates: GoalUpdate[]) => void;
  onCancel: () => void;
}

export const GoalModal = ({ goals, onSave, onCancel }: Readonly<GoalModalProps>) => {
  const findTarget = (cat: BudgetCategory): string => {
    const g = goals.find(g => g.category === cat);
    return g ? g.targetAmount.toString() : '';
  };

  const [incomeTarget, setIncomeTarget] = useState<string>(() => findTarget('income'));
  const [expenseLimit, setExpenseLimit] = useState<string>(() => findTarget('expense'));
  const [savingsGoal, setSavingsGoal] = useState<string>(() => findTarget('savings'));
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const getFocusable = () => Array.from(
      modal.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled])'
      )
    );
    getFocusable()[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onCancel(); return; }
      if (e.key !== 'Tab') return;

      const focusable = getFocusable();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const parseTarget = (val: string): number | null => {
    const n = parseFloat(val);
    return isNaN(n) || n <= 0 ? null : n;
  };

  const handleSave = () => {
    const updates: GoalUpdate[] = [
      { category: 'income', targetAmount: parseTarget(incomeTarget) },
      { category: 'expense', targetAmount: parseTarget(expenseLimit) },
      { category: 'savings', targetAmount: parseTarget(savingsGoal) },
    ];
    onSave(updates);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/30"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div
        ref={modalRef}
        className="relative bg-surface border border-border rounded-xl p-6 w-full max-w-md mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="goal-modal-title"
      >
        <h2 id="goal-modal-title" aria-label="Set monthly goals" className="text-base font-semibold text-ink mb-6">
          Set Monthly Goals
        </h2>

        {/* Income target */}
        <div className="mb-5">
          <label htmlFor="goal-income" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted mb-2">
            Income target
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-muted pointer-events-none">$</span>
            <input
              id="goal-income"
              type="number"
              value={incomeTarget}
              onChange={(e) => setIncomeTarget(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              className="w-full min-h-[44px] pl-8 pr-4 py-2.5 border border-border rounded-lg text-ink bg-transparent placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-ink num"
            />
          </div>
        </div>

        {/* Expense limit */}
        <div className="mb-5">
          <label htmlFor="goal-expense" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted mb-2">
            Expense limit
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-muted pointer-events-none">$</span>
            <input
              id="goal-expense"
              type="number"
              value={expenseLimit}
              onChange={(e) => setExpenseLimit(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              className="w-full min-h-[44px] pl-8 pr-4 py-2.5 border border-border rounded-lg text-ink bg-transparent placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-ink num"
            />
          </div>
        </div>

        {/* Savings goal */}
        <div className="mb-6">
          <label htmlFor="goal-savings" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted mb-2">
            Savings goal
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-muted pointer-events-none">$</span>
            <input
              id="goal-savings"
              type="number"
              value={savingsGoal}
              onChange={(e) => setSavingsGoal(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              className="w-full min-h-[44px] pl-8 pr-4 py-2.5 border border-border rounded-lg text-ink bg-transparent placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-ink num"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 min-h-[44px] border border-border text-muted rounded-lg font-medium hover:border-ink hover:text-ink cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-1"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 min-h-[44px] bg-ink text-surface rounded-lg font-medium hover:opacity-90 cursor-pointer transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-1"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
