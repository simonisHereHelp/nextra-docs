import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

/**
 * Minimal Google-only NextAuth configuration
 * Works natively in the Next.js App Router (no Prisma or database adapter)
 */

export const authOptions = {
  debug: true,

  session: {
    strategy: "jwt", // use JWT sessions (no database needed)
  },

  pages: {
    signIn: "/login", // optional, define your custom login page if needed
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/drive",
        },
      },
    }),
  ],

  callbacks: {
    // Attach Google's access token to JWT
    async jwt({ token, account, user }) {
      if (account?.provider === "google") {
        token.accessToken = account.access_token;
        token.id = user?.id;
      }
      return token;
    },

    // Make access token available to client
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken;
        session.user.id = token.id || null;
      }
      return session;
    },
  },
};

// App Router requires explicit HTTP exports — no default export allowed
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
