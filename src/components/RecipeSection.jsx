import trunc from '@/services/trunc'
import { useEffect, useState } from 'react'
import '../styles/RecipeSection.css'
import { AddIcon, TrashBinIcon } from './Icons'
import { InputWithLabel } from './InputWithLabel'
import { RequiredSpan } from './RequiredSpan'
import { Separator } from './Separator'

export function RecipeSection ({
  hasRecipe,
  onRecipeToggle,
  ingredients,
  onIngredientsChange,
  availableIngredients,
  ingredientsLoading,
  disabled = false
}) {
  const [expandedIngredients, setExpandedIngredients] = useState({})

  useEffect(() => {
    if (ingredients.length > 0 && Object.keys(expandedIngredients).length === 0) {
      const initialExpanded = {}
      ingredients.forEach((_, index) => {
        initialExpanded[index] = false
      })
      setExpandedIngredients(initialExpanded)
    }
  }, [ingredients, expandedIngredients])

  const handleToggleExpand = (index) => {
    setExpandedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
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

  return (
    <div className='recipe-section'>
      <Separator />

      <div className='recipe-checkbox-container'>
        <label className='recipe-checkbox-label'>
          <input
            type='checkbox'
            checked={hasRecipe}
            onChange={(e) => onRecipeToggle(e.target.checked)}
            disabled={disabled || ingredientsLoading}
          />
          <span className='checkbox-text'>
            Tiene receta asociada
            {ingredientsLoading && <span className='loading-indicator'> (Cargando...)</span>}
          </span>
        </label>
        <small className='recipe-info-text'>
          Activa si este plato requiere ingredientes del inventario.
        </small>
      </div>

      {hasRecipe && (
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
              <span>Cargando ingredientes...</span>
            </div>
          )}

          {!ingredientsLoading && ingredients.length === 0 && (
            <div className='recipe-empty'>
              <span>No hay ingredientes en la receta. Haz clic en "Agregar Ingrediente" para comenzar.</span>
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
                  onToggleExpand={handleToggleExpand}
                  onRemove={handleRemoveIngredient}
                  onChange={handleIngredientChange}
                  availableIngredients={availableIngredients}
                  disabled={disabled}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function RecipeIngredientItem ({
  ingredient,
  index,
  isExpanded,
  onToggleExpand,
  onRemove,
  onChange,
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
        <div className='recipe-ingredient-content'>
          <div className='recipe-ingredient-field'>
            <label htmlFor={`ingredient-select-${index}`}>
              Ingrediente <RequiredSpan />
            </label>
            <select
              id={`ingredient-select-${index}`}
              value={ingredient.ingredientId || ''}
              onChange={(e) => onChange(index, 'ingredientId', e.target.value)}
              disabled={disabled}
              className={!ingredient.ingredientId ? 'input-error' : ''}
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
              disabled={disabled}
              step='0.01'
              min='0'
              placeholder='0.00'
              className={!ingredient.quantityUsed || parseFloat(ingredient.quantityUsed) <= 0 ? 'input-error' : ''}
            />
          </div>
        </div>
      )}
    </div>
  )
}
