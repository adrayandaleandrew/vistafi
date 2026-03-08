import { useState, useEffect } from "react";
import { BudgetCategory, BudgetItem } from "@shared/types/budget";
import { generateId } from "@shared/utils/budgetUtils";

interface BudgetFormProps {
  onAddItem: (item: BudgetItem) => void;
}

export const BudgetForm = ({ onAddItem }: Readonly<BudgetFormProps>) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [expenseCategory, setExpenseCategory] = useState<'expense' | 'savings'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [showAdded, setShowAdded] = useState(false);

  useEffect(() => {
    if (!showAdded) return;
    const timer = setTimeout(() => setShowAdded(false), 2000);
    return () => clearTimeout(timer);
  }, [showAdded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount.trim() || parseFloat(amount) <= 0) return;

    const category: BudgetCategory = type === 'income' ? 'income' : expenseCategory;
    const newItem: BudgetItem = {
      id: generateId(),
      description: description.trim(),
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString().split('T')[0],
    };

    onAddItem(newItem);
    setDescription('');
    setAmount('');
    setType('expense');
    setExpenseCategory('expense');
    setShowAdded(true);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-6">
      <h2 className="text-base font-semibold text-ink mb-6">Quick Add</h2>

      {/* Type segmented control */}
      <div className="mb-5">
        <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted mb-2">
          Type
        </label>
        <div className="flex gap-2">
          {(['income', 'expense'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 min-h-[44px] rounded-lg text-sm font-medium cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-1 ${
                type === t
                  ? 'bg-ink text-surface'
                  : 'border border-border text-muted hover:border-ink hover:text-ink'
              }`}
            >
              {t === 'income' ? 'Income' : 'Expense'}
            </button>
          ))}
        </div>
      </div>

      {/* Amount */}
      <div className="mb-5">
        <label htmlFor="amount" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted mb-2">
          Amount
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-muted pointer-events-none">$</span>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0.01"
            required
            className="w-full min-h-[44px] pl-8 pr-4 py-2.5 border border-border rounded-lg text-ink bg-transparent placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-ink num"
          />
        </div>
      </div>

      {/* Category — only when expense */}
      {type === 'expense' ? (
        <div className="mb-5">
          <label htmlFor="category" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted mb-2">
            Category
          </label>
          <select
            id="category"
            value={expenseCategory}
            onChange={(e) => setExpenseCategory(e.target.value as 'expense' | 'savings')}
            className="w-full min-h-[44px] py-2.5 px-3 border border-border rounded-lg text-ink bg-surface focus:outline-none focus:ring-1 focus:ring-ink cursor-pointer"
          >
            <option value="expense">General Expense</option>
            <option value="savings">Savings</option>
          </select>
        </div>
      ) : null}

      {/* Description */}
      <div className="mb-6">
        <label htmlFor="description" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted mb-2">
          Description
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's this for?"
          required
          className="w-full min-h-[44px] py-2.5 px-3 border border-border rounded-lg text-ink bg-transparent placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-ink"
        />
      </div>

      <button
        type="submit"
        className="w-full min-h-[44px] bg-ink text-surface font-medium rounded-lg hover:opacity-90 cursor-pointer transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-1"
      >
        Add Transaction
      </button>

      {showAdded ? (
        <p role="status" aria-live="polite" className="text-xs text-income text-center mt-3">
          Transaction added!
        </p>
      ) : null}
    </form>
  );
};
