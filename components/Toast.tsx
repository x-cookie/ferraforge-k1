'use client'

import { createPortal } from 'react-dom'

type Props = {
  visible: boolean
  message?: string
}

export default function Toast({ visible, message = 'Copied to clipboard' }: Props) {
  if (!visible) return null
  return createPortal(
    <div className="toast-notification" role="status" aria-live="polite">
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="2,9 6,13 14,3" />
      </svg>
      {message}
    </div>,
    document.body
  )
}
