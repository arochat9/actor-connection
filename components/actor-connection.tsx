"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import ActorSearch from "@/components/actor-search"
import ConnectionResults from "@/components/connection-results"
import type { Actor, linkActors } from "@service-user-for-actor-apps/sdk"
import type { Osdk } from "@osdk/client"

export default function ActorConnection() {
  const [selectedActor1, setSelectedActor1] = useState<Osdk.Instance<Actor> | null>(null)
  const [selectedActor2, setSelectedActor2] = useState<Osdk.Instance<Actor> | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const {
    data: connections,
    isLoading,
    error,
    refetch,
  } = useQuery<linkActors.ReturnType>({
    queryKey: ["connections", selectedActor1?.$primaryKey, selectedActor2?.$primaryKey],
    queryFn: async () => {
      if (!selectedActor1 || !selectedActor2) {
        return []
      }

      const response = await fetch(`/api/connections?actor1=${selectedActor1.$primaryKey}&actor2=${selectedActor2.$primaryKey}`)
      if (!response.ok) {
        throw new Error("Failed to find connections")
      }

      return response.json()
    },
    enabled: false, // Don't run automatically, we'll trigger it manually
  })

  const handleFindConnections = () => {
    if (selectedActor1 && selectedActor2) {
      setIsSearching(true)
      refetch()
    }
  }

  return (
    <div className="container">
      <h1 className="title">Actor Degrees of Separation</h1>
      <div className="formContainer">
        <div className="inputRow">
          <ActorSearch label="First Actor" onSelectActor={setSelectedActor1} selectedActor={selectedActor1} />
          <ActorSearch label="Second Actor" onSelectActor={setSelectedActor2} selectedActor={selectedActor2} />
        </div>
        <button
          className="submitButton"
          onClick={handleFindConnections}
          disabled={!selectedActor1 || !selectedActor2 || isLoading}
        >
          {isLoading ? "Finding connections..." : "Find Connections"}
        </button>
      </div>

      <ConnectionResults
        connections={connections || []}
        isLoading={isLoading}
        error={error instanceof Error ? error.message : error ? String(error) : null}
      />
    </div>
  )
}
