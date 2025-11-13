// fileName: AlertsFeed.jsx (REEMPLAZAR ARCHIVO COMPLETO)

import { CriticalIcon, WarningIcon } from '@/components/Icons'
import '@/styles/AlertsFeed.css'

// --- 1. AÑADIR UN ICONO DE 'INFO' ---
// (Lo definimos aquí mismo para simplicidad)
const InfoIcon = ({ width = 18, height = 18, color = '#007bff' }) => (
  <svg
    width={width}
    height={height}
    viewBox='0 0 24 24'
    fill='none'
    stroke={color}
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <circle cx='12' cy='12' r='10' />
    <line x1='12' y1='16' x2='12' y2='12' />
    <line x1='12' y1='8' x2='12.01' y2='8' />
  </svg>
)

export function AlertsFeed ({ loading, data }) {
  if (loading) return null

  // --- 2. LEER EL ARRAY 'info' DE LOS DATOS ---
  const { critical, warning, info } = data || {}

  const hasAlerts = (critical?.length > 0) || (warning?.length > 0) || (info?.length > 0)

  if (!hasAlerts) {
    return <p>No hay alertas activas.</p>
  }

  const splitAlertMessage = (message = '') => {
    // ... (esta función no cambia)
    if (!message) return { main: '', note: '' }
    const idx = message.indexOf('(')
    if (idx === -1) return { main: message.trim(), note: '' }
    const main = message.slice(0, idx).trim()
    const note = message.slice(idx + 1).replace(/\)$/, '').trim()
    return { main, note }
  }

  // --- 3. AÑADIR 'info' AL ARRAY TOTAL ---
  const allAlerts = [
    ...(critical || []),
    ...(warning || []),
    ...(info || [])
  ]

  return (
    <ul className='alerts-feed'>
      {allAlerts.map((alert) => {
        const { main, note } = splitAlertMessage(alert.message)
        return (
          <li
            key={alert.id}
            className={`alert-item ${alert.severity}`} // (critical, warning, o info)
          >
            <div className='alert-icon'>
              {/* --- 4. AÑADIR LÓGICA PARA EL ICONO 'info' --- */}
              {alert.severity === 'critical'
                ? <CriticalIcon width={18} height={18} color='#d63333' />
                : (alert.severity === 'warning'
                    ? <WarningIcon width={18} height={18} color='#f59e0b' />
                    : <InfoIcon />
                  )}
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
