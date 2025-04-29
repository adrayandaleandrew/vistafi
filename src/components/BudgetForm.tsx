import { useState } from "react";
import { BudgetCategory, BudgetItem } from "../types/budget";
import { generateId } from "../utils/budgetUtils";

interface BudgetFormProps {
  onAddItem: (item: BudgetItem) => void;
}

export const BudgetForm = ({ onAddItem }: BudgetFormProps) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"expense" | "income">("expense");
  const [category, setCategory] = useState<BudgetCategory>("expense");
  const [date] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim() || !amount.trim()) {
      return;
    }

    const newItem: BudgetItem = {
      id: generateId(),
      description: description.trim(),
      amount: parseFloat(amount),
      category: type === "income" ? "income" : category,
      date,
    };

    onAddItem(newItem);

    // Reset form
    setDescription("");
    setAmount("");
    setType("expense");
    setCategory("expense");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-lg border border-gray-200 bg-white shadow-sm"
    >
      <h2 className="text-xl font-semibold mb-6">Quick Add</h2>

      <div className="mb-5">
        <label className="block text-gray-700 font-medium mb-2">Type</label>
        <div className="flex gap-6">
          <label className="flex items-center">
            <input
              type="radio"
              className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
              checked={type === "expense"}
              onChange={() => setType("expense")}
            />
            <span className="ml-2">Expense</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
              checked={type === "income"}
              onChange={() => setType("income")}
            />
            <span className="ml-2">Income</span>
          </label>
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 font-medium mb-2">Amount</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 text-lg">$</span>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="pl-8 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            step="0.01"
            min="0.01"
            required
          />
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 font-medium mb-2">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as BudgetCategory)}
          className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          disabled={type === "income"}
          required
        >
          <option value="" disabled>
            Select category
          </option>
          {type === "expense" && (
            <>
              <option value="expense">General Expense</option>
              <option value="savings">Savings</option>
            </>
          )}
          {type === "income" && <option value="income">Income</option>}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's this for?"
          className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
      >
        Add Transaction
      </button>
    </form>
  );
};
