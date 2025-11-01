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
