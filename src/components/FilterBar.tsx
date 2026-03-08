import { BudgetCategory } from "@shared/types/budget";

interface FilterBarProps {
  active: BudgetCategory | 'all';
  onChange: (cat: BudgetCategory | 'all') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const filters: { label: string; value: BudgetCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Income', value: 'income' },
  { label: 'Expense', value: 'expense' },
  { label: 'Savings', value: 'savings' },
];

export const FilterBar = ({ active, onChange, searchQuery, onSearchChange }: Readonly<FilterBarProps>) => {
  return (
    <div className="flex justify-between gap-4 mb-4">
      <div className="flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onChange(filter.value)}
            className={`min-h-[44px] flex items-center px-3 rounded-full text-sm font-medium cursor-pointer transition-colors duration-150 ${
              active === filter.value
                ? 'bg-ink text-surface'
                : 'border border-border text-muted hover:border-ink hover:text-ink'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1">
        <label htmlFor="search-transactions" className="sr-only">Search transactions</label>
        <input
          id="search-transactions"
          type="search"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search descriptions…"
          className="min-h-[44px] px-3 rounded-full text-sm border border-border text-ink placeholder:text-muted bg-surface focus:outline-none focus:border-ink transition-colors duration-150"
        />
        {searchQuery ? (
          <button
            onClick={() => onSearchChange('')}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-muted hover:text-ink transition-colors duration-150 cursor-pointer"
            aria-label="Clear search"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <path d="M1 1l8 8M9 1L1 9"/>
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  );
};
