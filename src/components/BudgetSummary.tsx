import { BudgetSummary as BudgetSummaryType, BudgetGoal } from "@shared/types/budget";

interface BudgetSummaryProps {
  summary: BudgetSummaryType;
  goals: BudgetGoal[];
  currentMonthSummary: BudgetSummaryType;
}

export const BudgetSummary = ({ summary, goals, currentMonthSummary }: Readonly<BudgetSummaryProps>) => {
  const { totalIncome, totalExpenses, totalSavings, balance } = summary;

  const metrics = [
    {
      label: 'Income',
      amount: totalIncome,
      color: 'text-income',
      barColor: 'bg-income',
      currentAmount: currentMonthSummary.totalIncome,
      goalCategory: 'income' as const,
    },
    {
      label: 'Expenses',
      amount: totalExpenses,
      color: 'text-expense',
      barColor: 'bg-expense',
      currentAmount: currentMonthSummary.totalExpenses,
      goalCategory: 'expense' as const,
    },
    {
      label: 'Savings',
      amount: totalSavings,
      color: 'text-savings',
      barColor: 'bg-savings',
      currentAmount: currentMonthSummary.totalSavings,
      goalCategory: 'savings' as const,
    },
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
        {metrics.map((metric) => {
          const goal = goals.find(g => g.category === metric.goalCategory) ?? null;
          const pct = goal !== null
            ? Math.min(100, Math.round((metric.currentAmount / goal.targetAmount) * 100))
            : 0;

          return (
            <div
              key={metric.label}
              className="bg-surface border border-border rounded-xl px-5 py-4 flex flex-col justify-between"
            >
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
                  {metric.label}
                </span>
                <span className={`text-xl font-semibold num ${metric.color}`}>
                  ${metric.amount.toFixed(2)}
                </span>
              </div>
              {goal !== null ? (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-muted num">${metric.currentAmount.toFixed(2)}</span>
                    <span className="text-[10px] text-muted num">${goal.targetAmount.toFixed(2)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      role="progressbar"
                      aria-label={`${metric.label} goal progress`}
                      aria-valuenow={pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      className={`h-full rounded-full ${metric.barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
