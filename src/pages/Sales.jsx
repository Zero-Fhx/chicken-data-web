import { useEffect, useMemo, useState } from 'react'

import { useDebounce } from '@/hooks/useDebounce'
import { useFetch } from '@/hooks/useFetch'

import { Card, CardBody, CardFooter, CardHeader } from '@/components/Card'
import { DataTable } from '@/components/DataTable'
import { DeleteConfirmation } from '@/components/DeleteConfirmation'
import { ErrorModal } from '@/components/ErrorModal'
import { FilterSection } from '@/components/FilterSection'
import { AddIcon, CancelIcon, CheckIcon, DollarIcon, DownloadIcon, EditIcon, SearchIcon, TrashBinIcon, ViewIcon, WarningIcon } from '@/components/Icons'
import { Loader } from '@/components/Loader'
import { Modal } from '@/components/Modal'
import { PageHeader } from '@/components/PageHeader'
import { RequiredSpan } from '@/components/RequiredSpan'
import { SaleDetailsSection } from '@/components/SaleDetailsSection'
import { Separator } from '@/components/Separator'
import { StatusBadge } from '@/components/StatusBadge'
import { TestStatePanel } from '@/components/TestStatePanel'

import '@/styles/DetailsTable.css'

import API_ENDPOINTS from '@/services/api'
import { parseLocalDate } from '@/services/dateUtils'
import trunc from '@/services/trunc'

const ENVIRONMENT = import.meta.env.VITE_ENV || 'production'

const API_URL = `${API_ENDPOINTS.sales}/`
const API_DISHES_URL = API_ENDPOINTS.dishes

const initialFilters = {
  customer: '',
  startDate: '',
  endDate: '',
  status: ''
}

const statusOptions = [
  { value: 'Completed', label: 'Completada' },
  { value: 'Cancelled', label: 'Cancelada' }
]

const initialFormErrors = {
  saleDate: '',
  customer: '',
  status: '',
  details: ''
}

