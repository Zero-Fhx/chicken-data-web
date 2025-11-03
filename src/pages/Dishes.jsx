import { useEffect, useMemo, useRef, useState } from 'react'

import { useDebounce } from '@/hooks/useDebounce'
import { useFetch } from '@/hooks/useFetch'

import { Card, CardBody, CardFooter, CardHeader } from '@/components/Card'
import { DataTable } from '@/components/DataTable'
import { DeleteConfirmation } from '@/components/DeleteConfirmation'
import { ErrorModal } from '@/components/ErrorModal'
import { FilterSection } from '@/components/FilterSection'
import { AddIcon, CancelIcon, CheckIcon, CubeIcon, DownloadIcon, EditIcon, SearchIcon, TrashBinIcon, ViewIcon } from '@/components/Icons'
import { InputWithLabel } from '@/components/InputWithLabel'
import { Loader } from '@/components/Loader'
import { Modal } from '@/components/Modal'
import { PageHeader } from '@/components/PageHeader'
import { RecipeSection } from '@/components/RecipeSection'
import { RequiredSpan } from '@/components/RequiredSpan'
import { Separator } from '@/components/Separator'
import { StatusBadge } from '@/components/StatusBadge'
import { TestStatePanel } from '@/components/TestStatePanel'

import API_ENDPOINTS from '@/services/api'
import trunc from '@/services/trunc'

const API_URL = `${API_ENDPOINTS.dishes}/`
const API_CATEGORIES_URL = API_ENDPOINTS.dishCategories
const API_INGREDIENTS_URL = API_ENDPOINTS.ingredients

const initialFilters = {
  name: '',
  category: '',
  minPrice: '',
  maxPrice: '',
  status: ''
}

const statusOptions = [
  { value: 'Active', label: 'Activo' },
  { value: 'Inactive', label: 'Inactivo' }
]

const initialFormErrors = {
  name: '',
  category: '',
  price: '',
  status: '',
  ingredients: ''
}

