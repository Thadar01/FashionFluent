import db from "../../../../lib/db";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }, // Include role in the credentials
      },
      async authorize(credentials) {
        const { email, password, role } = credentials; // Destructure role from credentials
        console.log("Authorize called with", credentials); // Log the credentials received

        try {
          const [rows] = await db.query(
            'SELECT * FROM staff WHERE StaffEmail = ? AND StaffRole = ? LIMIT 1',
            [email, role] // Pass role in the query
          );

          if (rows.length === 0) {
            throw new Error("User not found");
          }

          const user = rows[0];

          if (password !== user.StaffPasswords) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user.StaffID,
            name: user.StaffName,
            email: user.StaffEmail,
            role: user.StaffRole,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          throw error
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
