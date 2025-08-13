import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/utils/prisma'
import bcrypt from 'bcryptjs'
import { validatePassword } from '@/utils/formValidations'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)

  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' })

  if (!session?.user?.username)
    return res.status(401).json({ error: 'Unauthorized' })

  const { currentPassword, newPassword } = req.body
  if (!currentPassword || !newPassword)
    return res.status(400).json({ error: 'All fields are required' })

  const passwordError = validatePassword(newPassword)
  if (passwordError) return res.status(400).json({ error: passwordError })

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch)
      return res.status(400).json({ error: 'Current password is incorrect' })

    const hashedPassword = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: hashedPassword },
    })

    return res.status(200).json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
