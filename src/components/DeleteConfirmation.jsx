import { WarningIcon } from '@/components/Icons'

import '@/styles/DeleteConfirmation.css'

/**
 * Componente que muestra un mensaje de confirmación antes de una eliminación.
 * * Presenta una advertencia clara y puede mostrar detalles adicionales o una tabla con información relacionada al elemento que se va a eliminar.
 *
 * @param {Object} props - Objeto de propiedades del componente.
 * @param {string} [props.title='¿Estás seguro de que deseas eliminar este elemento?'] - El título principal del mensaje de confirmación.
 * @param {string} [props.description='Esta acción no se puede deshacer. El elemento será eliminado permanentemente.'] - La descripción o advertencia secundaria.
 * @param {Array<{label: string, value: string}>} [props.details=[]] - Un array de objetos para mostrar detalles clave-valor sobre el elemento.
 * @param {React.ReactNode} [props.detailsTable=null] - Un componente de tabla opcional para mostrar información más compleja.
 *
 * @returns {React.ReactElement} El elemento JSX renderizado.
 */
export function DeleteConfirmation ({
  title = '¿Estás seguro de que deseas eliminar este elemento?',
  description = 'Esta acción no se puede deshacer. El elemento será eliminado permanentemente.',
  details = [],
  detailsTable = null
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

      {detailsTable && (
        <div className='details-table-container'>
          {detailsTable}
        </div>
      )}
    </div>
  )
}
