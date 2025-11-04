import '@/styles/StatusBadge.css'

export function StatusBadge ({ status, activeLabel = 'Activo', inactiveLabel = 'Inactivo' }) {
  let badgeClass = 'inactive'

  if (status === 'Active') {
    badgeClass = 'active'
  } else if (status === 'Completed') {
    badgeClass = 'completed'
  } else if (status === 'Cancelled') {
    badgeClass = 'cancelled'
  }

  let label = inactiveLabel
  if (status === 'Active') {
    label = activeLabel
  } else if (status === 'Completed') {
    label = activeLabel
  } else if (status === 'Cancelled') {
    label = inactiveLabel
  }

  return (
    <span className={`badge-status ${badgeClass}`}>
      {label}
    </span>
  )
}
