import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      checks: ["state"],
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: true,
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
});

export { handler as GET, handler as POST };
