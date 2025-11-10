import { CriticalIcon, WarningIcon } from '@/components/Icons'
import '@/styles/AlertsFeed.css' // Importar estilos

export function AlertsFeed ({ loading, data }) {
  // El wrapper `DashboardCard` ya muestra Loader/ErrorState.
  // Aquí evitamos renderizar texto simple y delegamos esos estados al wrapper.
  if (loading) return null

  // La data de /alerts tiene 'critical' y 'warning'
  const { critical, warning } = data || {}

  const hasAlerts = (critical?.length > 0) || (warning?.length > 0)

  if (!hasAlerts) {
    return <p>No hay alertas activas.</p>
  }

  // Normaliza el mensaje de alerta: si contiene paréntesis como "(...)",
  // separamos en mensaje principal y nota secundaria para mostrar en líneas.
  const splitAlertMessage = (message = '') => {
    if (!message) return { main: '', note: '' }
    const idx = message.indexOf('(')
    if (idx === -1) return { main: message.trim(), note: '' }
    const main = message.slice(0, idx).trim()
    const note = message.slice(idx + 1).replace(/\)$/, '').trim()
    return { main, note }
  }

  // Combinamos y mostramos primero las críticas
  const allAlerts = [
    ...(critical || []),
    ...(warning || [])
  ]

  return (
    <ul className='alerts-feed'>
      {allAlerts.map((alert) => {
        const { main, note } = splitAlertMessage(alert.message)
        return (
          <li
            key={alert.id}
            // Asignamos clase CSS basada en la severidad
            className={`alert-item ${alert.severity}`}
          >
            <div className='alert-icon'>
              {alert.severity === 'critical'
                ? <CriticalIcon width={18} height={18} color='#d63333' />
                : <WarningIcon width={18} height={18} color='#f59e0b' />}
            </div>
            <div className='alert-content'>
              <span className='alert-title'>{alert.title}</span>
              {main ? <span className='alert-message'>{main}</span> : null}
              {note ? <span className='alert-message-sub'>{note}</span> : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
