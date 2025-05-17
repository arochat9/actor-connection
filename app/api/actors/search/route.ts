import { NextResponse } from "next/server"
import type { Actor } from "@/lib/types"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    // Call your actual actors endpoint
    // Replace the URL with your actual API endpoint
    const response = await fetch(`${process.env.API_BASE_URL}/actors?search=${encodeURIComponent(query)}`)

    if (!response.ok) {
      throw new Error("Failed to fetch actors")
    }

    const actors: Actor[] = await response.json()
    return NextResponse.json(actors)
  } catch (error) {
    console.error("Error searching actors:", error)
    return NextResponse.json({ error: "Failed to search actors" }, { status: 500 })
  }
}
