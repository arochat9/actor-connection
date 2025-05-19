import { NextResponse } from "next/server"
import { linkActors } from "@service-user-for-actor-apps/sdk";
import { client } from "../../../lib/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const actor1Id = searchParams.get("actor1")
  const actor2Id = searchParams.get("actor2")

  if (!actor1Id || !actor2Id) {
    return NextResponse.json({ error: "Both actor1 and actor2 parameters are required" }, { status: 400 })
  }

  try {
    const result = await client(linkActors).executeFunction({
      actor1: actor1Id,
      actor2: actor2Id
    });
    result.push(result[result.length - 1])
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error finding connections:", error)
    return NextResponse.json({ error: "Failed to find connections between actors" }, { status: 500 })
  }
}
