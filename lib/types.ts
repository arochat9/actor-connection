export interface Actor {
  id: string
  name: string
  image_url?: string
}

export interface CharacterConnection {
  actor_name: string
  actor_image_url: string | undefined
  character_name: string
  movie_name: string
  movie_image_url: string
}
