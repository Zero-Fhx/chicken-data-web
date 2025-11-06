import { RefreshIcon, WarningIcon } from '@/components/Icons'

import '@/styles/ErrorState.css'

/**
 * Componente para mostrar un mensaje de estado de error.
 * * Se utiliza para indicar que ha ocurrido un problema al cargar datos y opcionalmente ofrece un botón para reintentar la acción.
 *
 * @param {Object} props - Objeto de propiedades del componente.
 * @param {React.ComponentType} [props.icon=WarningIcon] - Componente de ícono para mostrar.
 * @param {string} [props.title='Error al cargar los datos'] - El título principal del mensaje de error.
 * @param {string} [props.message=''] - Un mensaje descriptivo opcional sobre el error.
 * @param {function} [props.onRetry=null] - Callback que se ejecuta al hacer clic en el botón de reintentar.
 * @param {string} [props.retryLabel='Reintentar'] - Etiqueta para el botón de reintentar.
 *
 * @returns {React.ReactElement} El elemento JSX renderizado.
 */
export function ErrorState ({
  icon: Icon = WarningIcon,
  title = 'Error al cargar los datos',
  message = '',
  onRetry = null,
  retryLabel = 'Reintentar'
}) {
  return (
    <div className='error-state'>
      <div className='error-state-icon'>
        <Icon width={48} height={48} color='rgb(220, 38, 38)' />
      </div>
      <strong className='error-state-title'>
        {title}
      </strong>
      {message && (
        <div className='error-state-message'>
          {message}
        </div>
      )}
      {onRetry && (
        <button
          className='outline-danger error-state-retry'
          onClick={onRetry}
        >
          <RefreshIcon />
          {retryLabel}
        </button>
      )}
    </div>
  )
}
