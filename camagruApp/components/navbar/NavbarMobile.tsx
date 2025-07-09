import Link from 'next/link'
import { MdHomeFilled } from 'react-icons/md'
import { GrFormAdd } from 'react-icons/gr'
import Image from 'next/image'
import styles from '@/styles/MobileNavbar.module.css'
import { useSession } from 'next-auth/react'

export default function MobileNavbar() {
  const { data: session } = useSession()
  const id = session?.user.id

  return (
    <div>
      <nav
        id="navbarMobile"
        data-testid="navbarMobile"
        className={styles.mobileNavbar}
      >
        <div className={styles.navActions}>
          <Link href="/feed">
            <MdHomeFilled className={styles.feedBtn} />
          </Link>
          <Link href="/post/create">
            <GrFormAdd className={styles.addBtn} />
          </Link>
          <Link href={`/user/${id}`}>
            <Image
              src={session?.user?.image || '/default_avatar.png'}
              alt="Avatar"
              width={32}
              height={32}
              className={styles.avatar}
            />
          </Link>
        </div>
      </nav>
    </div>
  )
}
