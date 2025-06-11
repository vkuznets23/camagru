import { prisma } from '@/utils/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { notFound, redirect } from 'next/navigation'
import Image from 'next/image'
import styles from '@/styles/Profile.module.css'

export default async function ProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
  })

  if (!user) {
    notFound()
  }

  console.log(user)

  return (
    <div className={styles.profileContainer}>
      <Image
        src={user.image || '/default_avatar.png'}
        alt={user.username}
        width={150}
        height={150}
        className={styles.avatar}
      />
      <div className={styles.profileInfo}>
        <h2>{user.username} </h2>
        {user.name && <p>{user.name}</p>}
        {user.bio && <p>{user.bio}</p>}
      </div>
    </div>
  )
}
