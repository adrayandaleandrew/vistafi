import { useQuery } from '@tanstack/react-query'
import { fetchItems } from '../services/budgetService'

export function useBudgetItems(userId: string) {
  return useQuery({
    queryKey: ['budgetItems', userId],
    queryFn: () => fetchItems(),
    enabled: !!userId,
  })
}
