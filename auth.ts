import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [Google],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});
