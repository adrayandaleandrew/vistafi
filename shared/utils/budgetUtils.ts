import { BudgetItem, BudgetSummary, MonthlyTrend } from '../types/budget';

export const calculateBudgetSummary = (items: BudgetItem[]): BudgetSummary => {
    const totalIncome = items
        .filter(item => item.category === 'income')
        .reduce((sum, item) => sum + item.amount, 0);

    const totalExpenses = items
        .filter(item => item.category === 'expense')
        .reduce((sum, item) => sum + item.amount, 0);

    const totalSavings = items
        .filter(item => item.category === 'savings')
        .reduce((sum, item) => sum + item.amount, 0);

    const balance = totalIncome - totalExpenses - totalSavings;

    return { totalIncome, totalExpenses, totalSavings, balance };
};

export const calculateCurrentMonthSummary = (
  items: BudgetItem[],
  month: string = new Date().toISOString().slice(0, 7),
): BudgetSummary => {
  return calculateBudgetSummary(
    items.filter(item => item.date.startsWith(month))
  );
};

export const generateId = (): string => {
    return Math.random().toString(36).substring(2, 9);
};

export function calculateMonthlyTrends(
  items: BudgetItem[],
  months: number = 6
): MonthlyTrend[] {
  const now = new Date();
  const result: MonthlyTrend[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const yearMonth = `${year}-${month}`;
    const monthItems = items.filter(item => item.date.startsWith(yearMonth));
    const summary = calculateBudgetSummary(monthItems);
    result.push({ month: yearMonth, ...summary });
  }
  return result;
}

export function calculateSavingsRate(summary: BudgetSummary): number {
  if (summary.totalIncome === 0) return 0;
  return Math.round((summary.totalSavings / summary.totalIncome) * 1000) / 10;
}

export function getTopExpenses(items: BudgetItem[], limit: number = 5): BudgetItem[] {
  return items
    .filter(item => item.category === 'expense')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}
