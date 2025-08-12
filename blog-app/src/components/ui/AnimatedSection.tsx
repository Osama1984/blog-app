'use client'

import { useEffect, useState } from 'react'

interface AnimatedSectionProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function AnimatedSection({ children, delay = 0, className = '' }: AnimatedSectionProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={`opacity-0 ${className}`}>
        {children}
      </div>
    )
  }

  return (
    <div 
      className={className}
      style={{
        animation: `fadeInUp 0.8s ease-out ${delay}s forwards`,
        opacity: 0
      }}
    >
      {children}
    </div>
  )
}
