import { BudgetSummary as BudgetSummaryType } from "@shared/types/budget";

interface BudgetSummaryProps {
  summary: BudgetSummaryType;
}

export const BudgetSummary = ({ summary }: Readonly<BudgetSummaryProps>) => {
  const { totalIncome, totalExpenses, totalSavings, balance } = summary;

  const metrics = [
    { label: 'Income', amount: totalIncome, color: 'text-income' },
    { label: 'Expenses', amount: totalExpenses, color: 'text-expense' },
    { label: 'Savings', amount: totalSavings, color: 'text-savings' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-3 mb-8">
      {/* Balance hero cell */}
      <div className="bg-surface border border-border rounded-xl p-6 flex flex-col justify-between min-h-[160px]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
          Net Balance
        </span>
        <span className={`text-5xl font-bold num ${balance >= 0 ? 'text-income' : 'text-expense'}`}>
          ${balance.toFixed(2)}
        </span>
        <span className="text-sm text-muted">income − expenses − savings</span>
      </div>

      {/* 3 stacked metric cards */}
      <div className="grid grid-rows-3 gap-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-surface border border-border rounded-xl px-5 py-4 flex justify-between items-center"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
              {metric.label}
            </span>
            <span className={`text-xl font-semibold num ${metric.color}`}>
              ${metric.amount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
