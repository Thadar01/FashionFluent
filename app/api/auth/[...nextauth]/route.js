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
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        const { email, password, role } = credentials;
        console.log("Authorize called with", credentials);

        let user;
        
          
          if(role==='customer'){
            const [rows] = await db.query(
              "SELECT * FROM customers WHERE CustomerEmail = ? LIMIT 1",
              [email]
            );
            if (rows.length === 0) throw new Error("User not found");
            user = rows[0];
            if (password !== user.CustomerPasswords) throw new Error("Wrong Passwords");
          
  
          }else{
            const [rows] = await db.query(
              "SELECT * FROM staffs WHERE StaffEmail = ? AND StaffRole = ? LIMIT 1",
              [email, role]
            );
            if (rows.length === 0) throw new Error("User not found");
            user = rows[0];
            if (password !== user.StaffPasswords) throw new Error("Wrong Passwords");
          }
         
        return {
          id: user.CustomerID || user.StaffID,
          name: user.CustomerName || user.StaffName,
          email: user.CustomerEmail || user.StaffEmail,
          role: user.StaffRole ,
        };
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
