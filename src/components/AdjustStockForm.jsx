import { WarningIcon } from '@/components/Icons'
import { RequiredSpan } from '@/components/RequiredSpan'
import '@/styles/AdjustStockForm.css'

export function AdjustStockForm ({
  ingredientName,
  currentStock,
  unit,
  adjustmentType,
  adjustmentValue,
  onAdjustmentTypeChange,
  onAdjustmentValueChange,
  error
}) {
  const calculateResultingStock = () => {
    const current = parseFloat(currentStock) || 0
    const adjustment = parseFloat(adjustmentValue) || 0

    switch (adjustmentType) {
      case 'add':
        return current + adjustment
      case 'subtract':
        return current - adjustment
      case 'set':
        return adjustment
      default:
        return current
    }
  }

  const resultingStock = calculateResultingStock()
  const isNegative = resultingStock < 0

  const getAdjustmentIcon = () => {
    switch (adjustmentType) {
      case 'add':
        return '+'
      case 'subtract':
        return '−'
      case 'set':
        return '='
      default:
        return '+'
    }
  }

  const getAdjustmentLabel = () => {
    switch (adjustmentType) {
      case 'add':
        return 'Incrementar Stock'
      case 'subtract':
        return 'Decrementar Stock'
      case 'set':
        return 'Establecer Nuevo Stock'
      default:
        return 'Incrementar Stock'
    }
  }

  return (
    <div className='adjust-stock-form'>
      <div className='adjust-stock-header'>
        <div className='ingredient-info'>
          <span className='ingredient-label'>Ingrediente</span>
          <span className='ingredient-name'>{ingredientName}</span>
        </div>
      </div>

      <div className='adjust-stock-visual'>
        <div className='stock-card current-stock'>
          <div className='stock-label'>Stock Actual</div>
          <div className='stock-value'>
            <span className='stock-number'>{parseFloat(currentStock).toFixed(2)}</span>
            <span className='stock-unit'>{unit}</span>
          </div>
        </div>

        <div className={`adjustment-arrow ${adjustmentType === 'add' ? 'type-add' : adjustmentType === 'subtract' ? 'type-subtract' : 'type-set'}`}>
          <div className='arrow-icon'>{getAdjustmentIcon()}</div>
        </div>

        <div className={`stock-card resulting-stock ${isNegative ? 'negative' : ''} ${adjustmentType === 'add' ? 'type-add' : adjustmentType === 'subtract' ? 'type-subtract' : 'type-set'}`}>
          <div className='stock-label'>Stock Resultante</div>
          <div className='stock-value'>
            <span className='stock-number'>{resultingStock.toFixed(2)}</span>
            <span className='stock-unit'>{unit}</span>
          </div>
        </div>
      </div>

      {isNegative && (
        <div className='negative-stock-alert'>
          <WarningIcon />
          <span>Stock negativo no permitido</span>
        </div>
      )}

      <div className='adjust-stock-controls'>
        <div className='control-group'>
          <label htmlFor='adjustment-type'>
            Tipo de Ajuste <RequiredSpan />
          </label>
          <div className='adjustment-type-selector'>
            <button
              type='button'
              className={`type-button type-add ${adjustmentType === 'add' ? 'active' : ''}`}
              onClick={() => onAdjustmentTypeChange('add')}
            >
              <span className='type-icon'>+</span>
              <span className='type-label'>Incrementar</span>
            </button>
            <button
              type='button'
              className={`type-button type-subtract ${adjustmentType === 'subtract' ? 'active' : ''}`}
              onClick={() => onAdjustmentTypeChange('subtract')}
            >
              <span className='type-icon'>−</span>
              <span className='type-label'>Decrementar</span>
            </button>
            <button
              type='button'
              className={`type-button type-set ${adjustmentType === 'set' ? 'active' : ''}`}
              onClick={() => onAdjustmentTypeChange('set')}
            >
              <span className='type-icon'>=</span>
              <span className='type-label'>Establecer</span>
            </button>
          </div>
        </div>

        <div className='control-group'>
          <label htmlFor='adjustment-value'>
            {getAdjustmentLabel()} <RequiredSpan />
          </label>
          <div className='adjustment-input-wrapper'>
            <input
              type='number'
              id='adjustment-value'
              className={error ? 'error' : ''}
              placeholder='0.00'
              min='0'
              step='0.01'
              value={adjustmentValue}
              onChange={onAdjustmentValueChange}
            />
            <span className='input-unit'>{unit}</span>
          </div>
          {error && <small className='input-error-message'>{error}</small>}
        </div>
      </div>
    </div>
  )
}
