import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchGoals, upsertGoal, deleteGoal } from '../services/goalService'
import type { BudgetGoal, BudgetCategory } from '@shared/types/budget'

interface SetGoalVars { category: BudgetCategory; targetAmount: number }

export function useGoals(userId: string) {
  return useQuery({
    queryKey: ['goals', userId],
    queryFn: () => fetchGoals(),
    enabled: !!userId,
  })
}

export function useSetGoal(userId: string) {
  const queryClient = useQueryClient()
  const queryKey = ['goals', userId]
  return useMutation({
    mutationFn: ({ category, targetAmount }: SetGoalVars) => upsertGoal(category, targetAmount),
    onMutate: useCallback(async ({ category, targetAmount }: SetGoalVars) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<BudgetGoal[]>(queryKey)
      queryClient.setQueryData<BudgetGoal[]>(queryKey, curr => {
        const others = (curr ?? []).filter(g => g.category !== category)
        return [...others, { id: `optimistic-${Date.now()}`, category, targetAmount }]
      })
      return { previous }
    }, [queryClient, queryKey]),
    onError: useCallback((_e: unknown, _v: unknown, ctx?: { previous?: BudgetGoal[] }) => {
      if (ctx?.previous !== undefined) queryClient.setQueryData(queryKey, ctx.previous)
    }, [queryClient, queryKey]),
    onSettled: useCallback(() => {
      queryClient.invalidateQueries({ queryKey })
    }, [queryClient, queryKey]),
  })
}

export function useDeleteGoal(userId: string) {
  const queryClient = useQueryClient()
  const queryKey = ['goals', userId]
  return useMutation({
    mutationFn: deleteGoal,
    onMutate: useCallback(async (id: string) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<BudgetGoal[]>(queryKey)
      queryClient.setQueryData<BudgetGoal[]>(queryKey, curr => (curr ?? []).filter(g => g.id !== id))
      return { previous }
    }, [queryClient, queryKey]),
    onError: useCallback((_e: unknown, _v: unknown, ctx?: { previous?: BudgetGoal[] }) => {
      if (ctx?.previous !== undefined) queryClient.setQueryData(queryKey, ctx.previous)
    }, [queryClient, queryKey]),
    onSettled: useCallback(() => {
      queryClient.invalidateQueries({ queryKey })
    }, [queryClient, queryKey]),
  })
}
