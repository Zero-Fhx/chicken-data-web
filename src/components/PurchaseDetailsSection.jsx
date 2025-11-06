import trunc from '@/services/trunc'
import { useEffect, useState } from 'react'
import '../styles/RecipeSection.css'
import { AddIcon, TrashBinIcon } from './Icons'
import { InputWithLabel } from './InputWithLabel'
import { Loader } from './Loader'
import { RequiredSpan } from './RequiredSpan'

/**
 * Sección para gestionar los detalles de una compra (ingredientes, cantidades, precios).
 * * Permite agregar, editar y eliminar dinámicamente los ingredientes de una compra, mostrando un resumen y campos de edición para cada uno.
 *
 * @param {Object} props - Objeto de propiedades del componente.
 * @param {Array<Object>} props.details - Array con los detalles de la compra.
 * @param {function} props.onDetailsChange - Callback que se ejecuta cuando los detalles cambian.
 * @param {Array<Object>} props.availableIngredients - Lista de ingredientes disponibles para seleccionar.
 * @param {boolean} props.ingredientsLoading - Indica si la lista de ingredientes se está cargando.
 * @param {boolean} [props.detailsLoading=false] - Indica si los detalles de la compra se están cargando.
 * @param {boolean} [props.disabled=false] - Deshabilita la sección completa.
 *
 * @returns {React.ReactElement} El elemento JSX renderizado.
 */
