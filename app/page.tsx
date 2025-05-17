import ActorConnection from "@/components/actor-connection"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <ActorConnection />
      <Footer />
    </main>
  )
}
