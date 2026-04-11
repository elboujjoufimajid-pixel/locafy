import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  logger: {
    error(code, metadata) {
      console.error("NEXTAUTH_ERROR:", code, JSON.stringify(metadata));
    },
    warn(code) {
      console.warn("NEXTAUTH_WARN:", code);
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
});

export { handler as GET, handler as POST };
