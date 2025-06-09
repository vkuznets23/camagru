import Image from 'next/image'
// import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <Image src="/instagram.png" alt="instagram" width={590} height={420} />
      <div>
        <h2>Are you already registered?</h2>
        {/* 
        <Link href="/auth/register">
          <button>sign up</button>
        </Link>
        <Link href="/auth/signin">
          <button>sign in</button>
        </Link> */}
      </div>
    </div>
  )
}
