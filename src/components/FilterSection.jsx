import { Card, CardBody, CardHeader } from '@/components/Card'
import { SearchIcon, TrashBinIcon } from '@/components/Icons'
import { InputWithLabel } from '@/components/InputWithLabel'

export function FilterSection ({
  title = 'Filtros',
  icon: Icon = SearchIcon,
  fields = [],
  values = {},
  errors = {},
  onFilterChange,
  onClearFilters,
  hasActiveFilters = false,
  clearButtonLabel = 'Limpiar Filtros'
}) {
  const handleChange = (e) => {
    if (onFilterChange) {
      onFilterChange(e)
    }
  }

  const handleClear = () => {
    if (onClearFilters) {
      onClearFilters()
    }
  }

  const renderField = (field) => {
    const {
      type = 'text',
      name,
      label,
      placeholder,
      options = [],
      disabled = false,
      min,
      max,
      step
    } = field

    const fieldId = `filter-${name}`
    const value = values[name] || ''
    const error = errors[name] || ''
    const hasError = !!error

    switch (type) {
      case 'select':
        return (
          <div key={name} className='filter-input'>
            <label htmlFor={fieldId}>{label}:</label>
            <select
              id={fieldId}
              name={name}
              value={value}
              onChange={handleChange}
              disabled={disabled}
            >
              <option value=''>{placeholder || `Seleccionar ${label}`}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )

      case 'number':
        if (name.toLowerCase().includes('price') || name.toLowerCase().includes('precio')) {
          return (
            <div key={name} className='filter-input'>
              <label htmlFor={fieldId}>{label}:</label>
              <InputWithLabel
                label='S/.'
                position='left'
                type='number'
                id={fieldId}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                disabled={disabled}
                min={min}
                max={max}
                step={step || '0.01'}
                className={hasError ? 'input-error' : ''}
              />
              {hasError && <small className='info-error'>{error}</small>}
            </div>
          )
        }

        return (
          <div key={name} className='filter-input'>
            <label htmlFor={fieldId}>{label}:</label>
            <input
              type='number'
              id={fieldId}
              name={name}
              placeholder={placeholder}
              value={value}
              onChange={handleChange}
              disabled={disabled}
              min={min}
              max={max}
              step={step}
              className={hasError ? 'input-error' : ''}
            />
            {hasError && <small className='info-error'>{error}</small>}
          </div>
        )

      case 'checkbox':
        return (
          <div key={name} className='filter-input filter-checkbox'>
            <label htmlFor={fieldId}>
              <input
                type='checkbox'
                id={fieldId}
                name={name}
                checked={values[name] || false}
                onChange={handleChange}
                disabled={disabled}
              />
              {label}
            </label>
          </div>
        )

      case 'text':
      default:
        return (
          <div key={name} className='filter-input'>
            <label htmlFor={fieldId}>{label}:</label>
            <input
              type='text'
              id={fieldId}
              name={name}
              placeholder={placeholder}
              value={value}
              onChange={handleChange}
              disabled={disabled}
            />
          </div>
        )
    }
  }

  return (
    <section>
      <Card>
        <CardHeader>
          <div className='header-with-icon'>
            <Icon />
            <h3>{title}</h3>
          </div>

          <button
            className='muted'
            onClick={handleClear}
            disabled={!hasActiveFilters}
          >
            <TrashBinIcon />
            {clearButtonLabel}
          </button>
        </CardHeader>

        <CardBody className='filter-form'>
          {fields.map((field) => renderField(field))}
        </CardBody>
      </Card>
    </section>
  )
}
