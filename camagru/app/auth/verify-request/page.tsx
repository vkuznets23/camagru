import { Suspense } from 'react'
import VerifyRequest from '@/components/VerifyRequest'

export default function VerifyRequestPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <VerifyRequest />
    </Suspense>
  )
}
