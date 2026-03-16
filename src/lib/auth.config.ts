import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {

  session: {
    strategy: "jwt"
  },

  pages: {
    signIn: "/login"
  },

  providers: [],

  callbacks: {

    async jwt({ token, user }) {

      if (user) {
        token.role = (user as any).role
        token.id = (user as any).id
      }

      return token
    },

    async session({ session, token }) {

      if (session.user) {
        ;(session.user as any).role = token.role
        ;(session.user as any).id = token.id
      }

      return session
    }
  }
}