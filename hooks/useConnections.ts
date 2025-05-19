import { useQuery } from "@tanstack/react-query"
import { fetchConnections } from "@/lib/api/connectionsApi"
import type { Osdk } from "@osdk/client"
import type { Actor } from "@service-user-for-actor-apps/sdk"

/**
 * Hook to fetch connections between two actors
 */
export function useConnections(actor1: Osdk.Instance<Actor> | null, actor2: Osdk.Instance<Actor> | null) {
  return useQuery({
    queryKey: ["connections", actor1?.$primaryKey, actor2?.$primaryKey],
    queryFn: () => {
      if (!actor1 || !actor2) {
        return Promise.resolve([])
      }
      return fetchConnections(actor1.$primaryKey, actor2.$primaryKey)
    },
    enabled: false, // Don't run automatically, we'll trigger it manually
  })
} 