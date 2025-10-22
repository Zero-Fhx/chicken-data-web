import '@/styles/Card.css'

export function Card ({ children, className }) {
  const cardClass = className ? `card ${className}` : 'card'

  return (
    <div className={cardClass}>
      {children}
    </div>
  )
}

export function CardHeader ({ children, className }) {
  const headerClass = className ? `card-header ${className}` : 'card-header'

  return (
    <header className={headerClass}>
      {children}
    </header>
  )
}

export function CardBody ({ children, className }) {
  const bodyClass = className ? `card-body ${className}` : 'card-body'

  return (
    <div className={bodyClass}>
      {children}
    </div>
  )
}

export function CardFooter ({ children, className }) {
  const footerClass = className ? `card-footer ${className}` : 'card-footer'

  return (
    <footer className={footerClass}>
      {children}
    </footer>
  )
}
