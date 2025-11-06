import '@/styles/StatusBadge.css'

/**
 * Componente para mostrar una insignia de estado con colores.
 * * Se utiliza para representar visualmente estados como 'Activo', 'Inactivo', 'Completado' o 'Cancelado'.
 *
 * @param {Object} props - Objeto de propiedades del componente.
 * @param {'Active'|'Completed'|'Cancelled'|string} props.status - El estado a representar.
 * @param {string} [props.activeLabel='Activo'] - Etiqueta para los estados 'Active' y 'Completed'.
 * @param {string} [props.inactiveLabel='Inactivo'] - Etiqueta para el estado 'Cancelled' y otros.
 *
 * @returns {React.ReactElement} El elemento JSX renderizado.
 */
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
