"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import type { Actor } from "@/lib/types"

interface ActorSearchProps {
  label: string
  onSelectActor: (actor: Actor | null) => void
  selectedActor: Actor | null
}

export default function ActorSearch({ label, onSelectActor, selectedActor }: ActorSearchProps) {
  const [inputValue, setInputValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionRef = useRef<HTMLDivElement>(null)

  // Search for actors based on input
  const { data: filteredActors = [] } = useQuery({
    queryKey: ["actors", inputValue],
    queryFn: async () => {
      if (!inputValue || inputValue.length < 2) return []

      const response = await fetch(`/api/actors/search?query=${encodeURIComponent(inputValue)}`)
      if (!response.ok) {
        throw new Error("Failed to search actors")
      }

      return response.json()
    },
    enabled: inputValue.length >= 2,
  })

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
    if (selectedActor) {
      setInputValue(selectedActor.name)
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

    if (selectedActor && value !== selectedActor.name) {
      onSelectActor(null)
    }
  }

  const selectActor = (actor: Actor) => {
    onSelectActor(actor)
    setInputValue(actor.name)
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
              <div key={actor.id} className="suggestionItem" onMouseDown={() => selectActor(actor)}>
                {actor.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
