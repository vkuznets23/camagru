import { Suspense } from 'react'
import VerifyEmail from '@/components/registration/VerifyEmail'

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <VerifyEmail />
    </Suspense>
  )
}
