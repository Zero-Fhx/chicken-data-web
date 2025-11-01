import { WarningIcon } from '@/components/Icons'

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
          <h4 style={{ color: 'rgb(220, 38, 38)', margin: '0 0 0.5rem 0' }}>
            {title}
          </h4>
          <p style={{ margin: 0, color: 'rgb(107, 114, 128)' }}>
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
