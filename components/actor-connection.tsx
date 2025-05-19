"use client"

import { useState } from "react"
import ActorSearch from "@/components/actor-search"
import ConnectionResults from "@/components/connection-results"
import type { Actor } from "@service-user-for-actor-apps/sdk"
import type { Osdk } from "@osdk/client"
import { useConnections } from "@/hooks/useConnections"

export default function ActorConnection() {
  const [selectedActor1, setSelectedActor1] = useState<Osdk.Instance<Actor> | null>(null)
  const [selectedActor2, setSelectedActor2] = useState<Osdk.Instance<Actor> | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  // Use our custom hook for connections
  const {
    data: connections,
    isLoading,
    error,
    refetch,
  } = useConnections(selectedActor1, selectedActor2)

  const handleFindConnections = () => {
    if (selectedActor1 && selectedActor2) {
      setIsSearching(true)
      refetch()
    }
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full px-4 sm:px-6">
        <h1 className="title">Actor Degrees of Separation</h1>
        <div className="formContainer">
          <div className="inputRow">
            <ActorSearch label="First Actor" onSelectActor={setSelectedActor1} selectedActor={selectedActor1} />
            <ActorSearch label="Second Actor" onSelectActor={setSelectedActor2} selectedActor={selectedActor2} />
          </div>
          <button
            className="submitButton w-full sm:w-auto"
            onClick={handleFindConnections}
            disabled={!selectedActor1 || !selectedActor2 || isLoading}
          >
            {isLoading ? "Finding connections..." : "Find Connections"}
          </button>
        </div>
      </div>

      {/* Connection results will span full width without padding */}
      <div className="w-full">
        <ConnectionResults
          connections={connections || []}
          isLoading={isLoading}
          error={error instanceof Error ? error.message : error ? String(error) : null}
        />
      </div>
    </div>
  )
}
