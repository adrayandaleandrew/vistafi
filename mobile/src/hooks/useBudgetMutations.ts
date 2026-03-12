import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addItem, updateItem, deleteItem } from '../services/budgetService'
import type { BudgetItem } from '@shared/types/budget'

export function useAddItem(userId: string) {
  const queryClient = useQueryClient()
  const queryKey = ['budgetItems', userId]

  const onMutate = useCallback(async (newItem: Omit<BudgetItem, 'id'>) => {
    await queryClient.cancelQueries({ queryKey })
    const previous = queryClient.getQueryData<BudgetItem[]>(queryKey)
    queryClient.setQueryData<BudgetItem[]>(queryKey, (curr) => [
      ...(curr ?? []),
      { ...newItem, id: `optimistic-${Date.now()}` },
    ])
    return { previous }
  }, [queryClient, queryKey])

  const onError = useCallback(
    (_err: unknown, _vars: unknown, context: { previous?: BudgetItem[] } | undefined) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKey, context.previous)
      }
    },
    [queryClient, queryKey]
  )

  const onSettled = useCallback(() => {
    queryClient.invalidateQueries({ queryKey })
  }, [queryClient, queryKey])

  return useMutation({
    mutationFn: (newItem: Omit<BudgetItem, 'id'>) => addItem(userId, newItem),
    onMutate,
    onError,
    onSettled,
  })
}

export function useUpdateItem(userId: string) {
  const queryClient = useQueryClient()
  const queryKey = ['budgetItems', userId]

  const onMutate = useCallback(async (updated: BudgetItem) => {
    await queryClient.cancelQueries({ queryKey })
    const previous = queryClient.getQueryData<BudgetItem[]>(queryKey)
    queryClient.setQueryData<BudgetItem[]>(queryKey, (curr) =>
      (curr ?? []).map((item) => (item.id === updated.id ? updated : item))
    )
    return { previous }
  }, [queryClient, queryKey])

  const onError = useCallback(
    (_err: unknown, _vars: unknown, context: { previous?: BudgetItem[] } | undefined) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKey, context.previous)
      }
    },
    [queryClient, queryKey]
  )

  const onSettled = useCallback(() => {
    queryClient.invalidateQueries({ queryKey })
  }, [queryClient, queryKey])

  return useMutation({
    mutationFn: updateItem,
    onMutate,
    onError,
    onSettled,
  })
}

export function useDeleteItem(userId: string) {
  const queryClient = useQueryClient()
  const queryKey = ['budgetItems', userId]

  const onMutate = useCallback(async (id: string) => {
    await queryClient.cancelQueries({ queryKey })
    const previous = queryClient.getQueryData<BudgetItem[]>(queryKey)
    queryClient.setQueryData<BudgetItem[]>(queryKey, (curr) =>
      (curr ?? []).filter((item) => item.id !== id)
    )
    return { previous }
  }, [queryClient, queryKey])

  const onError = useCallback(
    (_err: unknown, _vars: unknown, context: { previous?: BudgetItem[] } | undefined) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKey, context.previous)
      }
    },
    [queryClient, queryKey]
  )

  const onSettled = useCallback(() => {
    queryClient.invalidateQueries({ queryKey })
  }, [queryClient, queryKey])

  return useMutation({
    mutationFn: deleteItem,
    onMutate,
    onError,
    onSettled,
  })
}
