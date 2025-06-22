import NavBar from "@/components/landing-page/nav-bar"
import { Button } from "@/components/ui/button"
import { authOptions } from "@/lib/auth-options"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Image from "next/image"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="container py-4">
          <NavBar />
          <main className="mt-30">
            <section className="flex flex-col justify-center items-center gap-3">
              <h1 className="text-5xl font-bold text-center">
                Provision Cloud Resources Effortlessly
              </h1>
              <h1 className="text-5xl font-bold text-center">
                Governed, Secure, Automated.
              </h1>
              <p className="text-lg">
                Empowers developers to request infrastructure in minutes
              </p>

              <Button size="lg" className="w-50 h-14 mt-10 text-base">
                Request a Demo
              </Button>
            </section>

            <section className="flex justify-center mt-90">
              <Image
                src="/landing-page/product-display-1.png"
                alt="orchestronic-product-display"
                width={1280}
                height={720}
              />
            </section>
          </main>

          <footer className=" text-center text-sm text-muted-foreground">
            © 2025 Orchestronic. All rights reserved.
          </footer>
        </div>
      </div>
    </>
  )
}
