import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, username, password } = req.body

    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Missing fields' })
    }

    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!@#$%^&*]/.test(password)
    ) {
      return res.status(400).json({ error: 'Password too weak' })
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (existingUser) {
      const suggestions = []
      for (let i = 0; i < 5; i++) {
        const suggested = `${username}${Math.floor(Math.random() * 1000)}`
        const userExists = await prisma.user.findUnique({
          where: { username: suggested },
        })
        if (!userExists) suggestions.push(suggested)
      }
      return res
        .status(409)
        .json({ error: 'Email or username already taken', suggestions })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        emailVerified: null,
      },
    })

    // generate email token
    const token = randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    // save it in database
    await prisma.emailVerificationToken.create({
      data: {
        token,
        userId: user.id,
        expires,
      },
    })

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    })

    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify your email',
      html: `
        <p>Hello, ${username}!</p>
        <p>Please verify your email via this link:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>You can do it within 24 hours.</p>
      `,
    })

    return res.status(201).json({
      message: 'User created, verification email sent',
      userId: user.id,
    })
  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
