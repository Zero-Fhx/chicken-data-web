import '@/styles/StatusBadge.css'

export function StatusBadge ({ status, activeLabel = 'Activo', inactiveLabel = 'Inactivo' }) {
  const isActive = status === 'Active'

  return (
    <span className={`badge-status ${isActive ? 'active' : 'inactive'}`}>
      {isActive ? activeLabel : inactiveLabel}
    </span>
  )
}
