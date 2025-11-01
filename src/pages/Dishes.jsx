import { useEffect, useMemo, useState } from 'react'

import { useDebounce } from '@/hooks/useDebounce'
import { useFetch } from '@/hooks/useFetch'

import { Card, CardBody, CardFooter, CardHeader } from '@/components/Card'
import { DeleteConfirmation } from '@/components/DeleteConfirmation'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { Loader } from '@/components/Loader'
import { Modal } from '@/components/Modal'
import { PageHeader } from '@/components/PageHeader'
import { Pagination } from '@/components/Pagination'
import { RequiredSpan } from '@/components/RequiredSpan'
import { ResultsCounter } from '@/components/ResultsCounter'
import { Separator } from '@/components/Separator'
import { StatusBadge } from '@/components/StatusBadge'
import { TableControls } from '@/components/TableControls'
import { TestStatePanel } from '@/components/TestStatePanel'

import { AddIcon, CancelIcon, CheckIcon, DownloadIcon, EditIcon, PlateIcon, SearchIcon, TrashBinIcon, ViewIcon } from '@/components/Icons'

import trunc from '@/services/trunc'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const API_URL = `${API_BASE_URL}/dishes/`

const API_CATEGORIES_URL = `${API_BASE_URL}/dish-categories`

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
  status: ''
}

