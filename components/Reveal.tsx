'use client'

import { useEffect, useRef, ReactNode } from 'react'

type Props = {
  children: ReactNode
  delay?: 1 | 2 | 3 | 4
  className?: string
  style?: React.CSSProperties
}

export default function Reveal({ children, delay, className = '', style }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('reveal--visible')
          observer.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const delayClass = delay ? ` reveal--delay-${delay}` : ''

  return (
    <div
      ref={ref}
      className={`reveal${delayClass} ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  )
}
