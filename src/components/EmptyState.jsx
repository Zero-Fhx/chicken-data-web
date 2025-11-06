import '@/styles/EmptyState.css'

/**
 * Componente para mostrar un mensaje de estado vacío.
 * * Se utiliza cuando una lista o tabla no tiene datos para mostrar, proporcionando un feedback visual claro al usuario.
 *
 * @param {Object} props - Objeto de propiedades del componente.
 * @param {React.ComponentType} [props.icon] - Componente de ícono para mostrar sobre el mensaje.
 * @param {string} [props.message='No se encontraron resultados'] - El mensaje principal del estado vacío.
 * @param {string} [props.description=null] - Una descripción adicional opcional para dar más contexto.
 *
 * @returns {React.ReactElement} El elemento JSX renderizado.
 */
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
