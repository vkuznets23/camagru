import styles from '@/styles/Profile.module.css'

interface Props {
  name?: string
  bio?: string
}

export default function UserBio({ name, bio }: Props) {
  return (
    <>
      <h2>{name}</h2>
      <p className={styles.bio}>{bio}</p>
    </>
  )
}
