// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchItems, addItem, updateItem, deleteItem } from '../../../src/services/budgetService';
import { supabase } from '../../../src/lib/supabase';
import type { BudgetItem } from '@shared/types/budget';

vi.mock('../../../src/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
    },
  },
}));

const mockItems: BudgetItem[] = [
  { id: 'abc-1', description: 'Salary', amount: 3000, category: 'income', date: '2024-01-01' },
  { id: 'abc-2', description: 'Rent', amount: 800, category: 'expense', date: '2024-01-02' },
];

const mockUser = { id: 'user-123', email: 'test@test.com' };

beforeEach(() => {
  vi.clearAllMocks();
});

// --- fetchItems ---

describe('fetchItems', () => {
  it('returns mapped BudgetItems on success', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: mockItems, error: null }),
      }),
    } as ReturnType<typeof supabase.from>);

    const result = await fetchItems();
    expect(result).toEqual(mockItems);
    expect(supabase.from).toHaveBeenCalledWith('budget_items');
  });

  it('returns empty array when data is null', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    } as ReturnType<typeof supabase.from>);

    const result = await fetchItems();
    expect(result).toEqual([]);
  });

  it('throws when Supabase returns an error', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
      }),
    } as ReturnType<typeof supabase.from>);

    await expect(fetchItems()).rejects.toThrow('DB error');
  });
});

// --- addItem ---

describe('addItem', () => {
  const newItem = { description: 'Bonus', amount: 500, category: 'income' as const, date: '2024-02-01' };
  const savedItem: BudgetItem = { id: 'new-id', ...newItem };

  it('inserts item with user_id and returns saved item', async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: mockUser as never },
      error: null,
    });
    vi.mocked(supabase.from).mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: savedItem, error: null }),
        }),
      }),
    } as ReturnType<typeof supabase.from>);

    const result = await addItem(newItem);
    expect(result).toEqual(savedItem);
  });

  it('throws when not authenticated', async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: null },
      error: null,
    });

    await expect(addItem(newItem)).rejects.toThrow('Not authenticated');
  });

  it('throws when Supabase returns an error', async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: mockUser as never },
      error: null,
    });
    vi.mocked(supabase.from).mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Insert failed' } }),
        }),
      }),
    } as ReturnType<typeof supabase.from>);

    await expect(addItem(newItem)).rejects.toThrow('Insert failed');
  });
});

// --- updateItem ---

describe('updateItem', () => {
  const changes = { description: 'Updated Rent', amount: 850 };
  const updatedItem: BudgetItem = { id: 'abc-2', category: 'expense', date: '2024-01-02', ...changes };

  it('updates item by id and returns updated item', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: updatedItem, error: null }),
          }),
        }),
      }),
    } as ReturnType<typeof supabase.from>);

    const result = await updateItem('abc-2', changes);
    expect(result).toEqual(updatedItem);
    expect(supabase.from).toHaveBeenCalledWith('budget_items');
  });

  it('throws when Supabase returns an error', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Update failed' } }),
          }),
        }),
      }),
    } as ReturnType<typeof supabase.from>);

    await expect(updateItem('abc-2', changes)).rejects.toThrow('Update failed');
  });
});

// --- deleteItem ---

describe('deleteItem', () => {
  it('deletes item by id', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    } as ReturnType<typeof supabase.from>);

    await expect(deleteItem('abc-1')).resolves.toBeUndefined();
    expect(supabase.from).toHaveBeenCalledWith('budget_items');
  });

  it('throws when Supabase returns an error', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: { message: 'Delete failed' } }),
      }),
    } as ReturnType<typeof supabase.from>);

    await expect(deleteItem('abc-1')).rejects.toThrow('Delete failed');
  });
});
