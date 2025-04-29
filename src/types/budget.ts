export type BudgetCategory = 'income' | 'expense' | 'savings';

export interface BudgetItem {
    id: string;
    description: string;
    amount: number;
    category: BudgetCategory;
    date: string;
}

export interface BudgetSummary {
    totalIncome: number;
    totalExpenses: number;
    totalSavings: number;
    balance: number;
} 