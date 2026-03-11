import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: { strategy: "jwt" as const },
  pages: {
    signIn: "/login",
  },
  providers: [], // Providers are added in auth.ts (not here, to avoid importing db in middleware)
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role as string;
        (session.user as any).id = token.id as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      const protectedPaths = ["/dashboard"];
      const isProtected = protectedPaths.some((path) =>
        pathname.startsWith(path)
      );

      if (isProtected && !isLoggedIn) {
        return false; // Redirect to signIn page
      }

      const authPaths = ["/login", "/register"];
      const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

      if (isAuthPath && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
