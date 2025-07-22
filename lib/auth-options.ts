import AzureADProvider from "next-auth/providers/azure-ad"
import { JWT } from "next-auth/jwt"
import { createUser, getUserByEmail } from "@/app/api/user/api"
import type { Account, Session, User } from "next-auth"
import type { AuthOptions } from "next-auth"
import { isApiError } from "@/types/error"
import { Role } from "@/types/role"
import exchangeToken, { refreshAccessToken } from "@/app/api/auth/api"

export const authOptions: AuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID ?? "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET ?? "",
      tenantId: process.env.AZURE_AD_TENANT_ID ?? "",
      authorization: {
        params: {
          scope:
            "openid profile email api://bfbb98d5-f4cf-4d6b-b6fc-487eecff1c69/access_as_user",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
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
          user.id = existingUser.id
          user.role = existingUser.role
        }

        return true
      } catch (error) {
        console.error("Error during signIn user check/create:", error)
        return false
      }
    },

    async jwt({
      token,
      user,
      account,
    }: {
      token: JWT
      user?: User
      account?: Account | null
    }) {
      if (user) {
        const backendRes = await exchangeToken(account?.access_token ?? "")
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.role = user.role
        token.backendaccessToken = backendRes.accessToken
        token.backendrefreshToken = backendRes.refreshToken
        token.backendaccessTokenExpires = Date.now() + 3600 * 1000
        token.accessToken = account?.access_token
        return token
      }

      // On every subsequent request
      if (Date.now() >= (token.backendaccessTokenExpires ?? 0)) {
        try {
          const newAccessToken = await refreshAccessToken(
            token.backendrefreshToken ?? ""
          )
          token.backendaccessToken = newAccessToken.accessToken
          token.backendaccessTokenExpires = Date.now() + 3600 * 1000
        } catch (err) {
          console.error("Failed to refresh token", err)
          return { ...token, error: "RefreshAccessTokenError" }
        }
      }

      return token
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.role = token.role as Role
        session.user.accessToken = token.accessToken
        session.user.backendaccessToken = token.backendaccessToken
        session.user.backendrefreshToken = token.backendrefreshToken
        session.user.backendaccessTokenExpires = token.backendaccessTokenExpires
      }
      return session
    },
  },
}
