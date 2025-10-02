'use client'

import { usePathname } from 'next/navigation'
import React from 'react'
import Navbar from './Navbar'
import MobileNavbar from './NavbarMobile'
// import MobileTopbar from './MobileTopNavbar'

export default function NavbarWrapper() {
  const pathName = usePathname()
  const hideNavbar = [
    '/auth/signin',
    '/auth/forgot-password',
    '/auth/notification',
    '/auth/register',
    '/auth/reset-password',
    '/auth/verify-email',
    '/auth/verify-request',
    '/',
  ]
  if (pathName == null) return null
  const shouldHideNavbar = hideNavbar.includes(pathName)
  return (
    <div>
      {!shouldHideNavbar && <Navbar />}
      {/* {!shouldHideNavbar && <MobileTopbar />} */}
      {!shouldHideNavbar && <MobileNavbar />}
    </div>
  )
}
