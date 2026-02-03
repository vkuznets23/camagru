import styles from '@/styles/Profile.module.css'

interface Props {
  name?: string
  bio?: string
}

export default function UserBio({ name, bio }: Props) {
  return (
    <>
      <h2 className={styles.nameBio}>{name}</h2>
      <p className={styles.bio}>{bio}</p>
    </>
  )
}
