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

export const FilterBar = ({ active, onChange, searchQuery, onSearchChange }: FilterBarProps) => {
  return (
    <div className="flex justify-between gap-4 mb-4">
      <div className="flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onChange(filter.value)}
            className={`h-8 px-3 rounded-full text-sm font-medium cursor-pointer transition-colors duration-150 ${
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
        <input
          type="search"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search descriptions…"
          className="h-8 px-3 rounded-full text-sm border border-border text-ink placeholder:text-muted bg-surface focus:outline-none focus:border-ink transition-colors duration-150"
        />
        {searchQuery ? (
          <button
            onClick={() => onSearchChange('')}
            className="h-8 w-8 flex items-center justify-center rounded-full text-muted hover:text-ink transition-colors duration-150 cursor-pointer"
            aria-label="Clear search"
          >
            ✕
          </button>
        ) : null}
      </div>
    </div>
  );
};
