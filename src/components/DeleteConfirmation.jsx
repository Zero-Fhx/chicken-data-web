import { WarningIcon } from '@/components/Icons'
import '@/styles/DeleteConfirmation.css'

export function DeleteConfirmation ({
  title = '¿Estás seguro de que deseas eliminar este elemento?',
  description = 'Esta acción no se puede deshacer. El elemento será eliminado permanentemente.',
  details = []
}) {
  return (
    <div className='delete-confirmation'>
      <div className='warning-message'>
        <WarningIcon width={48} height={48} color='rgb(220, 38, 38)' />
        <div>
          <h4 className='delete-confirmation-title'>
            {title}
          </h4>
          <p className='delete-confirmation-description'>
            {description}
          </p>
        </div>
      </div>

      <div className='dish-details'>
        {details.map((detail, index) => (
          <div key={index} className='detail-item'>
            <strong>{detail.label}:</strong> {detail.value}
          </div>
        ))}
      </div>
    </div>
  )
}
