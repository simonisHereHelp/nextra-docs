import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

/**
 * App Router–compliant NextAuth configuration
 * Written in JSX style (same module semantics as your page.jsx)
 */

export const authOptions = {
  session: { strategy: "jwt" },

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
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

// Create the NextAuth request handler
const handler = NextAuth(authOptions);

// In App Router, export HTTP methods explicitly (no default export)
export async function GET(request, context) {
  return handler(request, context);
}

export async function POST(request, context) {
  return handler(request, context);
}
