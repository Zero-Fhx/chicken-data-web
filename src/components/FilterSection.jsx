import { Card, CardBody, CardHeader } from '@/components/Card'
import { SearchIcon, TrashBinIcon } from '@/components/Icons'
import { InputWithLabel } from '@/components/InputWithLabel'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

/**
 * Componente para renderizar una sección de filtros personalizable.
 * * Renderiza dinámicamente campos de formulario (inputs, selects, etc.) basados en una configuración y gestiona los cambios y la limpieza de los filtros.
 *
 * @param {Object} props - Objeto de propiedades del componente.
 * @param {string} [props.title='Filtros'] - Título de la sección de filtros.
 * @param {React.ComponentType} [props.icon=SearchIcon] - Componente de ícono para el título.
 * @param {Array<Object>} [props.fields=[]] - Array de objetos que definen cada campo del filtro.
 * @param {Object} [props.values={}] - Objeto con los valores actuales de los campos del filtro.
 * @param {Object} [props.errors={}] - Objeto con los mensajes de error para cada campo.
 * @param {function} props.onFilterChange - Callback que se ejecuta cuando el valor de un filtro cambia.
 * @param {function} props.onClearFilters - Callback que se ejecuta al hacer clic en el botón de limpiar.
 * @param {boolean} [props.hasActiveFilters=false] - Indica si hay algún filtro activo para habilitar el botón de limpiar.
 * @param {string} [props.clearButtonLabel='Limpiar Filtros'] - Etiqueta para el botón de limpiar filtros.
 *
 * @returns {React.ReactElement} El elemento JSX renderizado.
 */
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
      case 'select': {
        // Preparamos las opciones que vamos a pasar al Select.
        // Si el campo es de categoría (name === 'category' o label contiene 'categor')
        // transformamos la lista plana en un formato agrupado:
        //  - primer grupo (label: null) con el placeholder
        //  - segundo grupo 'Categorías' con las opciones reales
        const rawOptions = options || []
        let selectOptionsToPass

        const isCategoryField = name === 'category' || (String(label).toLowerCase().includes('categor'))

        if (rawOptions.length > 0 && rawOptions[0].items) {
          // Ya viene agrupado: lo pasamos tal cual
          selectOptionsToPass = rawOptions
        } else if (isCategoryField) {
          selectOptionsToPass = [
            { label: null, items: [{ label: placeholder || `Seleccionar ${label}`, value: '' }] },
            { label: 'Categorías', items: rawOptions.map(o => ({ label: o.label, value: String(o.value) })) }
          ]
        } else {
          // comportamiento por defecto: lista plana con placeholder como primer ítem
          selectOptionsToPass = [{ label: placeholder || `Seleccionar ${label}`, value: '' }, ...rawOptions.map(o => ({ label: o.label, value: String(o.value) }))]
        }

        return (
          <div key={name} className='filter-input'>
            <label htmlFor={fieldId}>{label}:</label>
            <Select
              className=''
              value={String(value)}
              placeholder={placeholder || `Seleccionar ${label}`}
              onChange={(val) => handleChange({ target: { name, value: val } })}
              disabled={disabled}
              options={selectOptionsToPass}
            />
          </div>
        )
      }

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
            <Input
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
              <Input
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

      case 'date':
        return (
          <div key={name} className='filter-input'>
            <label htmlFor={fieldId}>{label}:</label>
            <Input
              type='date'
              id={fieldId}
              name={name}
              value={value}
              onChange={handleChange}
              disabled={disabled}
            />
          </div>
        )

      case 'text':
      default:
        return (
          <div key={name} className='filter-input'>
            <label htmlFor={fieldId}>{label}:</label>
            <Input
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

          <Button
            className='muted'
            onClick={handleClear}
            disabled={!hasActiveFilters}
          >
            <TrashBinIcon />
            {clearButtonLabel}
          </Button>
        </CardHeader>

        <CardBody className='filter-form'>
          {fields.map((field) => renderField(field))}
        </CardBody>
      </Card>
    </section>
  )
}
