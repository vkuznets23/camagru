import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/utils/prisma'
import { validateUsername } from '@/utils/formValidations'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' })

  if (!session?.user?.username)
    return res.status(401).json({ error: 'Unauthorized' })

  const { username } = req.body
  if (!username) return res.status(400).json({ error: 'Username is required' })

  const trimmedUsername = username.trim()
  const usernameError = validateUsername(trimmedUsername, null)
  if (usernameError) return res.status(400).json({ error: usernameError })

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username: trimmedUsername },
    })
    if (existingUser)
      return res.status(409).json({ error: 'Username already taken' })

    await prisma.user.update({
      where: { email: session.user.email },
      data: { username: trimmedUsername },
    })

    return res.status(200).json({ message: 'Username updated successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
