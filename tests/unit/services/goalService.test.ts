// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchGoals, upsertGoal, deleteGoal } from '../../../src/services/goalService';
import { supabase } from '../../../src/lib/supabase';

vi.mock('../../../src/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
    },
  },
}));

const mockUser = { id: 'user-123', email: 'test@test.com' };

beforeEach(() => {
  vi.clearAllMocks();
});

// --- fetchGoals ---

describe('fetchGoals', () => {
  it('returns empty array when Supabase returns null data', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    } as ReturnType<typeof supabase.from>);

    const result = await fetchGoals();
    expect(result).toEqual([]);
  });

  it('maps target_amount snake_case to targetAmount camelCase', async () => {
    const rawRows = [
      { id: 'goal-1', category: 'income', target_amount: 5000 },
      { id: 'goal-2', category: 'expense', target_amount: 2000 },
    ];
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: rawRows, error: null }),
      }),
    } as ReturnType<typeof supabase.from>);

    const result = await fetchGoals();
    expect(result).toEqual([
      { id: 'goal-1', category: 'income', targetAmount: 5000 },
      { id: 'goal-2', category: 'expense', targetAmount: 2000 },
    ]);
  });
});

// --- upsertGoal ---

describe('upsertGoal', () => {
  it('calls supabase.upsert with correct payload', async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: mockUser as never },
      error: null,
    });
    const mockUpsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: { id: 'goal-1', category: 'income', target_amount: 5000 },
          error: null,
        }),
      }),
    });
    vi.mocked(supabase.from).mockReturnValue({
      upsert: mockUpsert,
    } as ReturnType<typeof supabase.from>);

    const result = await upsertGoal('income', 5000);
    expect(mockUpsert).toHaveBeenCalledWith(
      { user_id: 'user-123', category: 'income', target_amount: 5000 },
      { onConflict: 'user_id,category' },
    );
    expect(result).toEqual({ id: 'goal-1', category: 'income', targetAmount: 5000 });
  });

  it('throws if user is not authenticated', async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: null },
      error: null,
    });

    await expect(upsertGoal('income', 5000)).rejects.toThrow('Not authenticated');
  });
});

// --- deleteGoal ---

describe('deleteGoal', () => {
  it('calls supabase.delete with correct id filter', async () => {
    const mockEq = vi.fn().mockResolvedValue({ error: null });
    const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });
    vi.mocked(supabase.from).mockReturnValue({
      delete: mockDelete,
    } as ReturnType<typeof supabase.from>);

    await expect(deleteGoal('goal-1')).resolves.toBeUndefined();
    expect(supabase.from).toHaveBeenCalledWith('budget_goals');
    expect(mockEq).toHaveBeenCalledWith('id', 'goal-1');
  });
});
