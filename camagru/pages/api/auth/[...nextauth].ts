import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/utils/prisma'
import bcrypt from 'bcryptjs'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }

  interface User {
    id: string
  }
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        login: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) return null

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: credentials.login }, { username: credentials.login }],
          },
        })

        if (!user) {
          throw new Error('User not found')
        }

        if (!user.emailVerified) {
          throw new Error('Please verify your email before logging in')
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )
        if (!isValid) {
          throw new Error('Invalid password')
        }

        return {
          id: user.id,
          name: user.username,
          email: user.email,
          image: user.image,
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
})
