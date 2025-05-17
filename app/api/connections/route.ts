import { NextResponse } from "next/server"
import type { CharacterConnection } from "@/lib/types"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const actor1Id = searchParams.get("actor1")
  const actor2Id = searchParams.get("actor2")

  if (!actor1Id || !actor2Id) {
    return NextResponse.json({ error: "Both actor1 and actor2 parameters are required" }, { status: 400 })
  }

  try {
    // Call your actual linkActors endpoint
    // Replace the URL with your actual API endpoint
    const response = await fetch(`${process.env.API_BASE_URL}/linkActors?actor1=${actor1Id}&actor2=${actor2Id}`)

    if (!response.ok) {
      throw new Error("Failed to fetch connections")
    }

    const connections: CharacterConnection[] = await response.json()
    return NextResponse.json(connections)
  } catch (error) {
    console.error("Error finding connections:", error)
    return NextResponse.json({ error: "Failed to find connections between actors" }, { status: 500 })
  }
}