export function Sales () {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [filters, setFilters] = useState(initialFilters)
  const [filterErrors, setFilterErrors] = useState({ startDate: '', endDate: '' })

  const [selectedSale, setSelectedSale] = useState(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('view')
  const [modalLoading, setModalLoading] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(null)
  const [modalError, setModalError] = useState(null)

  const [formErrors, setFormErrors] = useState(initialFormErrors)

  const [saleDetails, setSaleDetails] = useState([])
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [dishes, setDishes] = useState([])
  const [dishesLoading, setDishesLoading] = useState(true)

  const filterFields = [
    {
      type: 'text',
      name: 'customer',
      label: 'Cliente',
      placeholder: 'Buscar por nombre del cliente'
    },
    {
      type: 'date',
      name: 'startDate',
      label: 'Fecha Inicial',
      placeholder: 'Seleccionar fecha de inicio'
    },
    {
      type: 'date',
      name: 'endDate',
      label: 'Fecha Final',
      placeholder: 'Seleccionar fecha de fin'
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
      key: 'saleDate',
      label: 'Fecha',
      align: 'center',
      render: (row) => {
        const date = parseLocalDate(row.saleDate)
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
      }
    },
    {
      key: 'customer',
      label: 'Cliente',
      ellipsis: true,
      render: (row) => row.customer || '-'
    },
    {
      key: 'total',
      label: 'Total',
      align: 'center',
      render: (row) => (
        <div className='price-cell'>
          <span>S/. {row.total.toFixed(2)}</span>
        </div>
      )
    },
    {
      key: 'notes',
      label: 'Notas',
      ellipsis: true,
      render: (row) => row.notes || '-'
    },
    {
      key: 'status',
      label: 'Estado',
      align: 'center',
      render: (row) => {
        const statusLabels = {
          Completed: 'Completada',
          Cancelled: 'Cancelada'
        }
        return (
          <StatusBadge
            status={row.status}
            activeLabel={statusLabels[row.status] || row.status}
            inactiveLabel={statusLabels[row.status] || row.status}
          />
        )
      }
    }
  ]

  const tableActions = [
    {
      label: 'Ver',
      icon: <ViewIcon />,
      variant: 'view',
      iconOnly: true,
      onClick: (row) => handleSaleSelect(row, 'view')
    },
    {
      label: 'Editar',
      icon: <EditIcon />,
      variant: 'edit',
      iconOnly: true,
      onClick: (row) => handleSaleSelect(row, 'edit')
    },
    {
      label: 'Eliminar',
      icon: <TrashBinIcon />,
      variant: 'delete',
      iconOnly: true,
      onClick: (row) => handleSaleSelect(row, 'delete')
    }
  ]

  const debouncedCustomer = useDebounce(filters.customer, 500)

  const handleFilterChange = (e) => {
    const { name, value } = e.target

    setFilters((prev) => ({ ...prev, [name]: value }))

    if (name === 'startDate' || name === 'endDate') {
      const currentFilters = { ...filters, [name]: value }
      const startDate = currentFilters.startDate
      const endDate = currentFilters.endDate

      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        if (name === 'startDate') {
          setFilterErrors({ startDate: 'La fecha inicial no puede ser mayor a la final', endDate: '' })
        } else {
          setFilterErrors({ startDate: '', endDate: 'La fecha final no puede ser menor a la inicial' })
        }
      } else {
        setFilterErrors({ startDate: '', endDate: '' })
      }
    }
  }

  const handleClearFilters = () => {
    setFilters(initialFilters)
    setFilterErrors({ startDate: '', endDate: '' })
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== '')

  const buildURL = useMemo(() => {
    const url = new URL(API_URL)
    url.searchParams.set('page', page)
    url.searchParams.set('pageSize', pageSize)

    if (debouncedCustomer) url.searchParams.set('customer', debouncedCustomer.trim())
    if (filters.startDate && !filterErrors.startDate) url.searchParams.set('startDate', filters.startDate)
    if (filters.endDate && !filterErrors.endDate) url.searchParams.set('endDate', filters.endDate)
    if (filters.status) url.searchParams.set('status', filters.status)

    return url.toString()
  }, [page, pageSize, debouncedCustomer, filters.startDate, filters.endDate, filters.status, filterErrors])

  const { data, loading, setLoading, error, setError, refetch } = useFetch(buildURL)

  const { data: sales, meta } = data || {}

  useEffect(() => {
    const fetchAllDishes = async () => {
      setDishesLoading(true)
      try {
        let allFetchedDishes = []
        let currentPage = 1
        let hasNextPage = true

        while (hasNextPage) {
          const response = await fetch(`${API_DISHES_URL}?page=${currentPage}&pageSize=100&status=Active`)
          const result = await response.json()

          if (result.success && result.data) {
            allFetchedDishes = [...allFetchedDishes, ...result.data]
            hasNextPage = result.meta?.pagination?.hasNextPage || false
            currentPage++
          } else {
            break
          }
        }

        allFetchedDishes.sort((a, b) => a.name.localeCompare(b.name))
        setDishes(allFetchedDishes)
      } catch (error) {
        console.error('Error fetching dishes:', error)
      } finally {
        setDishesLoading(false)
      }
    }

    fetchAllDishes()
  }, [])

  useEffect(() => {
    if (error && error.status === 400 && page > 1) {
      setError(null)
      setPage(1)
    }
  }, [error, page, setError])

  const handleChange = (e) => {
    const { name, value } = e.target
    setSelectedSale((prev) => ({ ...prev, [name]: value }))

    if (modalMode === 'edit' || modalMode === 'create') {
      if (name === 'status') {
        if (value === '') {
          setFormErrors((prev) => ({ ...prev, status: 'El estado es obligatorio' }))
        } else {
          setFormErrors((prev) => ({ ...prev, status: '' }))
        }
      }
    }
  }

  const handleSaleSelect = async (sale, mode) => {
    const saleWithFormattedDate = {
      ...sale,
      saleDate: sale.saleDate ? sale.saleDate.split('T')[0] : ''
    }
    setSelectedSale(saleWithFormattedDate)
    setModalMode(mode)
    setIsModalOpen(true)

    if (mode === 'view' || mode === 'edit' || mode === 'delete') {
      await fetchSaleDetails(sale.id)
    } else {
      setSaleDetails([])
    }
  }

  const fetchSaleDetails = async (saleId) => {
    setDetailsLoading(true)
    try {
      const response = await fetch(`${API_URL}${saleId}`)
      const result = await response.json()

      if (result.success && result.data) {
        const details = result.data.details || []
        const formattedDetails = details.map((item) => ({
          id: item.id,
          dish_id: item.dish.id,
          dishName: item.dish.name,
          quantity: item.quantity,
          unit_price: trunc(item.unitPrice.toString(), 2),
          discount: trunc(item.discount.toString(), 2),
          subtotal: trunc(item.subtotal.toString(), 2)
        }))
        setSaleDetails(formattedDetails)
      } else {
        setSaleDetails([])
      }
    } catch (error) {
      console.error('Error fetching sale details:', error)
      setSaleDetails([])
    } finally {
      setDetailsLoading(false)
    }
  }

  const handleCreateNew = () => {
    const today = new Date().toISOString().split('T')[0]
    setSelectedSale({
      saleDate: today,
      customer: '',
      notes: '',
      status: 'Completed'
    })
    setModalMode('create')
    setIsModalOpen(true)
    setSaleDetails([])
  }

  const handleExport = () => {
    console.log('Exportando datos de ventas...')
  }

  const handleCloseWithX = () => {
    setIsModalOpen(false)
    setModalSuccess(null)
    setModalError(null)
    setFormErrors(initialFormErrors)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setModalSuccess(null)
    setModalError(null)
    setFormErrors(initialFormErrors)
  }

  const handleCloseError = () => {
    setModalError(null)
  }

  const handleDetailChange = (newDetails) => {
    setSaleDetails(newDetails)
    setFormErrors((prev) => ({ ...prev, details: '' }))
  }

  const calculateTotal = () => {
    return saleDetails.reduce((sum, detail) => {
      return sum + (parseFloat(detail.subtotal) || 0)
    }, 0)
  }

  const validateDetailsBeforeSave = () => {
    if (saleDetails.length === 0) {
      setFormErrors((prev) => ({ ...prev, details: 'Debes agregar al menos un platillo' }))
      return false
    }

    const validDetails = saleDetails.filter(
      detail => detail.dish_id && detail.quantity > 0 && parseFloat(detail.unit_price) >= 0
    )

    if (validDetails.length === 0) {
      setFormErrors((prev) => ({
        ...prev,
        details: 'Debes agregar al menos un platillo válido'
      }))
      return false
    }

    const hasIncompleteDetails = saleDetails.some(
      detail => (detail.dish_id || detail.quantity || detail.unit_price) &&
               (!detail.dish_id || !detail.quantity || detail.quantity < 1 || !detail.unit_price || parseFloat(detail.unit_price) < 0)
    )

    if (hasIncompleteDetails) {
      setFormErrors((prev) => ({
        ...prev,
        details: 'Todos los platillos deben tener datos completos y válidos'
      }))
      return false
    }

    const dishIds = validDetails.map(detail => detail.dish_id)
    const hasDuplicates = dishIds.length !== new Set(dishIds).size

    if (hasDuplicates) {
      setFormErrors((prev) => ({
        ...prev,
        details: 'No puedes agregar el mismo platillo más de una vez'
      }))
      return false
    }

    const hasInvalidSubtotal = validDetails.some(detail => parseFloat(detail.subtotal) <= 0)
    if (hasInvalidSubtotal) {
      setFormErrors((prev) => ({
        ...prev,
        details: 'Todos los subtotales deben ser mayores a 0'
      }))
      return false
    }

    const total = calculateTotal()
    if (total <= 0) {
      setFormErrors((prev) => ({
        ...prev,
        details: 'El total de la venta debe ser mayor a 0'
      }))
      return false
    }

    setFormErrors((prev) => ({ ...prev, details: '' }))
    return true
  }

  const validateFormBeforeSave = () => {
    const errors = {}
    let isValid = true

    if (!selectedSale.status) {
      errors.status = 'El estado es obligatorio'
      isValid = false
    }

    setFormErrors((prev) => ({ ...prev, ...errors }))
    return isValid
  }

  const handleSave = async () => {
    setModalLoading(true)

    if (!validateFormBeforeSave()) {
      setModalLoading(false)
      return
    }

    if (modalMode === 'edit') {
      const saleData = {
        saleDate: selectedSale.saleDate,
        customer: selectedSale.customer || null,
        notes: selectedSale.notes || null,
        status: selectedSale.status
      }

      fetch(`${API_URL}${selectedSale.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(saleData)
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then(err => {
              throw new Error(err.message || 'Error al actualizar la venta')
            })
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
          setModalError(`Error al actualizar la venta: ${error.message}`)
        })
      return
    }

    if (!validateDetailsBeforeSave()) {
      setModalLoading(false)
      return
    }

    const validDetails = saleDetails.filter(
      detail => detail.dish_id && detail.quantity > 0 && parseFloat(detail.unit_price) >= 0
    )

    const saleData = {
      saleDate: selectedSale.saleDate,
      customer: selectedSale.customer || null,
      notes: selectedSale.notes || null,
      status: selectedSale.status,
      details: validDetails.map(detail => ({
        dishId: parseInt(detail.dish_id),
        quantity: parseInt(detail.quantity),
        unitPrice: parseFloat(detail.unit_price),
        discount: parseFloat(detail.discount) || 0
      }))
    }

    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(saleData)
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(err.message || 'Error al crear la venta')
          })
        }
        return response.json()
      })
      .then(() => {
        refetch()
        setModalSuccess('create')
        setTimeout(() => {
          setIsModalOpen(false)
        }, 1500)
      })
      .catch((error) => {
        console.error('Error:', error)
        setModalLoading(false)
        setModalError(`Error al crear la venta: ${error.message}`)
      })
  }

  const handleDelete = () => {
    setModalLoading(true)

    const saleId = selectedSale.id

    fetch(`${API_URL}${saleId}`, {
      method: 'DELETE'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al eliminar la venta')
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
        setModalError(`Error al eliminar la venta: ${error.message}`)
      })
  }

  const handleAnimationEnd = () => {
    setSelectedSale(null)
    setFormErrors(initialFormErrors)
    setModalLoading(false)
    setModalSuccess(null)
    setModalError(null)
    setSaleDetails([])
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
        title='Gestión de Ventas'
        description='Administra las ventas de platillos aquí.'
        actions={[
          {
            label: 'Agregar Venta',
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
        title='Filtrar Ventas'
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
          title='Lista de Ventas'
          icon={DollarIcon}
          columns={tableColumns}
          data={sales}
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
          refreshLabel='Recargar Ventas'
          itemName='venta'
          itemNamePlural='ventas'
          emptyIcon={DollarIcon}
          emptyMessage='No se encontraron ventas'
          emptyDescription='Intenta ajustar los filtros o crear una nueva venta'
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
                  {modalMode === 'view' && 'Ver Venta'}
                  {modalMode === 'edit' && 'Editar Venta'}
                  {modalMode === 'delete' && 'Eliminar Venta'}
                  {modalMode === 'create' && 'Crear Venta'}
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
                        {modalSuccess === 'create' && <span>¡Venta creada exitosamente!</span>}
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
                              ? 'Creando venta...'
                              : 'Guardando cambios...'
                        }
                      />
                      )}
                </div>
              )}
              {modalError && (
                <ErrorModal message={modalError} onClose={handleCloseError} />
              )}
              {modalMode === 'delete' && (
                <DeleteConfirmation
                  title='¿Estás seguro de que deseas eliminar esta venta?'
                  description='Esta acción no se puede deshacer. La venta será eliminada permanentemente.'
                  details={[
                    {
                      label: 'Fecha',
                      value: selectedSale?.saleDate
                        ? parseLocalDate(selectedSale.saleDate).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })
                        : '-'
                    },
                    { label: 'Cliente', value: selectedSale?.customer || '-' },
                    { label: 'Total', value: `S/. ${selectedSale?.total?.toFixed(2)}` },
                    { label: 'Estado', value: selectedSale?.status === 'Completed' ? 'Completada' : 'Cancelada' }
                  ]}
                  detailsTable={
                    saleDetails.length === 0
                      ? (
                        <div className='details-loading'>
                          <Loader width={32} height={32} text='Cargando detalles...' />
                        </div>
                        )
                      : (
                        <div className='details-table-wrapper'>
                          <div className='details-table-scroll'>
                            <table className='details-table'>
                              <thead>
                                <tr>
                                  <th className='align-left'>Platillo</th>
                                  <th className='align-center col-quantity'>Cantidad</th>
                                  <th className='align-center col-price'>Precio Unit.</th>
                                  <th className='align-center col-discount'>Descuento</th>
                                  <th className='align-center col-subtotal'>Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {saleDetails.map((detail, index) => (
                                  <tr key={index}>
                                    <td className='align-left'>{detail.dishName}</td>
                                    <td className='align-center'>{detail.quantity}</td>
                                    <td className='align-center'>S/. {parseFloat(detail.unit_price).toFixed(2)}</td>
                                    <td className='align-center'>{parseFloat(detail.discount) === 0 ? '-' : `S/. ${parseFloat(detail.discount).toFixed(2)}`}</td>
                                    <td className='align-center subtotal'>S/. {parseFloat(detail.subtotal).toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        )
                  }
                />
              )}
              {(modalMode === 'view' || modalMode === 'edit' || modalMode === 'create') && (
                <div className='modal-input-group'>
                  <div className='input-group'>
                    <label htmlFor='modal-saleDate'>Fecha <RequiredSpan /></label>
                    <input
                      className={formErrors.saleDate ? 'input-error' : ''}
                      type='date'
                      id='modal-saleDate'
                      name='saleDate'
                      value={selectedSale?.saleDate || ''}
                      disabled={modalMode === 'view' || modalLoading}
                      onChange={handleChange}
                    />
                    <small className='info-error'>{formErrors.saleDate}</small>
                  </div>
                  <div className='input-group'>
                    <label htmlFor='modal-customer'>Cliente</label>
                    <input
                      className={formErrors.customer ? 'input-error' : ''}
                      type='text'
                      id='modal-customer'
                      name='customer'
                      placeholder='Público general'
                      value={selectedSale?.customer || ''}
                      disabled={modalMode === 'view' || modalLoading}
                      onChange={handleChange}
                    />
                    <small className='info-error'>{formErrors.customer}</small>
                  </div>
                  <div className='input-group'>
                    <label htmlFor='modal-notes'>Notas</label>
                    <textarea
                      className={formErrors.notes ? 'input-error' : ''}
                      id='modal-notes'
                      name='notes'
                      placeholder='Notas adicionales'
                      value={selectedSale?.notes || ''}
                      disabled={modalMode === 'view' || modalLoading}
                      onChange={handleChange}
                    />
                    <small className='info-error'>{formErrors.notes}</small>
                  </div>
                  <div className='input-group'>
                    <label htmlFor='modal-status'>Estado <RequiredSpan /></label>
                    <select
                      className={formErrors.status ? 'input-error' : ''}
                      name='status'
                      id='modal-status'
                      disabled={modalMode === 'view' || modalLoading}
                      value={selectedSale?.status || ''}
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

                  {(modalMode === 'view' || modalMode === 'edit') && (
                    <div className='input-group'>
                      <label>Platillos Vendidos</label>
                      {modalMode === 'edit' && (
                        <small style={{ display: 'block', marginBottom: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                          Nota: Los detalles de la venta no pueden modificarse. Para cambiar platillos, elimina y crea una nueva venta.
                        </small>
                      )}
                      {saleDetails.length === 0
                        ? (
                          <div className='details-loading with-margin'>
                            <Loader width={32} height={32} text='Cargando detalles...' />
                          </div>
                          )
                        : (
                          <div className='details-table-wrapper with-margin'>
                            <div className='details-table-scroll'>
                              <table className='details-table'>
                                <thead>
                                  <tr>
                                    <th className='align-left'>Platillo</th>
                                    <th className='align-center col-quantity'>Cantidad</th>
                                    <th className='align-center col-price'>Precio Unit.</th>
                                    <th className='align-center col-discount'>Descuento</th>
                                    <th className='align-center col-subtotal'>Subtotal</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {saleDetails.map((detail, index) => (
                                    <tr key={index}>
                                      <td className='align-left'>{detail.dishName || '-'}</td>
                                      <td className='align-center'>{detail.quantity}</td>
                                      <td className='align-center'>S/. {parseFloat(detail.unit_price).toFixed(2)}</td>
                                      <td className='align-center'>{parseFloat(detail.discount) === 0 ? '-' : `S/. ${parseFloat(detail.discount).toFixed(2)}`}</td>
                                      <td className='align-center subtotal'>S/. {parseFloat(detail.subtotal).toFixed(2)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          )}
                    </div>
                  )}

                  {modalMode === 'create' && (
                    <>
                      <SaleDetailsSection
                        details={saleDetails}
                        onDetailsChange={handleDetailChange}
                        availableDishes={dishes}
                        dishesLoading={dishesLoading}
                        detailsLoading={detailsLoading}
                        disabled={modalLoading}
                      />
                    </>
                  )}
                  {formErrors.details && modalMode === 'create' && (
                    <small className='info-error' style={{ display: 'block', marginTop: '-0.5rem' }}>
                      {formErrors.details}
                    </small>
                  )}

                  {modalMode === 'create' && (
                    <div style={{
                      marginTop: '0.75rem',
                      marginBottom: '0.75rem',
                      padding: '0.75rem',
                      background: '#fef3c7',
                      border: '1px solid #f59e0b',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      color: '#92400e',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    >
                      <WarningIcon width={28} height={28} color='#f59e0b' />
                      <span>
                        <strong>Importante:</strong> Una vez creada la venta, los detalles de los platillos no podrán ser modificados.
                      </span>
                    </div>
                  )}

                  <div className='input-group'>
                    <label
                      style={{
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        color: calculateTotal() <= 0 && saleDetails.some(d => d.dish_id && d.quantity && d.unit_price) ? '#dc2626' : 'inherit'
                      }}
                    >
                      Total: S/. {calculateTotal().toFixed(2)}
                    </label>
                    {calculateTotal() <= 0 && saleDetails.some(d => d.dish_id && d.quantity && d.unit_price) && (
                      <span style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        El total debe ser mayor a 0
                      </span>
                    )}
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
                  disabled={
                    modalLoading ||
                    Object.values(formErrors).some((error) => error !== '') ||
                    !selectedSale?.status ||
                    (modalMode === 'create' && (
                      saleDetails.length === 0 ||
                      saleDetails.filter(d => d.dish_id && d.quantity > 0).length === 0 ||
                      calculateTotal() <= 0 ||
                      saleDetails.some(d => d.dish_id && parseFloat(d.subtotal) <= 0)
                    ))
                  }
                >
                  <AddIcon />
                  {modalMode === 'create' ? 'Crear Venta' : 'Guardar Cambios'}
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
