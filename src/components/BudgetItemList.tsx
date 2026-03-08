import { BudgetItem, BudgetCategory } from "@shared/types/budget";

interface BudgetItemListProps {
  items: BudgetItem[];
  onDeleteItem: (id: string) => void;
  onEditItem: (item: BudgetItem) => void;
}

const categoryColor = (category: BudgetCategory): string => {
  switch (category) {
    case 'income': return 'text-income';
    case 'expense': return 'text-expense';
    case 'savings': return 'text-savings';
  }
};

const amountPrefix = (category: BudgetCategory): string => {
  return category === 'income' ? '+' : '−';
};

export const BudgetItemList = ({ items, onDeleteItem, onEditItem }: BudgetItemListProps) => {
  if (items.length === 0) {
    return (
      <div className="border border-border rounded-xl px-6 py-12 text-center">
        <p className="text-muted">No transactions yet</p>
      </div>
    );
  }

  return (
    <ul className="border border-border rounded-xl divide-y divide-border">
      {items.map((item) => (
        <li key={item.id} className="group flex items-center justify-between px-5 py-4">
          {/* Left: description + category pill */}
          <div>
            <p className="text-[15px] text-ink font-medium">{item.description}</p>
            <div className={`flex items-center gap-1 mt-0.5 ${categoryColor(item.category)}`}>
              <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor" aria-hidden="true">
                <circle cx="3" cy="3" r="3" />
              </svg>
              <span className="text-xs font-medium capitalize">{item.category}</span>
            </div>
          </div>

          {/* Right: amount + date + actions */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className={`text-[15px] font-semibold num ${categoryColor(item.category)}`}>
                {amountPrefix(item.category)}${item.amount.toFixed(2)}
              </p>
              <p className="text-xs text-muted">
                {new Date(item.date + 'T00:00:00').toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
              <button
                onClick={() => onEditItem(item)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-muted hover:text-ink hover:bg-border cursor-pointer transition-colors duration-150"
                aria-label={`Edit ${item.description}`}
              >
                <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                onClick={() => onDeleteItem(item.id)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-muted hover:text-expense hover:bg-border cursor-pointer transition-colors duration-150"
                aria-label={`Delete ${item.description}`}
              >
                <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
