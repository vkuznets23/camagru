import React, { Suspense } from 'react'
import ForgotPassword from '@/components/registration/ForgotPassword'

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p>Loading reset password page...</p>}>
      <ForgotPassword />
    </Suspense>
  )
}
