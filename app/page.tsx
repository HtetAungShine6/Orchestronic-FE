import AuthButton from "@/components/auth/auth-button"
import OrchestronicLogo from "@/components/orchestronic-logo"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div className="flex items-center justify-center min-h-screen">
      <main>
        <div className="flex flex-col gap-5 justify-center">
          <a href="/" className="flex gap-2">
            {/* <IconInnerShadowTop className="!size-5" /> */}
            <OrchestronicLogo size={35} />
            <span className="text-3xl font-semibold">Orchestronic</span>
          </a>
          {session?.user && (
            <div>
              <p>Welcome {session?.user?.name}</p>
            </div>
          )}

          <div className="flex justify-end">
            <AuthButton />
          </div>
        </div>
      </main>

      <footer></footer>
    </div>
  )
}
