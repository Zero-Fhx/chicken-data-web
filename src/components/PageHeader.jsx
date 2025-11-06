/**
 * Componente para el encabezado de una página.
 * * Muestra un título, una descripción opcional y un grupo de botones de acción.
 *
 * @param {Object} props - Objeto de propiedades del componente.
 * @param {string} props.title - El título principal de la página.
 * @param {string} [props.description] - Una descripción o subtítulo opcional.
 * @param {Array<{label: string, onClick: function, variant?: string, icon?: React.ReactNode, disabled?: boolean}>} [props.actions=[]] - Un array de objetos para definir los botones de acción.
 *
 * @returns {React.ReactElement} El elemento JSX renderizado.
 */
export function PageHeader ({ title, description, actions = [] }) {
  const handleActionClick = (actionOnClick) => {
    if (actionOnClick) {
      actionOnClick()
    }
  }

  return (
    <section>
      <div>
        <h1 className='title'>{title}</h1>
        {description && <p className='muted-text'>{description}</p>}
      </div>

      {actions.length > 0 && (
        <div className='button-group'>
          {actions.map((action, index) => (
            <button
              key={index}
              className={action.variant || 'primary'}
              onClick={() => handleActionClick(action.onClick)}
              disabled={action.disabled}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
