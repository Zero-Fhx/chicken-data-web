import trunc from '@/services/trunc'
import { useEffect, useState } from 'react'
import '../styles/RecipeSection.css'
import { AddIcon, TrashBinIcon } from './Icons'
import { InputWithLabel } from './InputWithLabel'
import { RequiredSpan } from './RequiredSpan'

/**
 * Sección para gestionar una lista de detalles (items) con cantidad y precio.
 * * Se utiliza en formularios de compras o ventas para agregar, editar y eliminar productos o ingredientes, calculando subtotales y un total general.
 *
 * @param {Object} props - Objeto de propiedades del componente.
 * @param {Array<Object>} props.details - Array de objetos que representan los detalles (items) de la lista.
 * @param {function} props.onDetailsChange - Callback que se ejecuta cuando la lista de detalles cambia.
 * @param {Array<Object>} props.availableItems - Array de items disponibles para seleccionar en el dropdown.
 * @param {boolean} props.itemsLoading - Indica si los items disponibles se están cargando.
 * @param {boolean} [props.disabled=false] - Deshabilita toda la sección.
 * @param {string} [props.itemIdField='id'] - Nombre del campo de ID en los objetos de `availableItems`.
 * @param {string} [props.itemNameField='name'] - Nombre del campo de nombre en los objetos de `availableItems`.
 * @param {string} [props.itemUnitField='unit'] - Nombre del campo de unidad en los objetos de `availableItems`.
 * @param {string} [props.itemLabel='Item'] - Etiqueta para el item (ej: "Producto", "Ingrediente").
 * @param {string} [props.quantityLabel='Cantidad'] - Etiqueta para el campo de cantidad.
 * @param {string} [props.priceLabel='Precio Unitario'] - Etiqueta para el campo de precio.
 * @param {string} [props.currency='S/.'] - Símbolo de la moneda.
 *
 * @returns {React.ReactElement} El elemento JSX renderizado.
 */
