import { BudgetSummary as BudgetSummaryType } from "../types/budget";

interface BudgetSummaryProps {
  summary: BudgetSummaryType;
}

export const BudgetSummary = ({ summary }: BudgetSummaryProps) => {
  const { totalIncome, totalExpenses, totalSavings, balance } = summary;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="rounded-lg p-4 border border-green-100 bg-green-50">
        <h3 className="text-sm font-medium text-green-800">Income</h3>
        <p className="text-xl font-bold text-green-600">
          ${totalIncome.toFixed(2)}
        </p>
      </div>

      <div className="rounded-lg p-4 border border-red-100 bg-red-50">
        <h3 className="text-sm font-medium text-red-800">Expenses</h3>
        <p className="text-xl font-bold text-red-600">
          ${totalExpenses.toFixed(2)}
        </p>
      </div>

      <div className="rounded-lg p-4 border border-blue-100 bg-blue-50">
        <h3 className="text-sm font-medium text-blue-800">Savings</h3>
        <p className="text-xl font-bold text-blue-600">
          ${totalSavings.toFixed(2)}
        </p>
      </div>

      <div className="rounded-lg p-4 border border-purple-100 bg-purple-50">
        <h3 className="text-sm font-medium text-purple-800">Balance</h3>
        <p
          className={`text-xl font-bold ${
            balance >= 0 ? "text-purple-600" : "text-red-600"
          }`}
        >
          ${balance.toFixed(2)}
        </p>
      </div>
    </div>
  );
};
