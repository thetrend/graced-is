import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

function Card({ children, className }: Readonly<CardProps>) {
  return (
    <div className={`card bg-base-100 w-96 shadow-xl ${className}`}>
      <div className="card-body">{children}</div>
    </div>
  )
}

export default Card
