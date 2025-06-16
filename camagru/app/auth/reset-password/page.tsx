import React, { Suspense } from 'react'
import ResetPassword from '@/components/ResetPassword'

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p>Loading reset password page...</p>}>
      <ResetPassword />
    </Suspense>
  )
}
