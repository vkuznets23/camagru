'use client'

import { BiHide, BiShow } from 'react-icons/bi'

type ShowHideToggleProps = {
  show: boolean
  onToggle: () => void
  className?: string
}

export default function ShowHideToggle({
  show,
  onToggle,
  className = '',
}: ShowHideToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={className}
      aria-label={show ? 'Hide password' : 'Show password'}
    >
      {show ? <BiHide /> : <BiShow />}
    </button>
  )
}
