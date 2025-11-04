import trunc from '@/services/trunc'
import { useEffect, useState } from 'react'
import '../styles/RecipeSection.css'
import { AddIcon, TrashBinIcon } from './Icons'
import { InputWithLabel } from './InputWithLabel'
import { Loader } from './Loader'
import { RequiredSpan } from './RequiredSpan'
import { Separator } from './Separator'

export function RecipeSection ({
  ingredients,
  onIngredientsChange,
  availableIngredients,
  ingredientsLoading,
  mode = 'edit',
  disabled = false
}) {
  const [expandedIngredients, setExpandedIngredients] = useState({})
  const [touchedFields, setTouchedFields] = useState({})
  const [closingIngredients, setClosingIngredients] = useState({})

  useEffect(() => {
    if (ingredients.length > 0 && Object.keys(expandedIngredients).length === 0) {
      const initialExpanded = {}
      ingredients.forEach((_, index) => {
        initialExpanded[index] = false
      })
      setExpandedIngredients(initialExpanded)
    }
  }, [ingredients, expandedIngredients])

  useEffect(() => {
    if (ingredients.length === 0) {
      setTouchedFields({})
      setExpandedIngredients({})
      setClosingIngredients({})
    }
  }, [ingredients.length])

  const handleToggleExpand = (index) => {
    if (expandedIngredients[index]) {
      setClosingIngredients(prev => ({ ...prev, [index]: true }))

      setTimeout(() => {
        setExpandedIngredients(prev => ({
          ...prev,
          [index]: false
        }))
        setClosingIngredients(prev => ({ ...prev, [index]: false }))
      }, 200)
    } else {
      setExpandedIngredients(prev => ({
        ...prev,
        [index]: true
      }))
    }
  }

  const handleAddIngredient = () => {
    const hasIncompleteIngredient = ingredients.some(
      ing => !ing.ingredientId || !ing.quantityUsed || parseFloat(ing.quantityUsed) <= 0
    )

    if (hasIncompleteIngredient) {
      return
    }

    const newIngredients = [
      ...ingredients,
      {
        id: null,
        ingredientId: null,
        name: '',
        unit: '',
        quantityUsed: ''
      }
    ]
    onIngredientsChange(newIngredients)

    setExpandedIngredients(prev => ({
      ...prev,
      [ingredients.length]: true
    }))
  }

  const handleRemoveIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index)
    onIngredientsChange(newIngredients)

    const newExpanded = {}
    Object.keys(expandedIngredients).forEach(key => {
      const keyIndex = parseInt(key)
      if (keyIndex < index) {
        newExpanded[keyIndex] = expandedIngredients[keyIndex]
      } else if (keyIndex > index) {
        newExpanded[keyIndex - 1] = expandedIngredients[keyIndex]
      }
    })
    setExpandedIngredients(newExpanded)
  }

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients]

    if (field === 'ingredientId') {
      const selectedIngredient = availableIngredients.find(ing => ing.id === parseInt(value))
      newIngredients[index] = {
        ...newIngredients[index],
        ingredientId: selectedIngredient?.id || null,
        name: selectedIngredient?.name || '',
        unit: selectedIngredient?.unit || ''
      }
    } else if (field === 'quantityUsed') {
      const formattedValue = value !== '' ? trunc(value, 2) : ''
      newIngredients[index] = {
        ...newIngredients[index],
        quantityUsed: formattedValue
      }
    }

    onIngredientsChange(newIngredients)
  }

  const handleFieldBlur = (index, field) => {
    setTouchedFields(prev => ({
      ...prev,
      [`${index}-${field}`]: true
    }))
  }

  const isFieldTouched = (index, field) => {
    return touchedFields[`${index}-${field}`] || false
  }

  return (
    <div className='recipe-section'>
      <Separator />

      <div className='recipe-ingredients-container'>
        <div className='recipe-header'>
          <h4>Ingredientes de la Receta</h4>
          <button
            type='button'
            className='btn-add-ingredient'
            onClick={handleAddIngredient}
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

        {!ingredientsLoading && ingredients.length === 0 && (
          <div className='recipe-empty'>
            {mode === 'view'
              ? (
                <span>Este platillo no tiene receta asociada.</span>
                )
              : (
                <>
                  <span>Este platillo no tiene receta asociada. Haz clic en "Agregar Ingrediente" para comenzar.</span>
                  <span style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic' }}>
                    Si no agregas ingredientes, el platillo se guardará sin receta.
                  </span>
                </>
                )}
          </div>
        )}

        {!ingredientsLoading && ingredients.length > 0 && (
          <div className='recipe-ingredients-list'>
            {ingredients.map((ingredient, index) => (
              <RecipeIngredientItem
                key={index}
                ingredient={ingredient}
                index={index}
                isExpanded={expandedIngredients[index] || false}
                isClosing={closingIngredients[index] || false}
                onToggleExpand={handleToggleExpand}
                onRemove={handleRemoveIngredient}
                onChange={handleIngredientChange}
                onFieldBlur={handleFieldBlur}
                isFieldTouched={isFieldTouched}
                availableIngredients={availableIngredients}
                disabled={disabled}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function RecipeIngredientItem ({
  ingredient,
  index,
  isExpanded,
  isClosing,
  onToggleExpand,
  onRemove,
  onChange,
  onFieldBlur,
  isFieldTouched,
  availableIngredients,
  disabled
}) {
  const hasValidData = ingredient.name && ingredient.quantityUsed

  const summaryText = hasValidData
    ? `Cantidad: ${ingredient.quantityUsed} ${ingredient.unit}`
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
            {hasValidData ? `${ingredient.name} (${ingredient.unit})` : 'Nuevo ingrediente - Configura los datos'}
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
              value={ingredient.ingredientId || ''}
              onChange={(e) => onChange(index, 'ingredientId', e.target.value)}
              onBlur={() => onFieldBlur(index, 'ingredientId')}
              disabled={disabled}
              className={isFieldTouched(index, 'ingredientId') && !ingredient.ingredientId ? 'input-error' : ''}
            >
              <option value=''>Seleccionar ingrediente</option>
              {availableIngredients.map((availableIng) => (
                <option key={availableIng.id} value={availableIng.id}>
                  {availableIng.name} ({availableIng.unit})
                </option>
              ))}
            </select>
          </div>

          <div className='recipe-ingredient-field'>
            <label htmlFor={`ingredient-quantity-${index}`}>
              Cantidad por Porción <RequiredSpan />
            </label>
            <InputWithLabel
              label={ingredient.unit || ''}
              position='right'
              type='number'
              id={`ingredient-quantity-${index}`}
              value={ingredient.quantityUsed || ''}
              onChange={(e) => onChange(index, 'quantityUsed', e.target.value)}
              onBlur={() => onFieldBlur(index, 'quantityUsed')}
              disabled={disabled}
              step='1'
              min='0'
              placeholder='0.00'
              className={isFieldTouched(index, 'quantityUsed') && (!ingredient.quantityUsed || parseFloat(ingredient.quantityUsed) <= 0) ? 'input-error' : ''}
            />
          </div>
        </div>
      )}
    </div>
  )
}
