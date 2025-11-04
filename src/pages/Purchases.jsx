import { useEffect, useMemo, useState } from 'react'

import { useFetch } from '@/hooks/useFetch'

import { Card, CardBody, CardFooter, CardHeader } from '@/components/Card'
import { DataTable } from '@/components/DataTable'
import { DeleteConfirmation } from '@/components/DeleteConfirmation'
import { ErrorModal } from '@/components/ErrorModal'
import { FilterSection } from '@/components/FilterSection'
import { AddIcon, CancelIcon, CheckIcon, DownloadIcon, EditIcon, SearchIcon, ShoppingCartIcon, TrashBinIcon, ViewIcon, WarningIcon } from '@/components/Icons'
import { Loader } from '@/components/Loader'
import { Modal } from '@/components/Modal'
import { PageHeader } from '@/components/PageHeader'
import { PurchaseDetailsSection } from '@/components/PurchaseDetailsSection'
import { RequiredSpan } from '@/components/RequiredSpan'
import { Separator } from '@/components/Separator'
import { StatusBadge } from '@/components/StatusBadge'
import { TestStatePanel } from '@/components/TestStatePanel'

import API_ENDPOINTS from '@/services/api'

import { parseLocalDate } from '@/services/dateUtils'
import trunc from '@/services/trunc'
import '@/styles/DetailsTable.css'

const ENVIRONMENT = import.meta.env.VITE_ENV || 'development'

const API_URL = `${API_ENDPOINTS.purchases}/`
const API_SUPPLIERS_URL = API_ENDPOINTS.suppliers
const API_INGREDIENTS_URL = API_ENDPOINTS.ingredients

const initialFilters = {
  supplierId: '',
  startDate: '',
  endDate: '',
  status: ''
}

const statusOptions = [
  { value: 'Completed', label: 'Completada' },
  { value: 'Cancelled', label: 'Cancelada' }
]

const initialFormErrors = {
  purchaseDate: '',
  supplierId: '',
  status: '',
  details: ''
}

