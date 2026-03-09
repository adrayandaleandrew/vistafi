import type { BudgetItem } from '@shared/types/budget';

export function generateCsv(items: BudgetItem[]): string {
  const header = 'Date,Description,Category,Amount';
  const rows = items.map(item => {
    const desc = item.description.includes(',')
      ? `"${item.description}"`
      : item.description;
    return `${item.date},${desc},${item.category},${item.amount}`;
  });
  return [header, ...rows].join('\n');
}

export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
