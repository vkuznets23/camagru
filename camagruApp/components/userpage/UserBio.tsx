import styles from '@/styles/Profile.module.css'

interface Props {
  name?: string
  bio?: string
}

export default function UserBio({ name, bio }: Props) {
  return (
    <>
      <h3>{name}</h3>
      <p className={styles.bio}>{bio}</p>
    </>
  )
}
