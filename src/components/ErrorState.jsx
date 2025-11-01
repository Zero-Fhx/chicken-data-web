import { RefreshIcon, WarningIcon } from '@/components/Icons'
import '@/styles/ErrorState.css'

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