export function Purchases () {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [filters, setFilters] = useState(initialFilters)
  const [filterErrors, setFilterErrors] = useState({ startDate: '', endDate: '' })

  const [selectedPurchase, setSelectedPurchase] = useState(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('view')
  const [modalLoading, setModalLoading] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(null)
  const [modalError, setModalError] = useState(null)

  const [formErrors, setFormErrors] = useState(initialFormErrors)

  const [purchaseDetails, setPurchaseDetails] = useState([])
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [suppliers, setSuppliers] = useState([])
  const [ingredients, setIngredients] = useState([])
  const [ingredientsLoading, setIngredientsLoading] = useState(true)

  const { data: suppliersData, loading: suppliersDataLoading } = useFetch(API_SUPPLIERS_URL)
  const suppliersList = suppliersData?.data || []

  const supplierOptions = suppliersList.map((supplier) => ({
    value: supplier.id,
    label: supplier.name
  }))

  const filterFields = [
    {
      type: 'select',
      name: 'supplierId',
      label: 'Proveedor',
      placeholder: 'Todos los Proveedores',
      options: supplierOptions,
      disabled: suppliersDataLoading
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
      key: 'purchaseDate',
      label: 'Fecha',
      align: 'center',
      render: (row) => {
        const date = parseLocalDate(row.purchaseDate)
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
      }
    },
    {
      key: 'supplier',
      label: 'Proveedor',
      ellipsis: true,
      render: (row) => row.supplier?.name || '-'
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
      onClick: (row) => handlePurchaseSelect(row, 'view')
    },
    {
      label: 'Editar',
      icon: <EditIcon />,
      variant: 'edit',
      iconOnly: true,
      onClick: (row) => handlePurchaseSelect(row, 'edit')
    },
    {
      label: 'Eliminar',
      icon: <TrashBinIcon />,
      variant: 'delete',
      iconOnly: true,
      onClick: (row) => handlePurchaseSelect(row, 'delete')
    }
  ]

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

    if (filters.supplierId) url.searchParams.set('supplierId', filters.supplierId)
    if (filters.startDate && !filterErrors.startDate) url.searchParams.set('startDate', filters.startDate)
    if (filters.endDate && !filterErrors.endDate) url.searchParams.set('endDate', filters.endDate)
    if (filters.status) url.searchParams.set('status', filters.status)

    return url.toString()
  }, [page, pageSize, filters.supplierId, filters.startDate, filters.endDate, filters.status, filterErrors])

  const { data, loading, setLoading, error, setError, refetch } = useFetch(buildURL)

  const { data: purchases, meta } = data || {}

  useEffect(() => {
    const fetchAllSuppliers = async () => {
      try {
        let allFetchedSuppliers = []
        let currentPage = 1
        let hasNextPage = true

        while (hasNextPage) {
          const response = await fetch(`${API_SUPPLIERS_URL}?page=${currentPage}&pageSize=100&status=Active`)
          const result = await response.json()

          if (result.success && result.data) {
            allFetchedSuppliers = [...allFetchedSuppliers, ...result.data]
            hasNextPage = result.meta?.pagination?.hasNextPage || false
            currentPage++
          } else {
            break
          }
        }

        allFetchedSuppliers.sort((a, b) => a.name.localeCompare(b.name))
        setSuppliers(allFetchedSuppliers)
      } catch (error) {
        console.error('Error fetching suppliers:', error)
      }
    }

    const fetchAllIngredients = async () => {
      setIngredientsLoading(true)
      try {
        let allFetchedIngredients = []
        let currentPage = 1
        let hasNextPage = true

        while (hasNextPage) {
          const response = await fetch(`${API_INGREDIENTS_URL}?page=${currentPage}&pageSize=100&status=Active`)
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
        setIngredients(allFetchedIngredients)
      } catch (error) {
        console.error('Error fetching ingredients:', error)
      } finally {
        setIngredientsLoading(false)
      }
    }

    fetchAllSuppliers()
    fetchAllIngredients()
  }, [])

  useEffect(() => {
    if (error && error.status === 400 && page > 1) {
      setError(null)
      setPage(1)
    }
  }, [error, page, setError])

  const handleChange = (e) => {
    const { name, value } = e.target
    setSelectedPurchase((prev) => ({ ...prev, [name]: value }))

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

  const handlePurchaseSelect = async (purchase, mode) => {
    const purchaseWithFormattedDate = {
      ...purchase,
      purchaseDate: purchase.purchaseDate ? purchase.purchaseDate.split('T')[0] : ''
    }
    setSelectedPurchase(purchaseWithFormattedDate)
    setModalMode(mode)
    setIsModalOpen(true)

    if (mode === 'view' || mode === 'edit' || mode === 'delete') {
      await fetchPurchaseDetails(purchase.id)
    } else {
      setPurchaseDetails([])
    }
  }

  const fetchPurchaseDetails = async (purchaseId) => {
    setDetailsLoading(true)
    try {
      const response = await fetch(`${API_URL}${purchaseId}`)
      const result = await response.json()

      if (result.success && result.data) {
        const details = result.data.details || []
        const formattedDetails = details.map((item) => ({
          id: item.id,
          ingredient_id: item.ingredient.id,
          ingredientName: item.ingredient.name,
          unit: item.ingredient.unit,
          quantity: trunc(item.quantity.toString(), 2),
          unit_price: trunc(item.unitPrice.toString(), 2),
          subtotal: trunc(item.subtotal.toString(), 2)
        }))
        setPurchaseDetails(formattedDetails)
      } else {
        setPurchaseDetails([])
      }
    } catch (error) {
      console.error('Error fetching purchase details:', error)
      setPurchaseDetails([])
    } finally {
      setDetailsLoading(false)
    }
  }

  const handleCreateNew = () => {
    const today = new Date().toISOString().split('T')[0]
    setSelectedPurchase({
      purchaseDate: today,
      supplierId: '',
      notes: '',
      status: 'Completed'
    })
    setModalMode('create')
    setIsModalOpen(true)
    setPurchaseDetails([])
  }

  const handleExport = () => {
    console.log('Exportando datos de compras...')
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

  const handleDetailChange = (newDetails) => {
    setPurchaseDetails(newDetails)
    setFormErrors((prev) => ({ ...prev, details: '' }))
  }

  const calculateTotal = () => {
    return purchaseDetails.reduce((sum, detail) => {
      return sum + (parseFloat(detail.subtotal) || 0)
    }, 0)
  }

  const validateDetailsBeforeSave = () => {
    if (purchaseDetails.length === 0) {
      setFormErrors((prev) => ({ ...prev, details: 'Debes agregar al menos un ingrediente' }))
      return false
    }

    const validDetails = purchaseDetails.filter(
      detail => detail.ingredient_id && parseFloat(detail.quantity) > 0 && parseFloat(detail.unit_price) >= 0
    )

    if (validDetails.length === 0) {
      setFormErrors((prev) => ({
        ...prev,
        details: 'Debes agregar al menos un ingrediente válido'
      }))
      return false
    }

    const hasIncompleteDetails = purchaseDetails.some(
      detail => (detail.ingredient_id || detail.quantity || detail.unit_price) &&
               (!detail.ingredient_id || !detail.quantity || parseFloat(detail.quantity) <= 0 || !detail.unit_price || parseFloat(detail.unit_price) < 0)
    )

    if (hasIncompleteDetails) {
      setFormErrors((prev) => ({
        ...prev,
        details: 'Todos los ingredientes deben tener datos completos y válidos'
      }))
      return false
    }

    const ingredientIds = validDetails.map(detail => detail.ingredient_id)
    const hasDuplicates = ingredientIds.length !== new Set(ingredientIds).size

    if (hasDuplicates) {
      setFormErrors((prev) => ({
        ...prev,
        details: 'No puedes agregar el mismo ingrediente más de una vez'
      }))
      return false
    }

    setFormErrors((prev) => ({ ...prev, details: '' }))
    return true
  }

  const validateFormBeforeSave = () => {
    const errors = {}
    let isValid = true

    if (!selectedPurchase.status) {
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
      const purchaseData = {
        purchaseDate: selectedPurchase.purchaseDate,
        supplierId: selectedPurchase.supplierId ? parseInt(selectedPurchase.supplierId) : null,
        notes: selectedPurchase.notes || null,
        status: selectedPurchase.status
      }

      fetch(`${API_URL}${selectedPurchase.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(purchaseData)
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then(err => {
              throw new Error(err.message || 'Error al actualizar la compra')
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
          setModalError(`Error al actualizar la compra: ${error.message}`)
        })
      return
    }

    if (!validateDetailsBeforeSave()) {
      setModalLoading(false)
      return
    }

    const validDetails = purchaseDetails.filter(
      detail => detail.ingredient_id && parseFloat(detail.quantity) > 0 && parseFloat(detail.unit_price) >= 0
    )

    const purchaseData = {
      purchaseDate: selectedPurchase.purchaseDate,
      supplierId: selectedPurchase.supplierId ? parseInt(selectedPurchase.supplierId) : null,
      notes: selectedPurchase.notes || null,
      status: selectedPurchase.status,
      details: validDetails.map(detail => ({
        ingredientId: parseInt(detail.ingredient_id),
        quantity: parseFloat(detail.quantity),
        unitPrice: parseFloat(detail.unit_price)
      }))
    }

    console.log('📦 Datos de compra a enviar (POST):', purchaseData)

    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(purchaseData)
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(err.message || 'Error al crear la compra')
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
        setModalError(`Error al crear la compra: ${error.message}`)
      })
  }

  const handleDelete = () => {
    setModalLoading(true)

    const purchaseId = selectedPurchase.id

    fetch(`${API_URL}${purchaseId}`, {
      method: 'DELETE'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al eliminar la compra')
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
        setModalError(`Error al eliminar la compra: ${error.message}`)
      })
  }

  const handleAnimationEnd = () => {
    setSelectedPurchase(null)
    setFormErrors(initialFormErrors)
    setModalLoading(false)
    setModalSuccess(null)
    setModalError(null)
    setPurchaseDetails([])
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
        title='Gestión de Compras'
        description='Administra las compras de ingredientes aquí.'
        actions={[
          {
            label: 'Agregar Compra',
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
        title='Filtrar Compras'
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
          title='Lista de Compras'
          icon={ShoppingCartIcon}
          columns={tableColumns}
          data={purchases}
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
          refreshLabel='Recargar Compras'
          itemName='compra'
          itemNamePlural='compras'
          emptyIcon={ShoppingCartIcon}
          emptyMessage='No se encontraron compras'
          emptyDescription='Intenta ajustar los filtros o crear una nueva compra'
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
                  {modalMode === 'view' && 'Ver Compra'}
                  {modalMode === 'edit' && 'Editar Compra'}
                  {modalMode === 'delete' && 'Eliminar Compra'}
                  {modalMode === 'create' && 'Crear Compra'}
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
                        {modalSuccess === 'create' && <span>¡Compra creada exitosamente!</span>}
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
                              ? 'Creando compra...'
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
                  title='¿Estás seguro de que deseas eliminar esta compra?'
                  description='Esta acción no se puede deshacer. La compra será eliminada permanentemente.'
                  details={[
                    {
                      label: 'Fecha',
                      value: selectedPurchase?.purchaseDate
                        ? parseLocalDate(selectedPurchase.purchaseDate).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })
                        : '-'
                    },
                    { label: 'Proveedor', value: selectedPurchase?.supplier?.name || '-' },
                    { label: 'Total', value: `S/. ${selectedPurchase?.total?.toFixed(2)}` },
                    { label: 'Estado', value: selectedPurchase?.status === 'Completed' ? 'Completada' : 'Cancelada' }
                  ]}
                  detailsTable={
                    purchaseDetails.length === 0
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
                                  <th className='align-left'>Ingrediente</th>
                                  <th className='align-center col-quantity'>Cantidad</th>
                                  <th className='align-center col-price'>Precio Unit.</th>
                                  <th className='align-center col-subtotal'>Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {purchaseDetails.map((detail, index) => (
                                  <tr key={index}>
                                    <td className='align-left'>{detail.ingredientName} ({detail.unit})</td>
                                    <td className='align-center'>{parseFloat(detail.quantity).toFixed(2)} {detail.unit}</td>
                                    <td className='align-center'>S/. {parseFloat(detail.unit_price).toFixed(2)}</td>
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
                    <label htmlFor='modal-purchaseDate'>Fecha <RequiredSpan /></label>
                    <input
                      className={formErrors.purchaseDate ? 'input-error' : ''}
                      type='date'
                      id='modal-purchaseDate'
                      name='purchaseDate'
                      value={selectedPurchase?.purchaseDate || ''}
                      disabled={modalMode === 'view' || modalLoading}
                      onChange={handleChange}
                    />
                    <small className='info-error'>{formErrors.purchaseDate}</small>
                  </div>
                  <div className='input-group'>
                    <label htmlFor='modal-supplierId'>Proveedor</label>
                    <select
                      className={formErrors.supplierId ? 'input-error' : ''}
                      name='supplierId'
                      id='modal-supplierId'
                      disabled={modalMode === 'view' || modalLoading}
                      value={selectedPurchase?.supplierId || selectedPurchase?.supplier?.id || ''}
                      onChange={handleChange}
                    >
                      <option value=''>Ninguno</option>
                      {suppliers.map((supplier) => (
                        <option
                          key={supplier.id}
                          value={supplier.id}
                        >
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                    <small className='info-error'>{formErrors.supplierId}</small>
                  </div>
                  <div className='input-group'>
                    <label htmlFor='modal-notes'>Notas</label>
                    <textarea
                      className={formErrors.notes ? 'input-error' : ''}
                      id='modal-notes'
                      name='notes'
                      placeholder='Notas adicionales'
                      value={selectedPurchase?.notes || ''}
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
                      value={selectedPurchase?.status || ''}
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
                      <label>Ingredientes Comprados</label>
                      {modalMode === 'edit' && (
                        <small style={{ display: 'block', marginBottom: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                          Nota: Los detalles de la compra no pueden modificarse. Para cambiar ingredientes, elimina y crea una nueva compra.
                        </small>
                      )}
                      {purchaseDetails.length === 0
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
                                    <th className='align-left'>Ingrediente</th>
                                    <th className='align-center col-quantity'>Cantidad</th>
                                    <th className='align-center col-price'>Precio Unit.</th>
                                    <th className='align-center col-subtotal'>Subtotal</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {purchaseDetails.map((detail, index) => {
                                    const ingredient = ingredients.find(i => i.id === parseInt(detail.ingredient_id))
                                    return (
                                      <tr key={index}>
                                        <td className='align-left'>
                                          {ingredient ? `${ingredient.name} (${ingredient.unit})` : detail.ingredientName || 'Ingrediente no encontrado'}
                                        </td>
                                        <td className='align-center'>{parseFloat(detail.quantity).toFixed(2)} {detail.unit}</td>
                                        <td className='align-center'>S/. {parseFloat(detail.unit_price).toFixed(2)}</td>
                                        <td className='align-center subtotal'>S/. {detail.subtotal || '0.00'}</td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          )}
                    </div>
                  )}

                  {modalMode === 'create' && (
                    <>
                      <PurchaseDetailsSection
                        details={purchaseDetails}
                        onDetailsChange={handleDetailChange}
                        availableIngredients={ingredients}
                        ingredientsLoading={ingredientsLoading}
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
                        <strong>Importante:</strong> Una vez creada la compra, los detalles de los ingredientes no podrán ser modificados.
                      </span>
                    </div>
                  )}

                  <div className='input-group'>
                    <label style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Total: S/. {calculateTotal().toFixed(2)}</label>
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
                    !selectedPurchase?.status ||
                    (modalMode === 'create' && (
                      purchaseDetails.length === 0 ||
                      purchaseDetails.filter(d => d.ingredient_id && parseFloat(d.quantity) > 0).length === 0
                    ))
                  }
                >
                  <AddIcon />
                  {modalMode === 'create' ? 'Crear Compra' : 'Guardar Cambios'}
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
