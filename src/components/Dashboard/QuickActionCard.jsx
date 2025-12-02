import '@/styles/QuickActionCard.css'
import { useNavigate } from 'react-router'

export function QuickActionCard ({ icon, title, description, to = '/', onClick, className = '' }) {
  const navigate = useNavigate()

  const handleClick = (e) => {
    // Prevenir navegación nativa solo si es click normal (no ctrl/cmd+click, no click derecho)
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
      e.preventDefault()

      if (onClick) {
        onClick()
      } else if (to) {
        navigate(to)
      }
    }
    // Si tiene modificadores (ctrl, cmd, etc) o es click derecho, deja que el navegador maneje naturalmente
  }

  return (
    <a
      href={to}
      className={`quick-action-card ${className}`}
      onClick={handleClick}
    >
      <div className='quick-action-icon'>{icon}</div>
      <div className='quick-action-content'>
        <h3 className='quick-action-title'>{title}</h3>
        <p className='quick-action-description'>{description}</p>
      </div>
    </a>
  )
}