export function Dishes () {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [filters, setFilters] = useState(initialFilters)
  const [filterErrors, setFilterErrors] = useState({ minPrice: '', maxPrice: '' })

  const [selectedDish, setSelectedDish] = useState(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('view')
  const [modalLoading, setModalLoading] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(null)
  const [modalError, setModalError] = useState(null)

  const [formErrors, setFormErrors] = useState(initialFormErrors)

  const errorModalRef = useRef(null)

  const [hasRecipe, setHasRecipe] = useState(false)
  const [recipeIngredients, setRecipeIngredients] = useState([])
  const [allIngredients, setAllIngredients] = useState([])
  const [ingredientsLoading, setIngredientsLoading] = useState(true)
  const [recipeLoading, setRecipeLoading] = useState(false)

  const { data: categoriesData, loading: categoriesLoading } = useFetch(API_CATEGORIES_URL)
  const categories = categoriesData?.data || []

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name
  }))

  const filterFields = [
    {
      type: 'text',
      name: 'name',
      label: 'Plato',
      placeholder: 'Buscar Plato'
    },
    {
      type: 'select',
      name: 'category',
      label: 'Categoría',
      placeholder: 'Todas las Categorías',
      options: categoryOptions,
      disabled: categoriesLoading
    },
    {
      type: 'number',
      name: 'minPrice',
      label: 'Precio Mínimo',
      placeholder: 'Precio Mínimo',
      min: 0
    },
    {
      type: 'number',
      name: 'maxPrice',
      label: 'Precio Máximo',
      placeholder: 'Precio Máximo',
      min: 0
    },
    {
      type: 'select',
      name: 'status',
      label: 'Estado',
      placeholder: 'Todos los Estados',
      options: statusOptions
    }
  ]

  const tableColumns = [
    {
      key: 'id',
      label: 'ID',
      align: 'center'
    },
    {
      key: 'name',
      label: 'Nombre',
      ellipsis: true
    },
    {
      key: 'description',
      label: 'Descripción',
      ellipsis: true
    },
    {
      key: 'category',
      label: 'Categoría',
      align: 'center',
      render: (row) => row.category.name
    },
    {
      key: 'price',
      label: 'Precio',
      align: 'center',
      render: (row) => (
        <div className='price-cell'>
          <span>S/. {row.price.toFixed(2)}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Estado',
      align: 'center',
      render: (row) => <StatusBadge status={row.status} />
    }
  ]

  const tableActions = [
    {
      label: 'Ver',
      icon: <ViewIcon />,
      variant: 'view',
      iconOnly: true,
      onClick: (row) => handleDishSelect(row, 'view')
    },
    {
      label: 'Editar',
      icon: <EditIcon />,
      variant: 'edit',
      iconOnly: true,
      onClick: (row) => handleDishSelect(row, 'edit')
    },
    {
      label: 'Eliminar',
      icon: <TrashBinIcon />,
      variant: 'delete',
      iconOnly: true,
      onClick: (row) => handleDishSelect(row, 'delete')
    }
  ]

  const debouncedName = useDebounce(filters.name, 500)
  const debouncedMinPrice = useDebounce(filters.minPrice, 500)
  const debouncedMaxPrice = useDebounce(filters.maxPrice, 500)

  const handleFilterChange = (e) => {
    const { name, value } = e.target

    let finalValue = value

    if ((name === 'minPrice' || name === 'maxPrice') && value !== '') {
      const formattedValue = trunc(value, 2)
      finalValue = formattedValue
    }

    const newFilters = { ...filters, [name]: finalValue }
    setFilters(newFilters)

    if (name === 'minPrice' || name === 'maxPrice') {
      const minPrice = parseFloat(name === 'minPrice' ? finalValue : newFilters.minPrice)
      const maxPrice = parseFloat(name === 'maxPrice' ? finalValue : newFilters.maxPrice)

      if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice > maxPrice) {
        if (name === 'minPrice') {
          setFilterErrors({ minPrice: 'El precio mínimo no puede ser mayor al máximo', maxPrice: '' })
        } else {
          setFilterErrors({ minPrice: '', maxPrice: 'El precio máximo no puede ser menor al mínimo' })
        }
      } else {
        setFilterErrors({ minPrice: '', maxPrice: '' })
      }
    }
  }

  const handleClearFilters = () => {
    setFilters(initialFilters)
    setFilterErrors({ minPrice: '', maxPrice: '' })
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== '')

  const buildURL = useMemo(() => {
    const url = new URL(API_URL)
    url.searchParams.set('page', page)
    url.searchParams.set('pageSize', pageSize)

    if (debouncedName) url.searchParams.set('search', debouncedName.trim().toLowerCase())
    if (debouncedMinPrice && !filterErrors.minPrice) url.searchParams.set('minPrice', debouncedMinPrice)
    if (debouncedMaxPrice && !filterErrors.maxPrice) url.searchParams.set('maxPrice', debouncedMaxPrice)

    if (filters.category) url.searchParams.set('categoryId', filters.category)
    if (filters.status) url.searchParams.set('status', filters.status)

    return url.toString()
  }, [page, pageSize, debouncedName, debouncedMinPrice, debouncedMaxPrice, filters.category, filters.status, filterErrors])

  const { data, loading, setLoading, error, setError, refetch } = useFetch(
    buildURL
  )

  const { data: dishes, meta } = data || {}

  useEffect(() => {
    const fetchAllIngredients = async () => {
      try {
        setIngredientsLoading(true)
        let allFetchedIngredients = []
        let currentPage = 1
        let hasNextPage = true

        while (hasNextPage) {
          const response = await fetch(`${API_INGREDIENTS_URL}?page=${currentPage}&pageSize=100`)
          const result = await response.json()

          if (result.success && result.data) {
            allFetchedIngredients = [...allFetchedIngredients, ...result.data]
            hasNextPage = result.meta?.pagination?.hasNextPage || false
            currentPage++
          } else {
            break
          }
        }

        allFetchedIngredients.sort((a, b) => a.name.localeCompare(b.name))
        setAllIngredients(allFetchedIngredients)
      } catch (error) {
        console.error('Error fetching ingredients:', error)
      } finally {
        setIngredientsLoading(false)
      }
    }

    fetchAllIngredients()
  }, [])

  useEffect(() => {
    if (error && error.status === 400 && page > 1) {
      setError(null)
      setPage(1)
    }
  }, [error, page, setError])

  useEffect(() => {
    if (modalError && errorModalRef.current) {
      errorModalRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }, [modalError])

  const handleChange = (e) => {
    const { name, value } = e.target
    setSelectedDish((prev) => ({ ...prev, [name]: value }))

    if (modalMode === 'edit' || modalMode === 'create') {
      if (name === 'name') {
        if (value.trim() === '') {
          setFormErrors((prev) => ({ ...prev, name: 'El nombre es obligatorio' }))
          return
        } else {
          setFormErrors((prev) => ({ ...prev, name: '' }))
        }
      }

      if (name === 'price') {
        const formattedValue = trunc(value, 2)
        const priceValue = parseFloat(formattedValue)

        setSelectedDish((prev) => ({ ...prev, price: isNaN(priceValue) ? '' : formattedValue }))

        if (isNaN(priceValue) || priceValue <= 0) {
          setFormErrors((prev) => ({ ...prev, price: 'El precio debe ser mayor a 0' }))
          return
        } else {
          setFormErrors((prev) => ({ ...prev, price: '' }))
        }
      }

      if (name === 'category') {
        const selectedCategory = categories.find(cat => cat.id === parseInt(value))
        setSelectedDish((prev) => ({ ...prev, category: selectedCategory || null }))
        if (!selectedCategory) {
          setFormErrors((prev) => ({ ...prev, category: 'La categoría es obligatoria' }))
          return
        } else {
          setFormErrors((prev) => ({ ...prev, category: '' }))
        }
      }

      if (name === 'status') {
        if (value === '') {
          setFormErrors((prev) => ({ ...prev, status: 'El estado es obligatorio' }))
        } else {
          setFormErrors((prev) => ({ ...prev, status: '' }))
        }
      }
    }
  }

  const handleDishSelect = (dish, mode) => {
    setSelectedDish(dish)
    setModalMode(mode)
    setIsModalOpen(true)

    if (mode === 'view' || mode === 'edit') {
      fetchDishRecipe(dish.id)
    } else {
      setHasRecipe(false)
      setRecipeIngredients([])
    }
  }

  const fetchDishRecipe = async (dishId) => {
    try {
      setRecipeLoading(true)
      const response = await fetch(`${API_URL}${dishId}/recipe`)
      const result = await response.json()

      if (result.success && result.data && result.data.length > 0) {
        const formattedIngredients = result.data.map((item) => ({
          id: item.id,
          ingredientId: item.ingredient.id,
          name: item.ingredient.name,
          unit: item.ingredient.unit,
          quantityUsed: trunc(item.quantityUsed.toString(), 2)
        }))
        setRecipeIngredients(formattedIngredients)
        setHasRecipe(true)
      } else {
        setRecipeIngredients([])
        setHasRecipe(false)
      }
    } catch (error) {
      console.error('Error fetching dish recipe:', error)
      setRecipeIngredients([])
      setHasRecipe(false)
    } finally {
      setRecipeLoading(false)
    }
  }

  const handleCreateNew = () => {
    setSelectedDish({
      name: '',
      description: '',
      category: null,
      price: '',
      status: 'Active'
    })
    setModalMode('create')
    setIsModalOpen(true)
    setHasRecipe(false)
    setRecipeIngredients([])
  }

  const handleExport = () => {
    console.log('Exportando datos de platos...')
  }

  const handleCloseWithX = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleCloseError = () => {
    setModalError(null)
  }

  const handleRecipeToggle = (checked) => {
    setHasRecipe(checked)
    if (!checked) {
      setRecipeIngredients([])
      setFormErrors(prev => ({ ...prev, ingredients: '' }))
    }
  }

  const handleRecipeIngredientsChange = (newIngredients) => {
    setRecipeIngredients(newIngredients)

    setFormErrors(prev => ({ ...prev, ingredients: '' }))
  }

  const validateRecipeIngredients = (ingredients) => {
    if (!hasRecipe) {
      setFormErrors(prev => ({ ...prev, ingredients: '' }))
      return true
    }

    const validIngredients = ingredients.filter(
      ing => ing.ingredientId && ing.quantityUsed && parseFloat(ing.quantityUsed) > 0
    )

    if (validIngredients.length === 0) {
      setFormErrors(prev => ({
        ...prev,
        ingredients: 'Debes agregar al menos un ingrediente válido con cantidad mayor a 0'
      }))
      return false
    }

    const hasIncompleteIngredients = ingredients.some(
      ing => (ing.ingredientId || ing.quantityUsed) &&
             (!ing.ingredientId || !ing.quantityUsed || parseFloat(ing.quantityUsed) <= 0)
    )

    if (hasIncompleteIngredients) {
      setFormErrors(prev => ({
        ...prev,
        ingredients: 'Todos los ingredientes deben tener datos completos (ingrediente seleccionado y cantidad mayor a 0)'
      }))
      return false
    }

    const ingredientIds = validIngredients.map(ing => ing.ingredientId)
    const hasDuplicates = ingredientIds.length !== new Set(ingredientIds).size

    if (hasDuplicates) {
      setFormErrors(prev => ({
        ...prev,
        ingredients: 'No puedes agregar el mismo ingrediente más de una vez'
      }))
      return false
    }

    setFormErrors(prev => ({ ...prev, ingredients: '' }))
    return true
  }

  const handleSave = async () => {
    setModalLoading(true)

    if (hasRecipe && !validateRecipeIngredients(recipeIngredients)) {
      setModalLoading(false)
      return
    }

    const dishData = {
      name: selectedDish.name,
      description: selectedDish.description || null,
      categoryId: selectedDish.category?.id || null,
      price: parseFloat(selectedDish.price),
      status: selectedDish.status
    }

    const url = modalMode === 'create' ? API_URL : `${API_URL}${selectedDish.id}`
    const method = modalMode === 'create' ? 'POST' : 'PATCH'

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dishData)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al ${modalMode === 'create' ? 'crear' : 'actualizar'} el plato`)
        }
        return response.json()
      })
      .then(async (result) => {
        const dishId = result.data?.id || selectedDish.id

        if (hasRecipe) {
          const ingredientsPayload = {
            ingredients: recipeIngredients
              .filter(ing => ing.ingredientId && ing.quantityUsed && parseFloat(ing.quantityUsed) > 0)
              .map(ing => ({
                ingredient_id: ing.ingredientId,
                quantity_used: parseFloat(ing.quantityUsed)
              }))
          }

          const recipeResponse = await fetch(`${API_URL}${dishId}/recipe`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(ingredientsPayload)
          })

          if (!recipeResponse.ok) {
            throw new Error('Error al guardar la receta del plato')
          }
        } else {
          await fetch(`${API_URL}${dishId}/recipe`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ingredients: [] })
          })
        }

        refetch()
        setModalSuccess(modalMode === 'create' ? 'create' : 'save')
        setTimeout(() => {
          setIsModalOpen(false)
        }, 1500)
      })
      .catch((error) => {
        console.error('Error:', error)
        setModalLoading(false)
        setModalError(`Error al ${modalMode === 'create' ? 'crear' : 'actualizar'} el plato: ${error.message}`)
      })
  }

  const handleDelete = () => {
    setModalLoading(true)

    const dishId = selectedDish.id

    fetch(`${API_URL}${dishId}`, {
      method: 'DELETE'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al eliminar el plato')
        }
        return response.json()
      })
      .then(() => {
        refetch()
        setModalSuccess('delete')
        setTimeout(() => {
          setIsModalOpen(false)
        }, 200)
      })
      .catch((error) => {
        console.error('Error:', error)
        setModalLoading(false)
        setModalError(`Error al eliminar el plato: ${error.message}`)
      })
  }

  const handleAnimationEnd = () => {
    setSelectedDish(null)
    setFormErrors(initialFormErrors)
    setModalLoading(false)
    setModalSuccess(null)
    setModalError(null)
    setHasRecipe(false)
    setRecipeIngredients([])
    setRecipeLoading(false)
  }

  return (
    <>
      <TestStatePanel
        loading={loading}
        setLoading={setLoading}
        error={error}
        setError={setError}
      />

      <Separator />

      <PageHeader
        title='Gestión de Platos'
        description='Administra tu catalogo de platos aquí.'
        actions={[
          {
            label: 'Agregar Plato',
            icon: <AddIcon />,
            variant: 'primary',
            onClick: handleCreateNew
          },
          {
            label: 'Exportar Datos',
            icon: <DownloadIcon />,
            variant: 'secondary',
            onClick: handleExport
          }
        ]}
      />

      <Separator />

      <FilterSection
        title='Filtrar Platos'
        icon={SearchIcon}
        fields={filterFields}
        values={filters}
        errors={filterErrors}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <Separator />

      <section>
        <DataTable
          title='Lista de Platos'
          icon={CubeIcon}
          columns={tableColumns}
          data={dishes}
          loading={loading}
          error={error}
          meta={meta}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setPage(1)
          }}
          onRefresh={refetch}
          pageSizeOptions={[5, 10, 20, 50]}
          refreshLabel='Recargar Platos'
          itemName='plato'
          itemNamePlural='platos'
          emptyIcon={CubeIcon}
          emptyMessage='No se encontraron platos'
          emptyDescription='Intenta ajustar los filtros o crear un nuevo plato'
          actions={tableActions}
        />
      </section>

      <Modal
        isOpen={isModalOpen}
        onAnimationEnd={handleAnimationEnd}
      >
        <form action=''>
          <Card>
            <CardHeader>
              <div className='header-with-icon'>
                {modalMode === 'view' && <ViewIcon />}
                {modalMode === 'edit' && <EditIcon />}
                {modalMode === 'delete' && <TrashBinIcon />}
                {modalMode === 'create' && <AddIcon />}
                <h3>
                  {modalMode === 'view' && 'Ver Plato'}
                  {modalMode === 'edit' && 'Editar Plato'}
                  {modalMode === 'delete' && 'Eliminar Plato'}
                  {modalMode === 'create' && 'Crear Plato'}
                </h3>
              </div>
              <button type='button' className='modal-close-button no-transform' onClick={handleCloseWithX}>
                <CancelIcon />
              </button>
            </CardHeader>
            <CardBody className='modal-body'>
              {modalLoading && (
                <div className='modal-loading-overlay'>
                  {modalSuccess
                    ? (
                      <div className='modal-success-overlay'>
                        <CheckIcon width={40} height={40} color='#059669' />
                        {modalSuccess === 'save' && <span>¡Cambios guardados exitosamente!</span>}
                        {modalSuccess === 'delete' && <span>¡Eliminación exitosa!</span>}
                        {modalSuccess === 'create' && <span>¡Plato creado exitosamente!</span>}
                      </div>
                      )
                    : (
                      <Loader
                        width={32}
                        height={32}
                        text={
                          modalMode === 'delete'
                            ? 'Eliminando...'
                            : modalMode === 'create'
                              ? 'Creando plato...'
                              : 'Guardando cambios...'
                        }
                      />
                      )}
                </div>
              )}
              {modalError && (
                <div ref={errorModalRef}>
                  <ErrorModal message={modalError} onClose={handleCloseError} />
                </div>
              )}
              {modalMode === 'delete' && (
                <DeleteConfirmation
                  title='¿Estás seguro de que deseas eliminar este plato?'
                  description='Esta acción no se puede deshacer. El plato será eliminado permanentemente.'
                  details={[
                    { label: 'Nombre', value: selectedDish?.name },
                    { label: 'Categoría', value: selectedDish?.category?.name },
                    { label: 'Precio', value: `S/. ${selectedDish?.price}` },
                    { label: 'Estado', value: selectedDish?.status === 'Active' ? 'Activo' : 'Inactivo' }
                  ]}
                />
              )}
              {(modalMode === 'view' || modalMode === 'edit' || modalMode === 'create') && (

                <div className='modal-input-group'>
                  <div className='input-group'>
                    <label htmlFor='modal-name'>Nombre <RequiredSpan /></label>
                    <input
                      className={formErrors.name ? 'input-error' : ''}
                      type='text'
                      id='modal-name'
                      name='name'
                      value={selectedDish?.name || ''}
                      disabled={modalMode === 'view' || modalLoading}
                      onChange={handleChange}
                    />
                    <small className='info-error'>{formErrors.name}</small>
                  </div>
                  <div className='input-group'>
                    <label htmlFor='modal-description'>Descripción</label>
                    <textarea
                      className={formErrors.description ? 'input-error' : ''}
                      id='modal-description'
                      name='description'
                      value={selectedDish?.description || ''}
                      disabled={modalMode === 'view' || modalLoading}
                      onChange={handleChange}
                    />
                    <small className='info-error'>{formErrors.description}</small>
                  </div>
                  <div className='input-group'>
                    <label htmlFor='modal-category'>Categoría <RequiredSpan /></label>
                    <select
                      className={formErrors.category ? 'input-error' : ''}
                      name='category'
                      id='modal-category'
                      disabled={modalMode === 'view' || modalLoading}
                      value={selectedDish?.category?.id || ''}
                      onChange={handleChange}
                    >
                      <option value=''>Seleccionar categoría</option>
                      {categoryOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <small className='info-error'>{formErrors.category}</small>
                  </div>
                  <div className='input-group'>
                    <label htmlFor='modal-price'>Precio <RequiredSpan /></label>
                    <InputWithLabel
                      label='S/.'
                      position='left'
                      className={formErrors.price ? 'input-error' : ''}
                      type='number'
                      id='modal-price'
                      name='price'
                      value={selectedDish?.price || ''}
                      disabled={modalMode === 'view' || modalLoading}
                      onChange={handleChange}
                      min='0'
                      step='1'
                    />
                    <small className='info-error'>{formErrors.price}</small>
                  </div>
                  <div className='input-group'>
                    <label htmlFor='modal-status'>Estado <RequiredSpan /></label>
                    <select
                      className={formErrors.status ? 'input-error' : ''}
                      name='status'
                      id='modal-status'
                      disabled={modalMode === 'view' || modalLoading}
                      value={selectedDish?.status || ''}
                      onChange={handleChange}
                    >
                      <option value=''>Seleccionar estado</option>
                      {statusOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <small className='info-error'>{formErrors.status}</small>
                  </div>

                  <RecipeSection
                    hasRecipe={hasRecipe}
                    onRecipeToggle={handleRecipeToggle}
                    ingredients={recipeIngredients}
                    onIngredientsChange={handleRecipeIngredientsChange}
                    availableIngredients={allIngredients}
                    ingredientsLoading={ingredientsLoading || recipeLoading}
                    disabled={modalMode === 'view' || modalLoading || recipeLoading}
                  />
                  {formErrors.ingredients && (
                    <small className='info-error' style={{ display: 'block', marginTop: '0.5rem' }}>
                      {formErrors.ingredients}
                    </small>
                  )}
                </div>
              )}
            </CardBody>
            <CardFooter className='modal-footer'>
              <button type='button' onClick={handleCancel} disabled={modalLoading}>
                <CancelIcon />
                Cancelar
              </button>
              {modalMode === 'view' && (
                <button type='button' className='edit' onClick={() => setModalMode('edit')} disabled={modalLoading}>
                  <EditIcon />
                  Editar
                </button>
              )}
              {(modalMode === 'edit' || modalMode === 'create') && (
                <button
                  type='button'
                  className='primary'
                  onClick={handleSave}
                  disabled={
                    modalLoading ||
                    Object.values(formErrors).some((error) => error !== '') ||
                    !selectedDish?.name ||
                    !selectedDish?.price ||
                    (hasRecipe && recipeIngredients.filter(ing => ing.ingredientId && ing.quantityUsed && parseFloat(ing.quantityUsed) > 0).length === 0)
                  }
                >
                  <AddIcon />
                  {modalMode === 'create' ? 'Crear Plato' : 'Guardar Cambios'}
                </button>
              )}
              {modalMode === 'delete' && (
                <button type='button' className='delete' onClick={handleDelete} disabled={modalLoading}>
                  <TrashBinIcon />
                  Confirmar Eliminación
                </button>
              )}
            </CardFooter>
          </Card>
        </form>
      </Modal>
    </>
  )
}
