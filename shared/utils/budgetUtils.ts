import { BudgetItem, BudgetSummary } from '../types/budget';

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
