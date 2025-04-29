import { BudgetItem, BudgetCategory } from "../types/budget";

interface BudgetItemListProps {
  items: BudgetItem[];
  onDeleteItem: (id: string) => void;
  onEditItem?: (item: BudgetItem) => void;
}

export const BudgetItemList = ({
  items,
  onDeleteItem,
  onEditItem,
}: BudgetItemListProps) => {
  const getCategoryStyle = (category: BudgetCategory): string => {
    switch (category) {
      case "income":
        return "text-green-600 bg-green-100";
      case "expense":
        return "text-red-600 bg-red-100";
      case "savings":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="rounded-lg border border-gray-200">
      <div className="bg-gray-50 py-3 px-4 border-b border-gray-200 grid grid-cols-12 font-medium text-sm text-gray-500">
        <div className="col-span-4">Description</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-2">Amount</div>
        <div className="col-span-3">Date</div>
        <div className="col-span-1 text-center">Action</div>
      </div>
      <ul className="divide-y divide-gray-200">
        {items.map((item) => (
          <li
            key={item.id}
            className="py-3 px-4 grid grid-cols-12 items-center"
          >
            <div className="col-span-4 text-gray-800">{item.description}</div>
            <div className="col-span-2">
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs ${getCategoryStyle(
                  item.category
                )}`}
              >
                {item.category}
              </span>
            </div>
            <div className="col-span-2 font-medium">
              ${item.amount.toFixed(2)}
            </div>
            <div className="col-span-3 text-gray-500 text-sm">
              {new Date(item.date).toLocaleDateString()}
            </div>
            <div className="col-span-1 flex justify-center items-center gap-1">
              <button
                onClick={() => onEditItem && onEditItem(item)}
                className="text-blue-500 hover:text-blue-700 p-0.5 rounded-full hover:bg-blue-50"
                aria-label="Edit item"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                onClick={() => onDeleteItem(item.id)}
                className="text-red-500 hover:text-red-700 p-0.5 rounded-full hover:bg-red-50"
                aria-label="Delete item"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
