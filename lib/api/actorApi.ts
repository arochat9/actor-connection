import type { Osdk } from "@osdk/client"
import type { Actor } from "@service-user-for-actor-apps/sdk"

interface ActorsResponse {
  actors: Osdk.Instance<Actor>[]
}

/**
 * Fetches all actors from the API
 */
export async function fetchAllActors(): Promise<Osdk.Instance<Actor>[]> {
  const response = await fetch(`/api/actors/search`)
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }

  const data = await response.json() as ActorsResponse
  return data.actors
}

/**
 * Searches for actors based on a search term
 * Note: This function is currently implemented client-side 
 * but could be moved to server-side filtering in the future
 */
export function filterActors(actors: Osdk.Instance<Actor>[], searchTerm: string): Osdk.Instance<Actor>[] {
  if (!searchTerm || searchTerm.length < 2) return []
  
  return actors.filter(actor => 
    actor.actorName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  )
} 