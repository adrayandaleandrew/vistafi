import type { BudgetItem, BudgetSummary } from '@shared/types/budget'
import { calculateMonthlyTrends, calculateSavingsRate, getTopExpenses } from '@shared/utils/budgetUtils'

const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

interface AnalyticsPanelProps {
  readonly items: BudgetItem[]
  readonly summary: BudgetSummary
}

export function AnalyticsPanel({ items, summary }: Readonly<AnalyticsPanelProps>) {
  const trends = calculateMonthlyTrends(items, 6)
  const savingsRate = calculateSavingsRate(summary)
  const topExpenses = getTopExpenses(items, 5)
  const maxBarValue = Math.max(...trends.map(t => Math.max(t.totalIncome, t.totalExpenses)), 1)

  return (
    <section aria-label="Budget analytics" className="space-y-4">
      {/* Monthly Trend Card */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="font-display text-lg font-semibold text-ink mb-4">Monthly Trend</h2>
        <div
          role="img"
          aria-label="Monthly income and expenses bar chart for the last 6 months"
          className="flex items-end gap-3 h-20"
        >
          {trends.map(trend => {
            const monthIndex = parseInt(trend.month.slice(5, 7), 10) - 1
            const incomeHeight = maxBarValue > 0 ? (trend.totalIncome / maxBarValue) * 100 : 0
            const expenseHeight = maxBarValue > 0 ? (trend.totalExpenses / maxBarValue) * 100 : 0
            return (
              <div key={trend.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end gap-0.5 h-16">
                  <div
                    className="flex-1 bg-income rounded-t-sm"
                    style={{ height: `${incomeHeight}%` }}
                    aria-label={`${MONTH_ABBR[monthIndex]} income $${trend.totalIncome.toFixed(2)}`}
                  />
                  <div
                    className="flex-1 bg-expense rounded-t-sm"
                    style={{ height: `${expenseHeight}%` }}
                    aria-label={`${MONTH_ABBR[monthIndex]} expenses $${trend.totalExpenses.toFixed(2)}`}
                  />
                </div>
                <span className="text-xs text-muted">{MONTH_ABBR[monthIndex]}</span>
              </div>
            )
          })}
        </div>
        <div className="flex gap-4 mt-3">
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <span className="w-3 h-3 rounded-sm bg-income inline-block" />Income
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <span className="w-3 h-3 rounded-sm bg-expense inline-block" />Expenses
          </span>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Savings Rate Card */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="font-display text-lg font-semibold text-ink mb-4">Savings Rate</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-muted text-sm">of income saved</span>
              <span className="num text-2xl font-bold text-income">{savingsRate.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-border rounded-full overflow-hidden">
              <div
                role="progressbar"
                aria-valuenow={savingsRate}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Savings rate"
                className="h-full bg-income rounded-full transition-all duration-300"
                style={{ width: `${Math.min(savingsRate, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Top Expenses Card */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="font-display text-lg font-semibold text-ink mb-4">Top Expenses</h2>
          {topExpenses.length === 0 ? (
            <p className="text-muted text-sm">No expense items yet.</p>
          ) : (
            <ol className="space-y-2">
              {topExpenses.map((item, idx) => (
                <li key={item.id} className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-sm text-ink">
                    <span className="text-muted tabular-nums">{idx + 1}.</span>
                    {item.description}
                  </span>
                  <span className="num text-sm text-expense font-medium">${item.amount.toFixed(2)}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  )
}
