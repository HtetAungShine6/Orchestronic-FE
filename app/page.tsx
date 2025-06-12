import AuthButton from "@/components/auth/auth-button"
import OrchestronicLogo from "@/components/orchestronic-logo"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <main>
        <div className="flex flex-col gap-5 justify-center">
          <Link href="/" className="flex gap-2">
            <OrchestronicLogo size={35} />
            <span className="text-3xl font-semibold">Orchestronic</span>
          </Link>

          <div className="flex justify-end">
            <AuthButton />
          </div>
        </div>
      </main>

      <footer></footer>
    </div>
  )
}