export function PurchaseDetailsSection ({
  details,
  onDetailsChange,
  availableIngredients,
  ingredientsLoading,
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
      detail => !detail.ingredient_id || !detail.quantity || parseFloat(detail.quantity) <= 0 || !detail.unit_price || parseFloat(detail.unit_price) < 0
    )

    if (hasIncompleteDetail) {
      return
    }

    const newDetails = [
      ...details,
      {
        ingredient_id: '',
        ingredientName: '',
        unit: '',
        quantity: '',
        unit_price: '',
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

  const handleDetailChange = (newDetails) => {
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
          <h4>Ingredientes Comprados <RequiredSpan /></h4>
          <button
            type='button'
            className='btn-add-ingredient'
            onClick={handleAddDetail}
            disabled={disabled || ingredientsLoading}
          >
            <AddIcon width={16} height={16} />
            Agregar Ingrediente
          </button>
        </div>

        {ingredientsLoading && (
          <div className='recipe-loading'>
            <Loader width={32} height={32} />
          </div>
        )}

        {detailsLoading && !ingredientsLoading && (
          <div className='recipe-loading'>
            <Loader width={32} height={32} />
          </div>
        )}

        {!ingredientsLoading && !detailsLoading && details.length === 0 && (
          <div className='recipe-empty'>
            <span>No hay ingredientes agregados. Haz clic en "Agregar Ingrediente" para comenzar.</span>
          </div>
        )}

        {!ingredientsLoading && !detailsLoading && details.length > 0 && (
          <div className='recipe-ingredients-list'>
            {details.map((detail, index) => (
              <PurchaseDetailItem
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
                availableIngredients={availableIngredients}
                disabled={disabled}
                allDetails={details}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Componente para un item individual dentro de la PurchaseDetailsSection.
 * * Muestra un resumen del ingrediente y se expande para mostrar los campos de edición (selección de ingrediente, cantidad, precio).
 *
 * @param {Object} props - Objeto de propiedades del componente.
 * @param {Object} props.detail - Objeto con los datos del ingrediente.
 * @param {number} props.index - Índice del item en la lista.
 * @param {boolean} props.isExpanded - Controla si el item está expandido.
 * @param {boolean} props.isClosing - Indica si el item se está cerrando (para animación).
 * @param {function} props.onToggleExpand - Callback para cambiar el estado de expansión.
 * @param {function} props.onRemove - Callback para eliminar el item.
 * @param {function} props.onChange - Callback para manejar cambios en los campos del item.
 * @param {function} props.onFieldTouch - Callback para registrar que un campo ha sido "tocado".
 * @param {Object} props.touchedFields - Objeto que registra los campos que han sido tocados.
 * @param {Array<Object>} props.availableIngredients - Lista de ingredientes disponibles.
 * @param {boolean} props.disabled - Deshabilita los campos del item.
 * @param {Array<Object>} props.allDetails - Array completo de todos los detalles de la compra.
 *
 * @returns {React.ReactElement} El elemento JSX renderizado.
 */
function PurchaseDetailItem ({
  detail,
  index,
  isExpanded,
  isClosing,
  onToggleExpand,
  onRemove,
  onChange,
  onFieldTouch,
  touchedFields,
  availableIngredients,
  disabled,
  allDetails
}) {
  const hasValidData = detail.ingredientName && detail.quantity && detail.unit_price !== ''

  const summaryText = hasValidData
    ? (() => {
        const quantity = `${parseFloat(detail.quantity).toFixed(2)} ${detail.unit}`
        const price = `S/. ${parseFloat(detail.unit_price).toFixed(2)}`
        const subtotal = `S/. ${parseFloat(detail.subtotal).toFixed(2)}`
        return `${quantity} x ${price} = ${subtotal}`
      })()
    : null

  const isTouched = (field) => touchedFields[`${index}-${field}`] || false

  const handleFieldChange = (field, value) => {
    const newDetails = [...allDetails]

    if (field === 'ingredient_id') {
      const selectedIngredient = availableIngredients.find(i => i.id === parseInt(value))
      newDetails[index].ingredient_id = value
      if (selectedIngredient) {
        newDetails[index].ingredientName = selectedIngredient.name
        newDetails[index].unit = selectedIngredient.unit
      }
    } else if (field === 'quantity' || field === 'unit_price') {
      const formattedValue = value === '' ? '' : trunc(value, 2)
      newDetails[index][field] = formattedValue
    }

    const quantity = parseFloat(newDetails[index].quantity) || 0
    const unitPrice = parseFloat(newDetails[index].unit_price) || 0
    newDetails[index].subtotal = (quantity * unitPrice).toFixed(2)

    onChange(newDetails)
  }

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
            {hasValidData ? `${detail.ingredientName} (${detail.unit})` : 'Nuevo ingrediente - Configura los datos'}
          </span>
          {!isExpanded && summaryText && (
            <span className='recipe-ingredient-summary'>{summaryText}</span>
          )}
        </div>
        {!disabled && (
          <button
            type='button'
            className='recipe-ingredient-remove'
            onClick={(e) => {
              e.stopPropagation()
              onRemove(index)
            }}
            title='Eliminar ingrediente'
          >
            <TrashBinIcon width={20} height={20} />
          </button>
        )}
      </div>

      {isExpanded && (
        <div className={`recipe-ingredient-content ${isClosing ? 'closing' : ''}`}>
          <div className='recipe-ingredient-field'>
            <label htmlFor={`ingredient-select-${index}`}>
              Ingrediente <RequiredSpan />
            </label>
            <select
              id={`ingredient-select-${index}`}
              value={detail.ingredient_id || ''}
              onChange={(e) => handleFieldChange('ingredient_id', e.target.value)}
              onBlur={() => onFieldTouch(index, 'ingredient_id')}
              disabled={disabled}
              className={isTouched('ingredient_id') && !detail.ingredient_id ? 'input-error' : ''}
            >
              <option value=''>Seleccionar ingrediente</option>
              {availableIngredients.map((ingredient) => (
                <option key={ingredient.id} value={ingredient.id}>
                  {ingredient.name} ({ingredient.unit})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className='recipe-ingredient-field'>
              <label htmlFor={`ingredient-quantity-${index}`}>
                Cantidad <RequiredSpan />
              </label>
              <InputWithLabel
                label={detail.unit || ''}
                position='right'
                type='number'
                id={`ingredient-quantity-${index}`}
                value={detail.quantity || ''}
                onChange={(e) => handleFieldChange('quantity', e.target.value)}
                onBlur={() => onFieldTouch(index, 'quantity')}
                disabled={disabled}
                step='0.01'
                min='0.01'
                placeholder='0.00'
                className={isTouched('quantity') && (!detail.quantity || parseFloat(detail.quantity) <= 0) ? 'input-error' : ''}
              />
            </div>

            <div className='recipe-ingredient-field'>
              <label htmlFor={`ingredient-price-${index}`}>
                Precio Unitario <RequiredSpan />
              </label>
              <InputWithLabel
                label='S/.'
                position='left'
                type='number'
                id={`ingredient-price-${index}`}
                value={detail.unit_price || ''}
                onChange={(e) => handleFieldChange('unit_price', e.target.value)}
                onBlur={() => onFieldTouch(index, 'unit_price')}
                disabled={disabled}
                step='0.01'
                min='0.01'
                placeholder='0.00'
                className={isTouched('unit_price') && (!detail.unit_price || parseFloat(detail.unit_price) <= 0) ? 'input-error' : ''}
              />
            </div>
          </div>

          <div className='recipe-ingredient-field' style={{ background: '#f3f4f6', padding: '0.75rem', borderRadius: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '600' }}>Subtotal:</span>
              <span
                style={{
                  fontWeight: '600',
                  color: parseFloat(detail.subtotal) <= 0 && detail.ingredient_id && detail.quantity && detail.unit_price ? '#dc2626' : '#059669'
                }}
              >
                S/. {detail.subtotal || '0.00'}
              </span>
            </div>
            {parseFloat(detail.subtotal) <= 0 && detail.ingredient_id && detail.quantity && detail.unit_price && (
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
