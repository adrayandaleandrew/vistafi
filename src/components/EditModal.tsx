import { useState, useEffect } from "react";
import { BudgetCategory, BudgetItem } from "@shared/types/budget";

interface EditModalProps {
  item: BudgetItem;
  onSave: (updated: BudgetItem) => void;
  onCancel: () => void;
}

export const EditModal = ({ item, onSave, onCancel }: EditModalProps) => {
  const [type, setType] = useState<'income' | 'expense'>(
    item.category === 'income' ? 'income' : 'expense'
  );
  const [expenseCategory, setExpenseCategory] = useState<'expense' | 'savings'>(
    item.category === 'savings' ? 'savings' : 'expense'
  );
  const [amount, setAmount] = useState(item.amount.toString());
  const [description, setDescription] = useState(item.description);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount.trim() || parseFloat(amount) <= 0) return;

    const category: BudgetCategory = type === 'income' ? 'income' : expenseCategory;
    onSave({ ...item, description: description.trim(), amount: parseFloat(amount), category });
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
        className="relative bg-surface border border-border rounded-xl p-6 w-full max-w-md mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-base font-semibold text-ink mb-6">Edit Transaction</h2>

        <form onSubmit={handleSubmit}>
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
                  className={`flex-1 min-h-[44px] rounded-lg text-sm font-medium cursor-pointer transition-colors duration-150 ${
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
            <label htmlFor="edit-amount" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-muted pointer-events-none">$</span>
              <input
                id="edit-amount"
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
              <label htmlFor="edit-category" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted mb-2">
                Category
              </label>
              <select
                id="edit-category"
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
            <label htmlFor="edit-description" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted mb-2">
              Description
            </label>
            <input
              id="edit-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this for?"
              required
              className="w-full min-h-[44px] py-2.5 px-3 border border-border rounded-lg text-ink bg-transparent placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-ink"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 min-h-[44px] border border-border text-muted rounded-lg font-medium hover:border-ink hover:text-ink cursor-pointer transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 min-h-[44px] bg-ink text-surface rounded-lg font-medium hover:opacity-90 cursor-pointer transition-opacity duration-150"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
