import { useEffect, useMemo, useState } from 'react'

import { useDebounce } from '@/hooks/useDebounce'
import { useFetch } from '@/hooks/useFetch'

import { AdjustStockForm } from '@/components/AdjustStockForm'
import { Card, CardBody, CardFooter, CardHeader } from '@/components/Card'
import { DataTable } from '@/components/DataTable'
import { DeleteConfirmation } from '@/components/DeleteConfirmation'
import { ErrorModal } from '@/components/ErrorModal'
import { FilterSection } from '@/components/FilterSection'
import { AddIcon, AdjustIcon, CancelIcon, CheckIcon, CubeAltIcon, DownloadIcon, EditIcon, SearchIcon, TrashBinIcon, ViewIcon } from '@/components/Icons'
import { InputWithLabel } from '@/components/InputWithLabel'
import { Loader } from '@/components/Loader'
import { Modal } from '@/components/Modal'
import { PageHeader } from '@/components/PageHeader'
import { RequiredSpan } from '@/components/RequiredSpan'
import { Separator } from '@/components/Separator'
import { StatusBadge } from '@/components/StatusBadge'
import { TestStatePanel } from '@/components/TestStatePanel'

import API_ENDPOINTS from '@/services/api'
import { removeExtraSpaces } from '@/services/normalize'
import trunc from '@/services/trunc'

const ENVIRONMENT = import.meta.env.VITE_ENV || 'production'

const API_URL = `${API_ENDPOINTS.ingredients}/`
const API_CATEGORIES_URL = API_ENDPOINTS.ingredientCategories

const initialFilters = {
  name: '',
  category: '',
  status: '',
  lowStock: false,
  minStock: '',
  maxStock: ''
}

const statusOptions = [
  { value: 'Active', label: 'Activo' },
  { value: 'Inactive', label: 'Inactivo' }
]

const initialFormErrors = {
  name: '',
  unit: '',
  category: '',
  stock: '',
  minimumStock: '',
  status: '',
  adjustmentValue: ''
}

