// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

const handler =  NextAuth({
  providers: [
    CredentialsProvider({
        name: 'Credentials',
        credentials: {
          username: { label: "Username", type: "text", placeholder: "Enter Username" },
          password: { label: "Password", type: "password",placeholder: "Enter Password" }
        },
        async authorize(credentials, req) {
            const { username, password } = credentials as { username: string; password: string };

            // Hardcoded check (for demonstration only, not for production use)
            if (username === "john" && password === "12345") {
              return { id: "1", name: "John Doe", email: "john@example.com" }; 
            }
    
            return null;
        }
      })
    ,
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_PASSWORD!,
    }),
  ],
})

export { handler as GET, handler as POST }
