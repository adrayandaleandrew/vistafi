import { BudgetItem, BudgetSummary } from '../types/budget';

// Function to calculate the budget summary based on items
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

    return {
        totalIncome,
        totalExpenses,
        totalSavings,
        balance
    };
};

// Generate unique ID for budget items
export const generateId = (): string => {
    return Math.random().toString(36).substring(2, 9);
}; 