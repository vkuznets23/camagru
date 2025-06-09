import { prisma } from '@/utils/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { notFound, redirect } from 'next/navigation'

export default async function ProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({ where: { id: params.id } })

  if (!user) {
    notFound()
  }

  console.log(user)

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Profile</h1>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <p>User ID: {user.id}</p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
    </div>
  )
}