export function DetailsSection ({
  details,
  onDetailsChange,
  availableItems,
  itemsLoading,
  disabled = false,
  itemIdField = 'id',
  itemNameField = 'name',
  itemUnitField = 'unit',
  itemLabel = 'Item',
  quantityLabel = 'Cantidad',
  priceLabel = 'Precio Unitario',
  currency = 'S/.'
}) {
  const [expandedDetails, setExpandedDetails] = useState({})

  useEffect(() => {
    if (details.length > 0 && Object.keys(expandedDetails).length === 0) {
      const initialExpanded = {}
      details.forEach((_, index) => {
        initialExpanded[index] = false
      })
      setExpandedDetails(initialExpanded)
    }
  }, [details, expandedDetails])

  const handleToggleExpand = (index) => {
    setExpandedDetails(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const handleAddDetail = () => {
    const hasIncompleteDetail = details.some(
      detail => !detail[itemIdField] || !detail.quantity || parseFloat(detail.quantity) <= 0 || !detail.unit_price || parseFloat(detail.unit_price) < 0
    )

    if (hasIncompleteDetail) {
      return
    }

    const newDetails = [
      ...details,
      {
        [itemIdField]: null,
        name: '',
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
  }

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...details]

    if (field === itemIdField) {
      const selectedItem = availableItems.find(item => item[itemIdField] === parseInt(value))
      newDetails[index] = {
        ...newDetails[index],
        [itemIdField]: selectedItem?.[itemIdField] || null,
        name: selectedItem?.[itemNameField] || '',
        unit: selectedItem?.[itemUnitField] || ''
      }
    } else if (field === 'quantity' || field === 'unit_price') {
      const formattedValue = value !== '' ? trunc(value, 2) : ''
      newDetails[index] = {
        ...newDetails[index],
        [field]: formattedValue
      }
    }

    const quantity = parseFloat(newDetails[index].quantity) || 0
    const unitPrice = parseFloat(newDetails[index].unit_price) || 0
    newDetails[index].subtotal = trunc(quantity * unitPrice, 2)

    onDetailsChange(newDetails)
  }

  const calculateTotal = () => {
    return details.reduce((sum, detail) => {
      const subtotal = parseFloat(detail.subtotal) || 0
      return sum + subtotal
    }, 0)
  }

  return (
    <div className='recipe-section'>
      <div className='recipe-ingredients-container'>
        <div className='recipe-header'>
          <h4>{itemLabel}s <RequiredSpan /></h4>
          <button
            type='button'
            className='btn-add-ingredient'
            onClick={handleAddDetail}
            disabled={disabled || itemsLoading}
          >
            <AddIcon width={16} height={16} />
            Agregar {itemLabel}
          </button>
        </div>

        {itemsLoading && (
          <div className='recipe-loading'>
            <span>Cargando {itemLabel.toLowerCase()}s...</span>
          </div>
        )}

        {!itemsLoading && details.length === 0 && (
          <div className='recipe-empty'>
            <span>No hay {itemLabel.toLowerCase()}s agregados. Haz clic en "Agregar {itemLabel}" para comenzar.</span>
          </div>
        )}

        {!itemsLoading && details.length > 0 && (
          <div className='recipe-ingredients-list'>
            {details.map((detail, index) => (
              <DetailItem
                key={index}
                detail={detail}
                index={index}
                isExpanded={expandedDetails[index] || false}
                onToggleExpand={handleToggleExpand}
                onRemove={handleRemoveDetail}
                onChange={handleDetailChange}
                availableItems={availableItems}
                disabled={disabled}
                itemIdField={itemIdField}
                itemNameField={itemNameField}
                itemUnitField={itemUnitField}
                itemLabel={itemLabel}
                quantityLabel={quantityLabel}
                priceLabel={priceLabel}
                currency={currency}
              />
            ))}
          </div>
        )}

        {!itemsLoading && details.length > 0 && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f3f4f6', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Total:</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#059669' }}>
                {currency} {calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Componente para un item individual dentro de la DetailsSection.
 * * Muestra un resumen del item y se expande para mostrar los campos de edición (selección de item, cantidad, precio).
 *
 * @param {Object} props - Objeto de propiedades del componente.
 * @param {Object} props.detail - Objeto con los datos del item.
 * @param {number} props.index - Índice del item en la lista.
 * @param {boolean} props.isExpanded - Controla si el item está expandido o colapsado.
 * @param {function} props.onToggleExpand - Callback para cambiar el estado de expansión.
 * @param {function} props.onRemove - Callback para eliminar el item.
 * @param {function} props.onChange - Callback para manejar cambios en los campos del item.
 * @param {Array<Object>} props.availableItems - Lista de items disponibles para seleccionar.
 * @param {boolean} props.disabled - Deshabilita los campos del item.
 * @param {string} props.itemIdField - Nombre del campo de ID.
 * @param {string} props.itemNameField - Nombre del campo de nombre.
 * @param {string} props.itemUnitField - Nombre del campo de unidad.
 * @param {string} props.itemLabel - Etiqueta para el item.
 * @param {string} props.quantityLabel - Etiqueta para la cantidad.
 * @param {string} props.priceLabel - Etiqueta para el precio.
 * @param {string} props.currency - Símbolo de la moneda.
 *
 * @returns {React.ReactElement} El elemento JSX renderizado.
 */
function DetailItem ({
  detail,
  index,
  isExpanded,
  onToggleExpand,
  onRemove,
  onChange,
  availableItems,
  disabled,
  itemIdField,
  itemNameField,
  itemUnitField,
  itemLabel,
  quantityLabel,
  priceLabel,
  currency
}) {
  const hasValidData = detail.name && detail.quantity && detail.unit_price

  const summaryText = hasValidData
    ? `${quantityLabel}: ${detail.quantity} ${detail.unit} | ${priceLabel}: ${currency} ${detail.unit_price} | Subtotal: ${currency} ${detail.subtotal}`
    : null

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
            {hasValidData ? `${detail.name} (${detail.unit})` : `Nuevo ${itemLabel.toLowerCase()} - Configura los datos`}
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
            title={`Eliminar ${itemLabel.toLowerCase()}`}
          >
            <TrashBinIcon width={20} height={20} />
          </button>
        )}
      </div>

      {isExpanded && (
        <div className='recipe-ingredient-content'>
          <div className='recipe-ingredient-field'>
            <label htmlFor={`detail-select-${index}`}>
              {itemLabel} <RequiredSpan />
            </label>
            <select
              id={`detail-select-${index}`}
              value={detail[itemIdField] || ''}
              onChange={(e) => onChange(index, itemIdField, e.target.value)}
              disabled={disabled}
              className={!detail[itemIdField] ? 'input-error' : ''}
            >
              <option value=''>Seleccionar {itemLabel.toLowerCase()}</option>
              {availableItems.map((item) => (
                <option key={item[itemIdField]} value={item[itemIdField]}>
                  {item[itemNameField]} {item[itemUnitField] && `(${item[itemUnitField]})`}
                </option>
              ))}
            </select>
          </div>

          <div className='recipe-ingredient-field'>
            <label htmlFor={`detail-quantity-${index}`}>
              {quantityLabel} <RequiredSpan />
            </label>
            <InputWithLabel
              label={detail.unit || ''}
              position='right'
              type='number'
              id={`detail-quantity-${index}`}
              value={detail.quantity || ''}
              onChange={(e) => onChange(index, 'quantity', e.target.value)}
              disabled={disabled}
              step='0.01'
              min='0.01'
              placeholder='0.00'
              className={!detail.quantity || parseFloat(detail.quantity) <= 0 ? 'input-error' : ''}
            />
          </div>

          <div className='recipe-ingredient-field'>
            <label htmlFor={`detail-price-${index}`}>
              {priceLabel} <RequiredSpan />
            </label>
            <InputWithLabel
              label={currency}
              position='left'
              type='number'
              id={`detail-price-${index}`}
              value={detail.unit_price || ''}
              onChange={(e) => onChange(index, 'unit_price', e.target.value)}
              disabled={disabled}
              step='0.01'
              min='0'
              placeholder='0.00'
              className={!detail.unit_price || parseFloat(detail.unit_price) < 0 ? 'input-error' : ''}
            />
          </div>

          <div className='recipe-ingredient-field' style={{ background: '#f3f4f6', padding: '0.75rem', borderRadius: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '600' }}>Subtotal:</span>
              <span style={{ fontWeight: '600', color: '#059669' }}>
                {currency} {detail.subtotal || '0.00'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
