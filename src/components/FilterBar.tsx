import { BudgetCategory } from "@shared/types/budget";

interface FilterBarProps {
  active: BudgetCategory | 'all';
  onChange: (cat: BudgetCategory | 'all') => void;
}

const filters: { label: string; value: BudgetCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Income', value: 'income' },
  { label: 'Expense', value: 'expense' },
  { label: 'Savings', value: 'savings' },
];

export const FilterBar = ({ active, onChange }: FilterBarProps) => {
  return (
    <div className="flex gap-2 mb-4">
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
  );
};