export function Dishes () {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [filters, setFilters] = useState(initialFilters)

  const [selectedDish, setSelectedDish] = useState(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('view')
  const [modalLoading, setModalLoading] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(null) // null | 'save' | 'delete' | 'create'

  const [formErrors, setFormErrors] = useState(initialFormErrors)

  const { data: categoriesData, loading: categoriesLoading } = useFetch(API_CATEGORIES_URL)
  const categories = categoriesData?.data || []

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name
  }))

  const debouncedName = useDebounce(filters.name, 500)
  const debouncedMinPrice = useDebounce(filters.minPrice, 500)
  const debouncedMaxPrice = useDebounce(filters.maxPrice, 500)

  const handleFilterChange = (e) => {
    const { name, value } = e.target

    let finalValue = value

    if ((name === 'minPrice' || name === 'maxPrice') && value !== '') {
      finalValue = trunc(parseFloat(value), 2)
    }

    setFilters((prev) => ({ ...prev, [name]: finalValue }))
  }

  const handleClearFilters = () => {
    setFilters(initialFilters)
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== '')

  const buildURL = useMemo(() => {
    const url = new URL(API_URL)
    url.searchParams.set('page', page)
    url.searchParams.set('pageSize', pageSize)

    if (debouncedName) url.searchParams.set('search', debouncedName.trim().toLowerCase())
    if (debouncedMinPrice) url.searchParams.set('minPrice', debouncedMinPrice)
    if (debouncedMaxPrice) url.searchParams.set('maxPrice', debouncedMaxPrice)

    if (filters.category) url.searchParams.set('categoryId', filters.category)
    if (filters.status) url.searchParams.set('status', filters.status)

    return url.toString()
  }, [page, pageSize, debouncedName, debouncedMinPrice, debouncedMaxPrice, filters.category, filters.status])

  const { data, loading, setLoading, error, setError, refetch } = useFetch(
    buildURL
  )

  const { data: dishes, meta } = data || {}

  useEffect(() => {
    if (error && error.status === 400 && page > 1) {
      setError(null)
      setPage(1)
    }
  }, [error, page, setError])

  const handleChange = (e) => {
    const { name, value } = e.target
    setSelectedDish((prev) => ({ ...prev, [name]: value }))
    console.log(`Cambio en el campo ${name}:`, value)

    if (modalMode === 'edit') {
      if (name === 'name') {
        if (value.trim() === '') {
          setFormErrors((prev) => ({ ...prev, name: 'El nombre es obligatorio' }))
          return
        } else {
          setFormErrors((prev) => ({ ...prev, name: '' }))
        }
      }

      if (name === 'price') {
        const formattedValue = trunc(parseFloat(value), 2)
        const priceValue = parseFloat(formattedValue)

        setSelectedDish((prev) => ({ ...prev, price: isNaN(priceValue) ? '' : formattedValue.toString() }))

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
    console.log('Ver Plato', dish.id)
    setSelectedDish(dish)
    console.log(dish)
    setModalMode(mode)
    setIsModalOpen(true)
  }

  const handleCloseWithX = () => {
    console.log('Cerrando modal con X')
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    console.log('Cancelando acción...')
    setIsModalOpen(false)
  }

  const handleSave = () => {
    console.log('Guardando cambios...')
    setModalLoading(true)

    const updatedDish = {
      id: selectedDish.id,
      name: selectedDish.name,
      category: selectedDish.category,
      price: selectedDish.price,
      status: selectedDish.status
    }

    console.log('Datos a enviar:', updatedDish)

    fetch(`${API_URL}${selectedDish.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedDish)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al actualizar el plato')
        }
        return response.json()
      })
      .then((data) => {
        console.log('Plato actualizado:', data)
        refetch()
        setModalSuccess('save')
        setTimeout(() => {
          setIsModalOpen(false)
        }, 1500)
      })
      .catch((error) => {
        console.error('Error:', error)
        setModalLoading(false)
        alert('Error al actualizar el plato: ' + error.message)
      })
  }

  const handleDelete = () => {
    console.log('Eliminando plato...')
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
      .then((data) => {
        console.log('Plato eliminado:', data)
        refetch()
        setModalSuccess('delete')
        setTimeout(() => {
          setIsModalOpen(false)
        }, 200)
      })
      .catch((error) => {
        console.error('Error:', error)
        setModalLoading(false)
        alert('Error al eliminar el plato: ' + error.message)
      })
  }

  const handleAnimationEnd = () => {
    setSelectedDish(null)
    setFormErrors(initialFormErrors)
    setModalLoading(false)
    setModalSuccess(null)
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
            onClick: () => console.log('Agregar Plato')
          },
          {
            label: 'Exportar Datos',
            icon: <DownloadIcon />,
            variant: 'secondary',
            onClick: () => console.log('Exportar Datos')
          }
        ]}
      />

      <Separator />

      <section>
        <Card>
          <CardHeader>
            <div className='header-with-icon'>
              <SearchIcon />
              <h3>Filtrar Platos</h3>
            </div>

            <button
              className='muted'
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
            >
              <TrashBinIcon />
              Limpiar Filtros
            </button>
          </CardHeader>

          <CardBody className='filter-form'>
            <div className='filter-input'>
              <label htmlFor='filter-name'>Plato:</label>
              <input
                placeholder='Buscar Plato'
                id='filter-name'
                name='name'
                value={filters.name}
                onChange={handleFilterChange}
              />
            </div>

            <div className='filter-input'>
              <label htmlFor='filter-category'>Categoría:</label>
              <select
                id='filter-category'
                name='category'
                value={filters.category}
                onChange={handleFilterChange}
                disabled={categoriesLoading}
              >
                <option value=''>Todas las Categorías</option>
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className='filter-input'>
              <label htmlFor='filter-price-min'>Precio Mínimo:</label>
              <input
                placeholder='Precio Mínimo'
                type='number'
                id='filter-price-min'
                name='minPrice'
                min='0'
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
            </div>

            <div className='filter-input'>
              <label htmlFor='filter-price-max'>Precio Máximo:</label>
              <input
                placeholder='Precio Máximo'
                type='number'
                id='filter-price-max'
                name='maxPrice'
                min='0'
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>

            <div className='filter-input'>
              <label htmlFor='filter-status'>Estado:</label>
              <select
                id='filter-status'
                name='status'
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value=''>Todos los Estados</option>
                <option value='Active'>Activo</option>
                <option value='Inactive'>Inactivo</option>
              </select>
            </div>
          </CardBody>
        </Card>
      </section>

      <Separator />

      <section>

        <ResultsCounter
          loading={loading}
          error={error}
          items={dishes}
          meta={meta}
          pageSize={pageSize}
          icon={PlateIcon}
          itemName='plato'
          itemNamePlural='platos'
        />

        <Card>
          <CardHeader>
            <TableControls
              title='Lista de Platos'
              icon={PlateIcon}
              pageSize={pageSize}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setPage(1)
              }}
              onRefresh={refetch}
              loading={loading}
              pageSizeOptions={[5, 10, 20, 50]}
              refreshLabel='Recargar Platos'
            />
          </CardHeader>
          <CardBody className='no-padding'>
            <table>
              <thead>
                <tr>
                  <th className='center-cell'>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th className='center-cell'>Categoría</th>
                  <th className='center-cell'>Precio</th>
                  <th className='center-cell'>Estado</th>
                  <th className='center-cell'>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading &&
                  <tr className='loading-state-row'>
                    <td className='center-cell' colSpan='7' style={{ padding: '2rem' }}>
                      <Loader width={24} height={24} />
                    </td>
                  </tr>}
                {error && !(error.status === 400 && page > 1) &&
                  <tr className='error-state-row'>
                    <td className='center-cell' colSpan='7' style={{ padding: 0 }}>
                      <ErrorState
                        title='Error al cargar los platos'
                        message={error.message}
                        onRetry={refetch}
                      />
                    </td>
                  </tr>}
                {!loading && !error && dishes && (dishes.length > 0
                  ? dishes.map((dish) => (
                    <tr key={dish.id}>
                      <td className='center-cell'>{dish.id}</td>
                      <td><div className='ellipsis-cell'>{dish.name}</div></td>
                      <td><div className='ellipsis-cell'>{dish.description}</div></td>
                      <td className='center-cell'>{dish.category.name}</td>
                      <td className='center-cell'>
                        <div className='price-cell'>
                          <span>
                            S/. {dish.price.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className='center-cell'>
                        <StatusBadge status={dish.status} />
                      </td>
                      <td className='center-cell'>
                        <div className='button-group' style={{ justifyContent: 'center' }}>
                          <button
                            className='view icon-only no-transform'
                            onClick={() => handleDishSelect(dish, 'view')}
                          >
                            <ViewIcon />
                          </button>
                          <button
                            className='edit icon-only no-transform'
                            onClick={() => handleDishSelect(dish, 'edit')}
                          >
                            <EditIcon />
                          </button>
                          <button
                            className='delete icon-only no-transform'
                            onClick={() => handleDishSelect(dish, 'delete')}
                          >
                            <TrashBinIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                  : (
                    <tr className='empty-state-row'>
                      <td className='center-cell' colSpan='7' style={{ padding: 0 }}>
                        <EmptyState
                          icon={PlateIcon}
                          message='No se encontraron platos'
                          description='Intenta ajustar los filtros o crear un nuevo plato'
                        />
                      </td>
                    </tr>
                    ))}
              </tbody>
            </table>
          </CardBody>
          {meta &&
            <CardFooter>
              {meta.pagination && (
                <Pagination
                  currentPage={page}
                  totalPages={meta.pagination.pageCount}
                  onPageChange={setPage}
                />
              )}
            </CardFooter>}
        </Card>
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
                <h3>
                  {modalMode === 'view' && 'Ver Plato'}
                  {modalMode === 'edit' && 'Editar Plato'}
                  {modalMode === 'delete' && 'Eliminar Plato'}
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
              {modalMode === 'delete'
                ? (
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
                  )
                : (
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
                      <input
                        className={formErrors.price ? 'input-error' : ''}
                        type='number'
                        id='modal-price'
                        name='price'
                        value={selectedDish?.price || ''}
                        disabled={modalMode === 'view' || modalLoading}
                        onChange={handleChange}
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
              {modalMode === 'edit' && (
                <button type='button' className='primary' onClick={handleSave} disabled={modalLoading || Object.values(formErrors).some((error) => error !== '')}>
                  <AddIcon />
                  Guardar Cambios
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
