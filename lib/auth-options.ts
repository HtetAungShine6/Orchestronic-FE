import AzureADProvider from "next-auth/providers/azure-ad"
import { JWT } from "next-auth/jwt"
import { createUser, getUserByEmail } from "@/app/api/user/api"
import type { Session, User } from "next-auth"
import type { AuthOptions } from "next-auth"
import { isApiError } from "@/types/error"

export const authOptions: AuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID || "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || "",
      tenantId: process.env.AZURE_AD_TENANT_ID || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }: { user: User }) {
      if (!user.email) return false

      try {
        let existingUser: User

        try {
          existingUser = await getUserByEmail(user.email)
        } catch (error) {
          if (isApiError(error) && error.statusCode === 404) {
            existingUser = await createUser(user)
          } else {
            throw error
          }
        }

        if (existingUser) {
          user.role = existingUser.role
        }

        return true
      } catch (error) {
        console.error("Error during signIn user check/create:", error)
        return false
      }
    },

    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.name = user.name ?? undefined
        token.email = user.email ?? undefined
        token.role = user.role ?? undefined
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.name = token.name
        session.user.email = token.email
        session.user.role = token.role
      }
      return session
    },
  },
}
