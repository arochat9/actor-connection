import type { linkActors } from "@service-user-for-actor-apps/sdk"

/**
 * Fetches the connections between two actors
 */
export async function fetchConnections(actor1Id: string, actor2Id: string): Promise<linkActors.ReturnType> {
  if (!actor1Id || !actor2Id) {
    return []
  }

  const response = await fetch(`/api/connections?actor1=${actor1Id}&actor2=${actor2Id}`)
  if (!response.ok) {
    throw new Error("Failed to find connections")
  }

  return response.json()
} 