export function Ingredients () {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [filters, setFilters] = useState(initialFilters)
  const [filterErrors, setFilterErrors] = useState({ minStock: '', maxStock: '' })

  const [selectedIngredient, setSelectedIngredient] = useState(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('view')
  const [modalLoading, setModalLoading] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(null)
  const [modalError, setModalError] = useState(null)

  const [formErrors, setFormErrors] = useState(initialFormErrors)

  const { data: categoriesData, loading: categoriesLoading } = useFetch(API_CATEGORIES_URL)
  const categories = categoriesData?.data || []

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name
  }))

  const stockOptions = [
    { value: 'low', label: 'Stock Bajo' }
  ]

  const filterFields = [
    {
      type: 'text',
      name: 'name',
      label: 'Ingrediente',
      placeholder: 'Buscar Ingrediente'
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
      name: 'minStock',
      label: 'Stock Mínimo Desde',
      placeholder: 'Stock Mínimo',
      min: 0,
    },
    {
      type: 'number',
      name: 'maxStock',
      label: 'Stock Máximo Hasta',
      placeholder: 'Stock Máximo',
      min: 0,
    },
    {
      type: 'select',
      name: 'lowStock',
      label: 'Stock Bajo',
      placeholder: 'Todos',
      options: stockOptions
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
      key: 'category',
      label: 'Categoría',
      align: 'center',
      render: (row) => row.category.name
    },
    {
      key: 'unit',
      label: 'Unidad',
      align: 'center'
    },
    {
      key: 'stock',
      label: 'Stock',
      align: 'center',
      render: (row) => {
        const getStockClass = () => {
          if (row.stock === 0) return 'stock-empty'
          if (row.stock <= row.minimumStock) return 'stock-warning'
          return 'stock-good'
        }

        return (
          <div className={`stock-indicator ${getStockClass()}`}>
            <span>{row.stock.toFixed(2)}</span>
          </div>
        )
      }
    },
    {
      key: 'minimumStock',
      label: 'Stock Mínimo',
      align: 'center',
      render: (row) => (
        <div className='badge-cell'>
          <span>{row.minimumStock.toFixed(2)}</span>
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
      onClick: (row) => handleIngredientSelect(row, 'view')
    },
    {
      label: 'Ajustar',
      icon: <AdjustIcon />,
      variant: 'adjust',
      iconOnly: true,
      onClick: (row) => handleIngredientSelect(row, 'adjust')
    },
    {
      label: 'Editar',
      icon: <EditIcon />,
      variant: 'edit',
      iconOnly: true,
      onClick: (row) => handleIngredientSelect(row, 'edit')
    },
    {
      label: 'Eliminar',
      icon: <TrashBinIcon />,
      variant: 'delete',
      iconOnly: true,
      onClick: (row) => handleIngredientSelect(row, 'delete')
    }
  ]

  const debouncedName = useDebounce(filters.name, 500)
  const debouncedMinStock = useDebounce(filters.minStock, 500)
  const debouncedMaxStock = useDebounce(filters.maxStock, 500)

  const handleFilterChange = (e) => {
    const { name, value } = e.target

    let finalValue = value

    if ((name === 'minStock' || name === 'maxStock') && value !== '') {
      const formattedValue = trunc(value, 2)
      finalValue = formattedValue
    }

    setFilters((prev) => ({ ...prev, [name]: finalValue }))

    if (name === 'minStock' || name === 'maxStock') {
      const currentFilters = { ...filters, [name]: finalValue }
      const minStock = parseFloat(currentFilters.minStock)
      const maxStock = parseFloat(currentFilters.maxStock)

      if (!isNaN(minStock) && !isNaN(maxStock) && minStock > maxStock) {
        if (name === 'minStock') {
          setFilterErrors({ minStock: 'El stock mínimo no puede ser mayor al máximo', maxStock: '' })
        } else {
          setFilterErrors({ minStock: '', maxStock: 'El stock máximo no puede ser menor al mínimo' })
        }
      } else {
        setFilterErrors({ minStock: '', maxStock: '' })
      }
    }
  }

  const handleClearFilters = () => {
    setFilters(initialFilters)
    setFilterErrors({ minStock: '', maxStock: '' })
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== '' && value !== false)

  const buildURL = useMemo(() => {
    const url = new URL(API_URL)
    url.searchParams.set('page', page)
    url.searchParams.set('pageSize', pageSize)

    if (debouncedName) url.searchParams.set('search', debouncedName.trim().toLowerCase())
    if (debouncedMinStock && !filterErrors.minStock) url.searchParams.set('minStock', debouncedMinStock)
    if (debouncedMaxStock && !filterErrors.maxStock) url.searchParams.set('maxStock', debouncedMaxStock)

    if (filters.category) url.searchParams.set('categoryId', filters.category)
    if (filters.status) url.searchParams.set('status', filters.status)
    if (filters.lowStock === 'low') url.searchParams.set('lowStock', 'true')

    return url.toString()
  }, [page, pageSize, debouncedName, debouncedMinStock, debouncedMaxStock, filters.category, filters.status, filters.lowStock, filterErrors.minStock, filterErrors.maxStock])

  const { data, loading, setLoading, error, setError, refetch } = useFetch(
    buildURL
  )

  const { data: ingredients, meta } = data || {}

  useEffect(() => {
    if (error && error.status === 400 && page > 1) {
      setError(null)
      setPage(1)
    }
  }, [error, page, setError])

  const calculateResultingStock = () => {
    if (!selectedIngredient) return 0

    const currentStock = parseFloat(selectedIngredient.stock) || 0
    const adjustmentValue = parseFloat(selectedIngredient.adjustmentValue) || 0
    const adjustmentType = selectedIngredient.adjustmentType || 'add'

    switch (adjustmentType) {
      case 'add':
        return currentStock + adjustmentValue
      case 'subtract':
        return currentStock - adjustmentValue
      case 'set':
        return adjustmentValue
      default:
        return currentStock
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setSelectedIngredient((prev) => ({ ...prev, [name]: value }))

    if (modalMode === 'edit' || modalMode === 'create') {
      if (name === 'name') {
        if (value.trim() === '') {
          setFormErrors((prev) => ({ ...prev, name: 'El nombre es obligatorio' }))
          return
        } else {
          setFormErrors((prev) => ({ ...prev, name: '' }))
        }
      }

      if (name === 'unit') {
        if (value.trim() === '') {
          setFormErrors((prev) => ({ ...prev, unit: 'La unidad es obligatoria' }))
          return
        } else {
          setFormErrors((prev) => ({ ...prev, unit: '' }))
        }
      }

      if (name === 'stock') {
        const formattedValue = trunc(value, 2)
        const stockValue = parseFloat(formattedValue)

        setSelectedIngredient((prev) => ({ ...prev, stock: formattedValue }))

        if (isNaN(stockValue) || stockValue < 0) {
          setFormErrors((prev) => ({ ...prev, stock: 'El stock debe ser mayor o igual a 0' }))
          return
        } else {
          setFormErrors((prev) => ({ ...prev, stock: '' }))
        }
      }

      if (name === 'minimumStock') {
        const formattedValue = trunc(value, 2)
        const minStockValue = parseFloat(formattedValue)

        setSelectedIngredient((prev) => ({ ...prev, minimumStock: formattedValue }))

        if (isNaN(minStockValue) || minStockValue < 0) {
          setFormErrors((prev) => ({ ...prev, minimumStock: 'El stock mínimo debe ser mayor o igual a 0' }))
          return
        } else {
          setFormErrors((prev) => ({ ...prev, minimumStock: '' }))
        }
      }

      if (name === 'category') {
        const selectedCategory = categories.find(cat => cat.id === parseInt(value))
        setSelectedIngredient((prev) => ({ ...prev, category: selectedCategory || null }))
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

    if (modalMode === 'adjust') {
      if (name === 'adjustmentType') {
        setSelectedIngredient((prev) => ({ ...prev, adjustmentType: value, adjustmentValue: '' }))
        setFormErrors((prev) => ({ ...prev, adjustmentValue: '' }))
      }

      if (name === 'adjustmentValue') {
        const formattedValue = trunc(value, 2)
        const adjustmentValue = parseFloat(formattedValue)

        setSelectedIngredient((prev) => ({ ...prev, adjustmentValue: formattedValue }))

        if (isNaN(adjustmentValue) || adjustmentValue < 0) {
          setFormErrors((prev) => ({ ...prev, adjustmentValue: 'El valor debe ser mayor o igual a 0' }))
        } else {
          setFormErrors((prev) => ({ ...prev, adjustmentValue: '' }))
        }
      }
    }
  }

  const handleAdjustmentTypeChange = (type) => {
    setSelectedIngredient((prev) => ({ ...prev, adjustmentType: type, adjustmentValue: '' }))
    setFormErrors((prev) => ({ ...prev, adjustmentValue: '' }))
  }

  const handleAdjustmentValueChange = (e) => {
    const value = e.target.value

    if (value === '') {
      setSelectedIngredient((prev) => ({ ...prev, adjustmentValue: value }))
      setFormErrors((prev) => ({ ...prev, adjustmentValue: '' }))
      return
    }

    const formattedValue = trunc(value, 2)
    const adjustmentValue = parseFloat(formattedValue)
    const adjustmentType = selectedIngredient?.adjustmentType || 'add'

    setSelectedIngredient((prev) => ({ ...prev, adjustmentValue: formattedValue }))

    if (isNaN(adjustmentValue) || adjustmentValue < 0) {
      setFormErrors((prev) => ({ ...prev, adjustmentValue: 'El valor no puede ser negativo' }))
    } else if ((adjustmentType === 'add' || adjustmentType === 'subtract') && adjustmentValue === 0) {
      setFormErrors((prev) => ({ ...prev, adjustmentValue: 'El valor debe ser mayor a 0' }))
    } else {
      setFormErrors((prev) => ({ ...prev, adjustmentValue: '' }))
    }
  }

  const handleIngredientSelect = (ingredient, mode) => {
    if (mode === 'adjust') {
      setSelectedIngredient({
        ...ingredient,
        adjustmentType: 'add',
        adjustmentValue: ''
      })
    } else {
      setSelectedIngredient(ingredient)
    }
    setModalMode(mode)
    setIsModalOpen(true)
  }

  const handleCreateNew = () => {
    setSelectedIngredient({
      name: '',
      unit: '',
      category: null,
      stock: 0,
      minimumStock: 0,
      status: 'Active'
    })
    setModalMode('create')
    setIsModalOpen(true)
  }

  const handleExport = () => {
    console.log('Exportando datos de ingredientes...')
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

  const handleSave = () => {
    setModalLoading(true)

    if (modalMode === 'adjust') {
      const resultingStock = calculateResultingStock()

      if (resultingStock < 0) {
        setModalError('El stock resultante no puede ser negativo')
        setModalLoading(false)
        return
      }

      const adjustmentData = {
        stock: resultingStock
      }

      fetch(`${API_URL}${selectedIngredient.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adjustmentData)
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error al ajustar el stock del ingrediente')
          }
          return response.json()
        })
        .then(() => {
          refetch()
          setModalSuccess('save')
          setTimeout(() => {
            setIsModalOpen(false)
          }, 1500)
        })
        .catch((error) => {
          console.error('Error:', error)
          setModalLoading(false)
          setModalError(`Error al ajustar el stock del ingrediente: ${error.message}`)
        })
      return
    }

    const ingredientData = {
      name: removeExtraSpaces(selectedIngredient.name).trim(),
      unit: removeExtraSpaces(selectedIngredient.unit).trim(),
      categoryId: selectedIngredient.category?.id || null,
      stock: parseFloat(selectedIngredient.stock) || 0,
      minimumStock: parseFloat(selectedIngredient.minimumStock) || 0,
      status: selectedIngredient.status
    }

    const url = modalMode === 'create' ? API_URL : `${API_URL}${selectedIngredient.id}`
    const method = modalMode === 'create' ? 'POST' : 'PATCH'

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ingredientData)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al ${modalMode === 'create' ? 'crear' : 'actualizar'} el ingrediente`)
        }
        return response.json()
      })
      .then(() => {
        refetch()
        setModalSuccess(modalMode === 'create' ? 'create' : 'save')
        setTimeout(() => {
          setIsModalOpen(false)
        }, 1500)
      })
      .catch((error) => {
        console.error('Error:', error)
        setModalLoading(false)
        setModalError(`Error al ${modalMode === 'create' ? 'crear' : 'actualizar'} el ingrediente: ${error.message}`)
      })
  }

  const handleDelete = () => {
    setModalLoading(true)

    const ingredientId = selectedIngredient.id

    fetch(`${API_URL}${ingredientId}`, {
      method: 'DELETE'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al eliminar el ingrediente')
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
        setModalError(`Error al eliminar el ingrediente: ${error.message}`)
      })
  }

  const handleAnimationEnd = () => {
    setSelectedIngredient(null)
    setFormErrors(initialFormErrors)
    setModalLoading(false)
    setModalSuccess(null)
    setModalError(null)
  }

  return (
    <>
      {ENVIRONMENT === 'development' && (
        <>
          <TestStatePanel
            loading={loading}
            setLoading={setLoading}
            error={error}
            setError={setError}
          />

          <Separator />
        </>
      )}

      <PageHeader
        title='Gestión de Ingredientes'
        description='Administra tu inventario de ingredientes aquí.'
        actions={[
          {
            label: 'Agregar Ingrediente',
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
        title='Filtrar Ingredientes'
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
          title='Lista de Ingredientes'
          icon={CubeAltIcon}
          columns={tableColumns}
          data={ingredients}
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
          refreshLabel='Recargar Ingredientes'
          itemName='ingrediente'
          itemNamePlural='ingredientes'
          emptyIcon={CubeAltIcon}
          emptyMessage='No se encontraron ingredientes'
          emptyDescription='Intenta ajustar los filtros o crear un nuevo ingrediente'
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
                {modalMode === 'adjust' && <AdjustIcon />}
                <h3>
                  {modalMode === 'view' && 'Ver Ingrediente'}
                  {modalMode === 'edit' && 'Editar Ingrediente'}
                  {modalMode === 'delete' && 'Eliminar Ingrediente'}
                  {modalMode === 'create' && 'Crear Ingrediente'}
                  {modalMode === 'adjust' && 'Ajustar Stock del Ingrediente'}
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
                        {modalSuccess === 'create' && <span>¡Ingrediente creado exitosamente!</span>}
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
                              ? 'Creando ingrediente...'
                              : 'Guardando cambios...'
                        }
                      />
                      )}
                </div>
              )}
              {modalError && (
                <ErrorModal message={modalError} onClose={handleCloseError} />
              )}
              {modalMode === 'delete' &&
                (
                  <DeleteConfirmation
                    title='¿Estás seguro de que deseas eliminar este ingrediente?'
                    description='Esta acción no se puede deshacer. El ingrediente será eliminado permanentemente.'
                    details={[
                      { label: 'Nombre', value: selectedIngredient?.name },
                      { label: 'Categoría', value: selectedIngredient?.category?.name },
                      { label: 'Unidad', value: selectedIngredient?.unit },
                      { label: 'Stock', value: `${selectedIngredient?.stock} ${selectedIngredient?.unit}` },
                      { label: 'Stock Mínimo', value: `${selectedIngredient?.minimumStock} ${selectedIngredient?.unit}` },
                      { label: 'Estado', value: selectedIngredient?.status === 'Active' ? 'Activo' : 'Inactivo' }
                    ]}
                  />
                )}
              {modalMode === 'adjust' &&
                (
                  <AdjustStockForm
                    ingredientName={selectedIngredient?.name}
                    currentStock={selectedIngredient?.stock}
                    unit={selectedIngredient?.unit}
                    adjustmentType={selectedIngredient?.adjustmentType || 'add'}
                    adjustmentValue={selectedIngredient?.adjustmentValue || ''}
                    onAdjustmentTypeChange={handleAdjustmentTypeChange}
                    onAdjustmentValueChange={handleAdjustmentValueChange}
                    error={formErrors.adjustmentValue}
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
                      placeholder='Ej: Arroz, Pollo, Aceite'
                      value={selectedIngredient?.name || ''}
                      disabled={modalMode === 'view' || modalLoading}
                      onChange={handleChange}
                    />
                    <small className='info-error'>{formErrors.name}</small>
                  </div>
                  <div className='input-group'>
                    <label htmlFor='modal-unit'>Unidad de Medida <RequiredSpan /></label>
                    <input
                      className={formErrors.unit ? 'input-error' : ''}
                      type='text'
                      id='modal-unit'
                      name='unit'
                      placeholder='Ej: kg, L, unidad'
                      value={selectedIngredient?.unit || ''}
                      disabled={modalMode === 'view' || modalLoading}
                      onChange={handleChange}
                    />
                    <small className='info-error'>{formErrors.unit}</small>
                  </div>
                  <div className='input-group'>
                    <label htmlFor='modal-category'>Categoría <RequiredSpan /></label>
                    <select
                      className={formErrors.category ? 'input-error' : ''}
                      name='category'
                      id='modal-category'
                      disabled={modalMode === 'view' || modalLoading}
                      value={selectedIngredient?.category?.id || ''}
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
                    <label htmlFor='modal-stock'>Stock Actual</label>
                    <InputWithLabel
                      label={selectedIngredient?.unit || ''}
                      position='right'
                      className={formErrors.stock ? 'input-error' : ''}
                      type='number'
                      id='modal-stock'
                      name='stock'
                      placeholder='0.00'
                      min='0'
                      step='1'
                      value={selectedIngredient?.stock || ''}
                      disabled={modalMode === 'view' || modalLoading}
                      onChange={handleChange}
                    />
                    <small className='info-error'>{formErrors.stock}</small>
                  </div>
                  <div className='input-group'>
                    <label htmlFor='modal-minimumStock'>Stock Mínimo</label>
                    <InputWithLabel
                      label={selectedIngredient?.unit || ''}
                      position='right'
                      className={formErrors.minimumStock ? 'input-error' : ''}
                      type='number'
                      id='modal-minimumStock'
                      name='minimumStock'
                      placeholder='0.00'
                      min='0'
                      step='1'
                      value={selectedIngredient?.minimumStock || ''}
                      disabled={modalMode === 'view' || modalLoading}
                      onChange={handleChange}
                    />
                    <small className='info-error'>{formErrors.minimumStock}</small>
                  </div>
                  <div className='input-group'>
                    <label htmlFor='modal-status'>Estado <RequiredSpan /></label>
                    <select
                      className={formErrors.status ? 'input-error' : ''}
                      name='status'
                      id='modal-status'
                      disabled={modalMode === 'view' || modalLoading}
                      value={selectedIngredient?.status || ''}
                      onChange={handleChange}
                    >
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
                  disabled={modalLoading || Object.values(formErrors).some((error) => error !== '') || !selectedIngredient?.name || !selectedIngredient?.unit}
                >
                  <AddIcon />
                  {modalMode === 'create' ? 'Crear Ingrediente' : 'Guardar Cambios'}
                </button>
              )}
              {modalMode === 'adjust' && (
                <button
                  type='button'
                  className='adjust'
                  onClick={handleSave}
                  disabled={
                    modalLoading ||
                    Object.values(formErrors).some((error) => error !== '') ||
                    !selectedIngredient?.adjustmentValue ||
                    selectedIngredient.adjustmentValue === '' ||
                    calculateResultingStock() < 0 ||
                    ((selectedIngredient.adjustmentType === 'add' || selectedIngredient.adjustmentType === 'subtract') &&
                      (selectedIngredient.adjustmentValue === '0' ||
                       selectedIngredient.adjustmentValue === '0.' ||
                       selectedIngredient.adjustmentValue === '0.0' ||
                       parseFloat(selectedIngredient.adjustmentValue || 0) === 0))
                  }
                >
                  <AdjustIcon />
                  Confirmar Ajuste
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
