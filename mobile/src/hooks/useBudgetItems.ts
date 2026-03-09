import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { fetchItems } from '../services/budgetService'

export function useBudgetItems(userId: string) {
  const queryClient = useQueryClient()
  const queryKey = ['budgetItems', userId]

  useEffect(() => {
    if (!userId) return
    const channel = supabase
      .channel(`budget_items_${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'budget_items' },
        () => { queryClient.invalidateQueries({ queryKey }) }
      )
    channel.subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [userId, queryClient])

  return useQuery({
    queryKey,
    queryFn: () => fetchItems(),
    enabled: !!userId,
  })
}
