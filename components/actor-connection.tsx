"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import ActorSearch from "@/components/actor-search"
import ConnectionResults from "@/components/connection-results"
import type { Actor, CharacterConnection } from "@/lib/types"

export default function ActorConnection() {
  const [selectedActor1, setSelectedActor1] = useState<Actor | null>(null)
  const [selectedActor2, setSelectedActor2] = useState<Actor | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const {
    data: connections,
    isLoading,
    error,
    refetch,
  } = useQuery<CharacterConnection[]>({
    queryKey: ["connections", selectedActor1?.id, selectedActor2?.id],
    queryFn: async () => {
      if (!selectedActor1 || !selectedActor2) {
        return []
      }

      const response = await fetch(`/api/connections?actor1=${selectedActor1.id}&actor2=${selectedActor2.id}`)
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
