import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import trunc from '@/services/trunc'
import { useEffect, useState } from 'react'
import '../styles/RecipeSection.css'
import { AddIcon, TrashBinIcon } from './Icons'
import { InputWithLabel } from './InputWithLabel'
import { Loader } from './Loader'
import { RequiredSpan } from './RequiredSpan'

/**
 * Sección para gestionar los detalles de una venta (platillos, cantidades, precios, descuentos).
 * * Permite agregar, editar y eliminar dinámicamente los platillos de una venta.
 *
 * @param {Object} props - Objeto de propiedades del componente.
 * @param {Array<Object>} props.details - Array con los detalles de la venta.
 * @param {function} props.onDetailsChange - Callback que se ejecuta cuando los detalles cambian.
 * @param {Array<Object>} props.availableDishes - Lista de platillos disponibles para seleccionar.
 * @param {boolean} props.dishesLoading - Indica si la lista de platillos se está cargando.
 * @param {boolean} [props.detailsLoading=false] - Indica si los detalles de la venta se están cargando.
 * @param {boolean} [props.disabled=false] - Deshabilita la sección completa.
 *
 * @returns {React.ReactElement} El elemento JSX renderizado.
 */
export function SaleDetailsSection ({
  details,
  onDetailsChange,
  availableDishes,
  dishesLoading,
  detailsLoading = false,
  disabled = false
}) {
  const [expandedDetails, setExpandedDetails] = useState({})
  const [touchedFields, setTouchedFields] = useState({})
  const [closingDetails, setClosingDetails] = useState({})

  useEffect(() => {
    if (details.length > 0 && Object.keys(expandedDetails).length === 0) {
      const initialExpanded = {}
      details.forEach((_, index) => {
        initialExpanded[index] = true
      })
      setExpandedDetails(initialExpanded)
    }
  }, [details, expandedDetails])

  const handleToggleExpand = (index) => {
    if (expandedDetails[index]) {
      setClosingDetails(prev => ({ ...prev, [index]: true }))

      setTimeout(() => {
        setExpandedDetails(prev => ({
          ...prev,
          [index]: false
        }))
        setClosingDetails(prev => ({ ...prev, [index]: false }))
      }, 200)
    } else {
      setExpandedDetails(prev => ({
        ...prev,
        [index]: true
      }))
    }
  }

  const handleAddDetail = () => {
    const hasIncompleteDetail = details.some(
      detail => !detail.dish_id || !detail.quantity || parseFloat(detail.quantity) <= 0 || !detail.unit_price || parseFloat(detail.unit_price) < 0
    )

    if (hasIncompleteDetail) {
      return
    }

    const newDetails = [
      ...details,
      {
        dish_id: '',
        dishName: '',
        quantity: 1,
        unit_price: '',
        discount: 0,
        subtotal: '0.00'
      }
    ]
    onDetailsChange(newDetails)

    setExpandedDetails(prev => ({
      ...prev,
      [details.length]: true
    }))
  }

  const handleRemoveDetail = (index) => {
    const newDetails = details.filter((_, i) => i !== index)
    onDetailsChange(newDetails)

    const newExpanded = {}
    Object.keys(expandedDetails).forEach(key => {
      const keyIndex = parseInt(key)
      if (keyIndex < index) {
        newExpanded[keyIndex] = expandedDetails[keyIndex]
      } else if (keyIndex > index) {
        newExpanded[keyIndex - 1] = expandedDetails[keyIndex]
      }
    })
    setExpandedDetails(newExpanded)

    const newTouched = {}
    Object.keys(touchedFields).forEach(key => {
      const [touchedIndex, field] = key.split('-')
      const touchedIndexNum = parseInt(touchedIndex)
      if (touchedIndexNum < index) {
        newTouched[key] = touchedFields[key]
      } else if (touchedIndexNum > index) {
        newTouched[`${touchedIndexNum - 1}-${field}`] = touchedFields[key]
      }
    })
    setTouchedFields(newTouched)
  }

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...details]

    if (field === 'dish_id') {
      const selectedDish = availableDishes.find(d => d.id === parseInt(value))
      newDetails[index].dish_id = value
      if (selectedDish) {
        newDetails[index].unit_price = parseFloat(selectedDish.price).toFixed(2)
        newDetails[index].dishName = selectedDish.name
      }
    } else if (field === 'quantity') {
      const intValue = parseInt(value) || ''
      newDetails[index].quantity = intValue
    } else if (field === 'discount') {
      const formattedValue = value === '' ? '' : trunc(value, 2)
      newDetails[index][field] = formattedValue
    }

    const quantity = parseFloat(newDetails[index].quantity) || 0
    const unitPrice = parseFloat(newDetails[index].unit_price) || 0
    const discount = parseFloat(newDetails[index].discount) || 0
    newDetails[index].subtotal = ((quantity * unitPrice) - discount).toFixed(2)

    onDetailsChange(newDetails)
  }

  const handleFieldTouch = (index, field) => {
    setTouchedFields(prev => ({
      ...prev,
      [`${index}-${field}`]: true
    }))
  }

  return (
    <div className='recipe-section'>
      <div className='recipe-ingredients-container'>
        <div className='recipe-header'>
          <h4>Platillos Vendidos <RequiredSpan /></h4>
          <Button
            type='button'
            className='btn-add-ingredient'
            onClick={handleAddDetail}
            disabled={disabled || dishesLoading}
          >
            <AddIcon width={16} height={16} />
            Agregar Platillo
          </Button>
        </div>

        {dishesLoading && (
          <div className='recipe-loading'>
            <Loader width={32} height={32} />
          </div>
        )}

        {detailsLoading && !dishesLoading && (
          <div className='recipe-loading'>
            <Loader width={32} height={32} />
          </div>
        )}

        {!dishesLoading && !detailsLoading && details.length === 0 && (
          <div className='recipe-empty'>
            <span>No hay platillos agregados. Haz clic en "Agregar Platillo" para comenzar.</span>
          </div>
        )}

        {!dishesLoading && !detailsLoading && details.length > 0 && (
          <div className='recipe-ingredients-list'>
            {details.map((detail, index) => (
              <SaleDetailItem
                key={index}
                detail={detail}
                index={index}
                isExpanded={expandedDetails[index] || false}
                isClosing={closingDetails[index] || false}
                onToggleExpand={handleToggleExpand}
                onRemove={handleRemoveDetail}
                onChange={handleDetailChange}
                onFieldTouch={handleFieldTouch}
                touchedFields={touchedFields}
                availableDishes={availableDishes}
                disabled={disabled}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Componente para un item individual dentro de la SaleDetailsSection.
 * * Muestra un resumen del platillo y se expande para mostrar los campos de edición.
 *
 * @param {Object} props - Objeto de propiedades del componente.
 * @param {Object} props.detail - Objeto con los datos del platillo.
 * @param {number} props.index - Índice del item en la lista.
 * @param {boolean} props.isExpanded - Controla si el item está expandido.
 * @param {boolean} props.isClosing - Indica si el item se está cerrando (para animación).
 * @param {function} props.onToggleExpand - Callback para cambiar el estado de expansión.
 * @param {function} props.onRemove - Callback para eliminar el item.
 * @param {function} props.onChange - Callback para manejar cambios en los campos del item.
 * @param {function} props.onFieldTouch - Callback para registrar que un campo ha sido "tocado".
 * @param {Object} props.touchedFields - Objeto que registra los campos que han sido tocados.
 * @param {Array<Object>} props.availableDishes - Lista de platillos disponibles.
 * @param {boolean} props.disabled - Deshabilita los campos del item.
 *
 * @returns {React.ReactElement} El elemento JSX renderizado.
 */
function SaleDetailItem ({
  detail,
  index,
  isExpanded,
  isClosing,
  onToggleExpand,
  onRemove,
  onChange,
  onFieldTouch,
  touchedFields,
  availableDishes,
  disabled
}) {
  const hasValidData = detail.dishName && detail.quantity && detail.unit_price !== ''

  const summaryText = hasValidData
    ? (() => {
        const quantity = detail.quantity
        const price = `S/. ${parseFloat(detail.unit_price).toFixed(2)}`
        const discount = parseFloat(detail.discount) || 0
        const subtotal = `S/. ${parseFloat(detail.subtotal).toFixed(2)}`

        if (discount > 0) {
          return `${quantity} x ${price} - S/. ${discount.toFixed(2)} = ${subtotal}`
        } else {
          return `${quantity} x ${price} = ${subtotal}`
        }
      })()
    : null

  const isTouched = (field) => touchedFields[`${index}-${field}`] || false

  return (
    <div className='recipe-ingredient-item'>
      <div
        className='recipe-ingredient-header'
        onClick={() => onToggleExpand(index)}
      >
        <span className='recipe-ingredient-toggle'>
          {isExpanded ? '▼' : '▶'}
        </span>
        <div className='recipe-ingredient-title-wrapper'>
          <span className='recipe-ingredient-title'>
            {hasValidData ? detail.dishName : 'Nuevo platillo - Configura los datos'}
          </span>
          {!isExpanded && summaryText && (
            <span className='recipe-ingredient-summary'>{summaryText}</span>
          )}
        </div>
        {!disabled && (
          <Button
            type='button'
            className='recipe-ingredient-remove'
            onClick={(e) => {
              e.stopPropagation()
              onRemove(index)
            }}
            title='Eliminar platillo'
          >
            <TrashBinIcon width={20} height={20} />
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className={`recipe-ingredient-content ${isClosing ? 'closing' : ''}`}>
          <div className='recipe-ingredient-field'>
            <label htmlFor={`dish-select-${index}`}>
              Platillo <RequiredSpan />
            </label>
            <Select
              id={`dish-select-${index}`}
              value={String(detail.dish_id || '')}
              onChange={(val) => {
                onChange(index, 'dish_id', val)
                onFieldTouch(index, 'dish_id')
              }}
              disabled={disabled}
              className={isTouched('dish_id') && !detail.dish_id ? 'input-error' : ''}
              options={[{ label: 'Seleccionar platillo', value: '' }, ...availableDishes.map(d => ({ label: d.name, value: String(d.id) }))]}
            />
          </div>

          <div className='recipe-ingredient-field'>
            <label htmlFor={`dish-quantity-${index}`}>
              Cantidad <RequiredSpan />
            </label>
            <InputWithLabel
              label={!detail.quantity || detail.quantity === 1 ? 'unidad' : 'unidades'}
              position='right'
              type='number'
              id={`dish-quantity-${index}`}
              value={detail.quantity || ''}
              onChange={(e) => onChange(index, 'quantity', e.target.value)}
              onBlur={() => onFieldTouch(index, 'quantity')}
              disabled={disabled}
              step='1'
              min='1'
              placeholder='1'
              className={isTouched('quantity') && (!detail.quantity || parseFloat(detail.quantity) <= 0) ? 'input-error' : ''}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className='recipe-ingredient-field'>
              <label htmlFor={`dish-price-${index}`}>
                Precio Unitario <RequiredSpan />
              </label>
              <InputWithLabel
                label='S/.'
                position='left'
                type='text'
                id={`dish-price-${index}`}
                value={detail.unit_price || ''}
                onChange={(e) => onChange(index, 'unit_price', e.target.value)}
                onBlur={() => onFieldTouch(index, 'unit_price')}
                disabled
                readOnly
                step='0.01'
                min='0'
                placeholder='0.00'
                className={isTouched('unit_price') && (!detail.unit_price || parseFloat(detail.unit_price) < 0) ? 'input-error' : ''}
              />
            </div>

            <div className='recipe-ingredient-field'>
              <label htmlFor={`dish-discount-${index}`}>
                Descuento
              </label>
              <InputWithLabel
                label='S/.'
                position='left'
                type='number'
                id={`dish-discount-${index}`}
                value={detail.discount || ''}
                onChange={(e) => onChange(index, 'discount', e.target.value)}
                disabled={disabled}
                step='0.01'
                min='0'
                placeholder='0.00'
              />
            </div>
          </div>

          <div className='recipe-ingredient-field' style={{ background: '#f3f4f6', padding: '0.75rem', borderRadius: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '600' }}>Subtotal:</span>
              <span
                style={{
                  fontWeight: '600',
                  color: parseFloat(detail.subtotal) <= 0 && detail.dish_id && detail.quantity && detail.unit_price ? '#dc2626' : '#059669'
                }}
              >
                S/. {detail.subtotal || '0.00'}
              </span>
            </div>
            {parseFloat(detail.subtotal) <= 0 && detail.dish_id && detail.quantity && detail.unit_price && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#dc2626' }}>
                El subtotal debe ser mayor a 0
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
