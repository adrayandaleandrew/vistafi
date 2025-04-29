import { BudgetItem } from '../types/budget';

export const mockBudgetItems: BudgetItem[] = [
    {
        id: '1',
        description: 'Monthly Salary',
        amount: 4000,
        category: 'income',
        date: '2023-11-01'
    },
    {
        id: '2',
        description: 'Freelance Project',
        amount: 1200,
        category: 'income',
        date: '2023-11-10'
    },
    {
        id: '3',
        description: 'Rent',
        amount: 1500,
        category: 'expense',
        date: '2023-11-05'
    },
    {
        id: '4',
        description: 'Groceries',
        amount: 400,
        category: 'expense',
        date: '2023-11-08'
    },
    {
        id: '5',
        description: 'Utilities',
        amount: 200,
        category: 'expense',
        date: '2023-11-15'
    },
    {
        id: '6',
        description: 'Retirement Fund',
        amount: 500,
        category: 'savings',
        date: '2023-11-02'
    },
    {
        id: '7',
        description: 'Emergency Fund',
        amount: 300,
        category: 'savings',
        date: '2023-11-02'
    }
]; 