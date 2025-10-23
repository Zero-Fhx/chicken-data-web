import { Card, CardBody, CardFooter, CardHeader } from '@/components/Card'
import { AddIcon, ArrowLeftIcon, ArrowRightIcon, CancelIcon, DeleteIcon, DownloadIcon, EditIcon, PlateIcon, RefreshIcon, SearchIcon, TrashBinIcon, ViewIcon, WarningIcon } from '@/components/Icons'
import { Loader } from '@/components/Loader'
import { Modal } from '@/components/Modal'
import { RequiredSpan } from '@/components/RequiredSpan'
import { Separator } from '@/components/Separator'
import { TestStatePanel } from '@/components/TestStatePanel'
import { useDebounce } from '@/hooks/useDebounce'
import { useFetch } from '@/hooks/useFetch'

import { useMemo, useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const API_URL = `${API_BASE_URL}/dishes`

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

export function Dishes () {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [filters, setFilters] = useState(initialFilters)

  const [selectedDish, setSelectedDish] = useState(null)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: categoriesData } = useFetch(API_CATEGORIES_URL)
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
    setFilters((prev) => ({ ...prev, [name]: value }))
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

  const handleDishSelect = (dish) => {
    console.log('Ver Plato', dish.id)
    setSelectedDish(dish)
    console.log(dish)
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
    setIsModalOpen(false)
  }

  const handleAnimationEnd = () => {
    setSelectedDish(null)
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

      <section>
        <div>
          <h1 className='title'>Gestión de Platos</h1>
          <p className='muted-text'>Administra tu catalogo de platos aquí.</p>
        </div>

        <div className='button-group'>
          <button
            className='primary'
            onClick={() => console.log('Agregar Plato')}
          >
            <AddIcon />
            Agregar Plato
          </button>

          <button
            className='secondary'
            onClick={() => console.log('Exportar Datos')}
          >
            <DownloadIcon />
            Exportar Datos
          </button>
        </div>
      </section>

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
                autocomplete='off'
              />
            </div>

            <div className='filter-input'>
              <label htmlFor='filter-category'>Categoría:</label>
              <select
                id='filter-category'
                name='category'
                value={filters.category}
                onChange={handleFilterChange}
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
        <Card>
          <CardHeader>
            <div className='header-with-icon'>
              <PlateIcon />
              <h2>Lista de Platos</h2>
            </div>
            <div className='button-group'>
              {/* PageSize select */}
              <select
                className='muted'
                style={{ width: 'auto' }}
                id='page-size-select'
                name='pageSize'
                value={pageSize}
                disabled={loading}
                autocomplete='off'
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setPage(1)
                }}
              >
                <option value={5}>5 por página</option>
                <option value={10}>10 por página</option>
                <option value={20}>20 por página</option>
                <option value={50}>50 por página</option>
              </select>
              <button
                className='muted'
                onClick={refetch}
                disabled={loading}
              >
                <RefreshIcon />
                Recargar Platos
              </button>
            </div>

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
                  <tr>
                    <td className='center-cell' colSpan='7' style={{ padding: '2rem' }}>
                      <Loader width={24} height={24} />
                    </td>
                  </tr>}
                {error &&
                  <tr>
                    <td className='center-cell muted-text' colSpan='7' style={{ padding: '2rem' }}>
                      <div>
                        <WarningIcon width={40} height={40} color='rgb(220, 38, 38)' />
                        <div>
                          <strong style={{ color: 'rgb(220, 38, 38)' }}>Error al cargar los platos</strong>
                          <div className='muted-text' style={{ marginTop: '0.25rem', fontSize: '0.875rem' }}>{error.message}</div>
                        </div>
                      </div>
                    </td>
                  </tr>}
                {!loading && !error && dishes && (dishes.length > 0
                  ? (
                      dishes.map((dish) => (
                        <tr key={dish.id}>
                          <td className='center-cell'>{dish.id}</td>
                          <td><div className='ellipsis-cell'>{dish.name}</div></td>
                          <td><div className='ellipsis-cell'>{dish.description}</div></td>
                          <td className='center-cell'>{dish.category.name}</td>
                          <td className='center-cell'>${dish.price}</td>
                          <td className='center-cell'>{dish.status === 'Active' ? 'Activo' : 'Inactivo'}</td>
                          <td className='center-cell'>
                            <div className='button-group' style={{ justifyContent: 'center' }}>
                              <button
                                className='view icon-only no-transform'
                                onClick={() => handleDishSelect(dish)}
                              >
                                <ViewIcon />
                              </button>
                              <button
                                className='edit icon-only no-transform'
                                onClick={() => console.log('Editar Plato', dish.id)}
                              >
                                <EditIcon />
                              </button>
                              <button
                                className='delete icon-only no-transform'
                                onClick={() => console.log('Eliminar Plato', dish.id)}
                              >
                                <DeleteIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )
                  : (<tr><td className='center-cell muted-text' colSpan='7' style={{ padding: '2rem' }}>No se encontraron platos.</td></tr>))}
              </tbody>
            </table>
          </CardBody>
          {meta &&
            <CardFooter>
              {meta.pagination && (
                <div className='pagination'>
                  <button
                    className='pagination-btn'
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                  >
                    <ArrowLeftIcon />
                    Anterior
                  </button>

                  {[...Array(meta.pagination.pageCount || 1)].map((_, i) => (
                    <button
                      key={i}
                      className={`pagination-btn ${page === i + 1 ? 'active' : ''}`}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    className='pagination-btn'
                    onClick={() => setPage((prev) => (prev < (meta.pagination.pageCount || 1) ? prev + 1 : prev))}
                    disabled={page === (meta.pagination.pageCount || 1)}
                  >
                    Siguiente
                    <ArrowRightIcon />
                  </button>
                </div>
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
                <PlateIcon />
                <h3>Datos del Plato</h3>
              </div>
              <button type='button' className='modal-close-button no-transform' onClick={handleCloseWithX}>
                <CancelIcon />
              </button>
            </CardHeader>
            <CardBody className='modal-body'>
              <div className='modal-input-group'>
                <div className='input-group'>
                  <label htmlFor='modal-name'>Nombre <RequiredSpan /></label>
                  <input type='text' id='modal-name' name='name' value={selectedDish?.name || ''} autocomplete='off' disabled />
                </div>
                <div className='input-group'>
                  <label htmlFor='modal-description'>Descripción <RequiredSpan /></label>
                  <textarea id='modal-description' name='description' value={selectedDish?.description || ''} autocomplete='off' disabled />
                </div>
                <div className='input-group'>
                  <label htmlFor='modal-category'>Categoría <RequiredSpan /></label>
                  <select name='category' id='modal-category' disabled value={selectedDish?.category.id || ''} autocomplete='off'>
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
                </div>
                <div className='input-group'>
                  <label htmlFor='modal-price'>Precio <RequiredSpan /></label>
                  <input type='number' id='modal-price' name='price' value={selectedDish?.price || ''} autocomplete='off' disabled />
                </div>
                <div className='input-group'>
                  <label htmlFor='modal-status'>Estado <RequiredSpan /></label>
                  <select name='status' id='modal-status' disabled value={selectedDish?.status || ''} autocomplete='off'>
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
                </div>
              </div>
            </CardBody>
            <CardFooter className='modal-footer'>
              <button type='button' onClick={handleCancel}>
                <CancelIcon />
                Cancelar
              </button>
              <button type='button' className='primary' onClick={handleSave}>
                <AddIcon />
                Guardar
              </button>
            </CardFooter>
          </Card>
        </form>
      </Modal>
    </>
  )
}
