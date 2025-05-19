import Image from "next/image"
import type { linkActors } from "@service-user-for-actor-apps/sdk"

interface ConnectionCardProps {
  connection: linkActors.ReturnType[0]
  isActorNode: boolean
}

export default function ConnectionCard({ connection, isActorNode }: ConnectionCardProps) {
  return (
    <div className={`connectionNode ${isActorNode ? "actorNode" : "movieNode"}`}>
      {isActorNode ? (
        <ActorCard connection={connection} />
      ) : (
        <MovieCard connection={connection} />
      )}
    </div>
  )
}

function ActorCard({ connection }: { connection: linkActors.ReturnType[0] }) {
  return (
    <>
      <Image
        src={connection.actor_image_url || "/placeholder.svg?height=225&width=150"}
        alt={connection.actor_name}
        width={150}
        height={225}
        className="nodeImage"
        sizes="(max-width: 640px) 120px, 150px"
      />
      <div className="actorName">{connection.actor_name}</div>
      <div className="characterName">as {connection.character_name}</div>
    </>
  )
}

function MovieCard({ connection }: { connection: linkActors.ReturnType[0] }) {
  return (
    <>
      <Image
        src={connection.movie_image_url || "/placeholder.svg?height=225&width=150"}
        alt={connection.movie_name}
        width={150}
        height={225}
        className="nodeImage"
        sizes="(max-width: 640px) 120px, 150px"
      />
      <div className="movieName">{connection.movie_name}</div>
    </>
  )
} 