"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import type { Osdk } from "@osdk/client"
import type { Actor } from "@service-user-for-actor-apps/sdk"

interface ActorsResponse {
  actors: Osdk.Instance<Actor>[]
}

interface ActorSearchProps {
  label: string
  onSelectActor: (actor: Osdk.Instance<Actor> | null) => void
  selectedActor: Osdk.Instance<Actor> | null
}

export default function ActorSearch({ label, onSelectActor, selectedActor }: ActorSearchProps) {
  const [inputValue, setInputValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionRef = useRef<HTMLDivElement>(null)

  // Load all actors once
  const { data: allActors = [] } = useQuery({
    queryKey: ["actors"],
    queryFn: async () => {
      const response = await fetch(`/api/actors/search`)
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json() as ActorsResponse
      return data.actors
    },
  })

  // Filter actors client-side based on input
  const filteredActors = allActors.filter(actor => 
    actor.actorName?.toLowerCase().includes(inputValue.toLowerCase()) ?? false
  )

  // Handle outside clicks to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionRef.current &&
        inputRef.current &&
        !suggestionRef.current.contains(event.target as Node) &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Set input value when selected actor changes
  useEffect(() => {
    if (selectedActor?.actorName) {
      setInputValue(selectedActor.actorName)
    }
  }, [selectedActor])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    if (value.length >= 2) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }

    if (selectedActor?.actorName && value !== selectedActor.actorName) {
      onSelectActor(null)
    }
  }

  const selectActor = (actor: Osdk.Instance<Actor>) => {
    onSelectActor(actor)
    if (actor.actorName) {
      setInputValue(actor.actorName)
    }
    setShowSuggestions(false)
  }

  return (
    <div className="inputGroup">
      <label htmlFor={`actor-${label}`} className="label">
        {label}
      </label>
      <div className="inputContainer">
        <input
          id={`actor-${label}`}
          ref={inputRef}
          className="input"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue.length >= 2 && setShowSuggestions(true)}
          placeholder="Start typing actor name..."
        />
        {showSuggestions && filteredActors.length > 0 && (
          <div ref={suggestionRef} className="suggestionList">
            {filteredActors.map((actor) => (
              <div key={actor.$primaryKey} className="suggestionItem" onMouseDown={() => selectActor(actor)}>
                {actor.actorName ?? 'Unnamed Actor'}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
