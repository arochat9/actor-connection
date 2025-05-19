import { useQuery } from "@tanstack/react-query"
import { fetchAllActors } from "@/lib/api/actorApi"
import type { Osdk } from "@osdk/client"
import type { Actor } from "@service-user-for-actor-apps/sdk"

/**
 * Hook to fetch all actors
 */
export function useActors() {
  return useQuery({
    queryKey: ["actors"],
    queryFn: fetchAllActors
  })
}

/**
 * Hook to get filtered actors based on input
 * This uses the results of useActors and filters client-side
 */
export function useFilteredActors(inputValue: string, allActors: Osdk.Instance<Actor>[] = []) {
  const filtered = allActors.filter(actor => 
    actor.actorName?.toLowerCase().includes(inputValue.toLowerCase()) ?? false
  )
  
  return {
    filteredActors: inputValue.length >= 2 ? filtered : []
  }
} 