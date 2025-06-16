import React, { Suspense } from 'react'
import ForgotPassword from '@/components/ForgotPassword'

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p>Loading reset password page...</p>}>
      <ForgotPassword />
    </Suspense>
  )
}
