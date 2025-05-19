import Image from "next/image"
import type { linkActors } from "@service-user-for-actor-apps/sdk"

interface ConnectionResultsProps {
  connections: linkActors.ReturnType
  isLoading: boolean
  error: string | null
}

export default function ConnectionResults({ connections, isLoading, error }: ConnectionResultsProps) {
  if (isLoading) {
    return (
      <div className="loadingContainer">
        <div className="loadingSpinner"></div>
      </div>
    )
  }

  if (error) {
    return <div className="noResults">{error}</div>
  }

  if (!connections || connections.length === 0) {
    return null
  }
  console.log("connections info: " + connections[0].actor_name);

  return (
    <div className="resultsContainer">
      <div className="connectionSummary">Found connection in {(connections.length - 1) / 2} degrees of separation</div>
      <div className="connectionPath">
        {connections.map((connection, index) => {
          const isActorNode = index % 2 === 0
          return (
            <div key={index} className={`connectionNode ${isActorNode ? "actorNode" : "movieNode"}`}>
              {isActorNode ? (
                <>
                  <Image
                    src={connection.actor_image_url || "/placeholder.svg?height=278&width=185"}
                    alt={connection.actor_name}
                    width={185}
                    height={278}
                    className="nodeImage"
                  />
                  <div className="actorName">{connection.actor_name}</div>
                  <div className="characterName">as {connection.character_name}</div>
                </>
              ) : (
                <>
                  <Image
                    src={connection.movie_image_url || "/placeholder.svg?height=278&width=185"}
                    alt={connection.movie_name}
                    width={185}
                    height={278}
                    className="nodeImage"
                  />
                  <div className="movieName">{connection.movie_name}</div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
