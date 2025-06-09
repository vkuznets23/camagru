import { prisma } from '@/utils/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { validatePassword } from '@/utils/formValidations'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' })

  const { token, password } = req.body

  if (!token || !password) {
    return res
      .status(400)
      .json({ error: 'Token and new password are required' })
  }

  const passwordError = validatePassword(password)
  if (passwordError) {
    return res.status(400).json({ error: passwordError })
  }

  try {
    // find user with resetToken and check that token is still valid
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })
    return res.status(200).json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Reset password error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
