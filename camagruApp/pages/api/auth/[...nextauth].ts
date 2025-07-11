import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/utils/prisma'
import bcrypt from 'bcryptjs'

type MyUser = {
  id: string
  username: string
  email: string
  name?: string | null
  image?: string | null
  bio?: string | null
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      username: string
      email: string
      name?: string | null
      image?: string | null
      bio?: string | null
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends MyUser {}
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        login: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<MyUser | null> {
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
          username: user.username,
          name: user.name,
          email: user.email,
          image: user.image,
          bio: user.bio,
        } as MyUser
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.email = user.email
        token.name = user.name as string | null
        token.image = user.image as string | null
        token.bio = user.bio as string | null
      }
      return token
    },
    async session({ session, token }) {
      if (token?.id) {
        const userFromDb = await prisma.user.findUnique({
          where: { id: token.id as string },
        })
        if (userFromDb && session.user) {
          session.user.id = userFromDb.id
          session.user.username = userFromDb.username
          session.user.email = userFromDb.email
          session.user.name = userFromDb.name
          session.user.bio = userFromDb.bio
          session.user.image = userFromDb.image
        }
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
}

export default NextAuth(authOptions)
