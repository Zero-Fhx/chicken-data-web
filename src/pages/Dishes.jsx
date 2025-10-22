import { Card, CardBody, CardFooter, CardHeader } from '@/components/Card'
import { AddIcon, ArrowLeftIcon, ArrowRightIcon, DeleteIcon, DownloadIcon, EditIcon, PlateIcon, RefreshIcon, SearchIcon, TrashBinIcon, ViewIcon, WarningIcon } from '@/components/Icons'
import { Loader } from '@/components/Loader'
import { Separator } from '@/components/Separator'
import { useFetch } from '@/hooks/useFetch'
import { useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const API_URL = `${API_BASE_URL}/dishes`

export function Dishes () {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [filters, setFilters] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    status: ''
  })

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleClearFilters = () => {
    setFilters({
      name: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      status: ''
    })
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== '')

  const buildURL = () => {
    const url = new URL(API_URL)
    url.searchParams.set('page', page)
    url.searchParams.set('pageSize', pageSize)
    if (filters.name) url.searchParams.set('search', filters.name)
    if (filters.category) url.searchParams.set('categoryId', filters.category)
    if (filters.minPrice) url.searchParams.set('minPrice', filters.minPrice)
    if (filters.maxPrice) url.searchParams.set('maxPrice', filters.maxPrice)
    if (filters.status) url.searchParams.set('status', filters.status)
    return url.toString()
  }

  const { data, loading, setLoading, error, setError, refetch } = useFetch(
    buildURL()
  )

  const { data: dishes, meta } = data || {}

  return (
    <>
      {/* Test Section */}
      <section>
        <Card>
          <CardHeader>
            <div className='header-with-icon'>
              <WarningIcon />
              <h2>Panel de Control de Estados</h2>
            </div>
          </CardHeader>

          <CardBody>
            <p className='muted-text' style={{ marginBottom: '1rem' }}>
              Esta sección te permite simular diferentes estados de la aplicación para pruebas.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '250px' }}>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Estado de Carga</h3>
                <div className='button-group'>
                  <button
                    className='info'
                    onClick={() => setLoading(true)}
                  >
                    Activar Carga
                  </button>
                  <button
                    className='muted'
                    onClick={() => setLoading(false)}
                  >
                    Desactivar Carga
                  </button>
                </div>
                <p className='muted-text' style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Estado actual: <strong>{loading ? 'Cargando...' : 'Inactivo'}</strong>
                </p>
              </div>

              <div style={{ flex: '1', minWidth: '250px' }}>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Estado de Error</h3>
                <div className='button-group'>
                  <button
                    className='danger'
                    onClick={() => setError({ message: 'Error simulado para pruebas' })}
                  >
                    Simular Error
                  </button>
                  <button
                    className='muted'
                    onClick={() => setError(null)}
                  >
                    Limpiar Error
                  </button>
                </div>
                <p className='muted-text' style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Estado actual: <strong>{error ? `Error: ${error.message}` : 'Sin errores'}</strong>
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Acciones Rápidas</h3>
              <div className='button-group'>
                <button
                  className='warning'
                  onClick={() => {
                    setLoading(false)
                    setError(null)
                  }}
                >
                  Resetear Todo
                </button>
                <button
                  className='info'
                  onClick={() => {
                    setLoading(true)
                    setTimeout(() => setLoading(false), 2000)
                  }}
                >
                  Simular Carga (2s)
                </button>
                <button
                  className='danger'
                  onClick={() => {
                    setError({ message: 'Error de conexión con el servidor' })
                    setTimeout(() => setError(null), 3000)
                  }}
                >
                  Simular Error (3s)
                </button>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

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

            {/* Desactivado si no hay filtros */}
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
              >
                <option value=''>Todas las Categorías</option>
                <option value='1'>General</option>
                <option value='2'>Entrante</option>
                <option value='3'>Plato Principal</option>
                <option value='4'>Postre</option>
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
                style={{ width: 'auto' }}
                value={pageSize}
                disabled={loading}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setPage(1) // Reset to first page when page size changes
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
                                className='view icon-only'
                                onClick={() => console.log('Ver Plato', dish.id)}
                              >
                                <ViewIcon />
                              </button>
                              <button
                                className='edit icon-only'
                                onClick={() => console.log('Editar Plato', dish.id)}
                              >
                                <EditIcon />
                              </button>
                              <button
                                className='delete icon-only'
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
                  {/* "meta": {
                    "pagination": {
                      "page": 2, // Pagina actual
                      "pageSize": 10, // Numero de items por pagina
                      "pageCount": 2, // Numero total de paginas
                      "total": 13, // Numero total de items
                      "hasNextPage": false, // Indica si hay una pagina siguiente
                      "hasPrevPage": true // Indica si hay una pagina anterior
                      }
                    } */}

                  {/* [Anterior] [1] [2] [3] [Siguiente] */}

                  <button
                    className='pagination-btn'
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                  >
                    <ArrowLeftIcon />
                    Anterior
                  </button>

                  {/* [1] [2] [3] */}

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
    </>
  )
}
