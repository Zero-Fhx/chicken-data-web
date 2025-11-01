import '@/styles/EmptyState.css'

export function EmptyState ({
  icon: Icon,
  message = 'No se encontraron resultados',
  description = null
}) {
  return (
    <div className='empty-state'>
      {Icon && (
        <div className='empty-state-icon'>
          <Icon width={48} height={48} />
        </div>
      )}
      <p className='empty-state-message'>
        {message}
      </p>
      {description && (
        <p className='empty-state-description'>
          {description}
        </p>
      )}
    </div>
  )
}
