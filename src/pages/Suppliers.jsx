import { useEffect, useMemo, useRef, useState } from 'react'

import { useDebounce } from '@/hooks/useDebounce'
import { useFetch } from '@/hooks/useFetch'

import { Card, CardBody, CardFooter, CardHeader } from '@/components/Card'
import { DataTable } from '@/components/DataTable'
import { DeleteConfirmation } from '@/components/DeleteConfirmation'
import { ErrorModal } from '@/components/ErrorModal'
import { FilterSection } from '@/components/FilterSection'
import { AddIcon, CancelIcon, CheckIcon, DownloadIcon, EditIcon, SearchIcon, TrashBinIcon, TruckIcon, ViewIcon } from '@/components/Icons'
import { Loader } from '@/components/Loader'
import { Modal } from '@/components/Modal'
import { PageHeader } from '@/components/PageHeader'
import { RequiredSpan } from '@/components/RequiredSpan'
import { Separator } from '@/components/Separator'
import { StatusBadge } from '@/components/StatusBadge'
import { TestStatePanel } from '@/components/TestStatePanel'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

import API_ENDPOINTS from '@/services/api'
import { exportToCSV, exportToExcel, exportToPDF } from '@/services/exportUtils'
import { removeExtraSpaces } from '@/services/normalize'

const ENVIRONMENT = import.meta.env.VITE_ENV || 'production'

const API_URL = `${API_ENDPOINTS.suppliers}/`

const initialFilters = {
  search: '',
  status: ''
}

const statusOptions = [
  { value: 'Active', label: 'Activo' },
  { value: 'Inactive', label: 'Inactivo' }
]

const initialFormErrors = {
  name: '',
  ruc: '',
  phone: '',
  email: '',
  address: '',
  contactPerson: '',
  status: ''
}

const formatDescriptions = {
  csv: 'Recomendado para Hojas de Cálculo (Excel, Google Sheets).',
  excel: 'Formato nativo .xlsx de Microsoft Excel.',
  pdf: 'Documento no editable, ideal para imprimir o archivar.'
}

export function Suppliers () {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [filters, setFilters] = useState(initialFilters)

  const [selectedSupplier, setSelectedSupplier] = useState(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('view')
  const [modalLoading, setModalLoading] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(null)
  const [modalError, setModalError] = useState(null)

  const [formErrors, setFormErrors] = useState(initialFormErrors)

  const errorModalRef = useRef(null)
  const modalRef = useRef(null)
  const exportModalRef = useRef(null)

  const [isExporting, setIsExporting] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [exportScope, setExportScope] = useState('filtered')
  const [exportFormat, setExportFormat] = useState('csv')
  const [exportSuccess, setExportSuccess] = useState(false)

  const filterFields = [
    {
      type: 'text',
      name: 'search',
      label: 'Buscar',
      placeholder: 'Buscar por nombre, RUC o contacto'
    },
    {
      type: 'select',
      name: 'status',
      label: 'Estado',
      placeholder: 'Todos los Estados',
      options: [
        { label: null, items: [{ label: 'Todos los Estados', value: '' }] },
        { label: 'Estados', items: statusOptions.map(o => ({ label: o.label, value: o.value })) }
      ]
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
      key: 'ruc',
      label: 'RUC',
      align: 'center',
      render: (row) => row.ruc || '-'
    },
    {
      key: 'contactPerson',
      label: 'Persona de Contacto',
      ellipsis: true,
      render: (row) => row.contactPerson || '-'
    },
    {
      key: 'phone',
      label: 'Teléfono',
      align: 'center',
      render: (row) => row.phone || '-'
    },
    {
      key: 'email',
      label: 'Email',
      ellipsis: true,
      render: (row) => row.email || '-'
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
      onClick: (row) => handleSupplierSelect(row, 'view')
    },
    {
      label: 'Editar',
      icon: <EditIcon />,
      variant: 'edit',
      iconOnly: true,
      onClick: (row) => handleSupplierSelect(row, 'edit')
    },
    {
      label: 'Eliminar',
      icon: <TrashBinIcon />,
      variant: 'delete',
      iconOnly: true,
      onClick: (row) => handleSupplierSelect(row, 'delete')
    }
  ]

  const debouncedSearch = useDebounce(filters.search, 500)

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

    if (debouncedSearch) url.searchParams.set('search', debouncedSearch.trim().toLowerCase())
    if (filters.status) url.searchParams.set('status', filters.status)

    return url.toString()
  }, [page, pageSize, debouncedSearch, filters.status])

  const filteredBaseUrl = useMemo(() => {
    const url = new URL(API_URL)
    if (debouncedSearch) url.searchParams.set('search', debouncedSearch.trim().toLowerCase())
    if (filters.status) url.searchParams.set('status', filters.status)
    return url.toString()
  }, [debouncedSearch, filters.status])

  const fetchAllPaginatedData = async (baseUrl) => {
    let allFetchedData = []
    let currentPage = 1
    let hasNextPage = true
    const pageSize = 100
    const separator = baseUrl.includes('?') ? '&' : '?'

    try {
      while (hasNextPage) {
        const response = await fetch(`${baseUrl}${separator}page=${currentPage}&pageSize=${pageSize}`)
        const result = await response.json()
        if (result.success && result.data && result.data.length > 0) {
          allFetchedData = [...allFetchedData, ...result.data]
          hasNextPage = result.meta?.pagination?.hasNextPage || false
          currentPage++
        } else {
          break
        }
      }
      return allFetchedData
    } catch (error) {
      console.error('Error durante el fetch paginado:', error)
      throw new Error('Error al obtener los datos para la exportación.')
    }
  }

  const { data, loading, setLoading, error, setError, refetch } = useFetch(buildURL)

  const { data: suppliers, meta } = data || {}

  useEffect(() => {
    if (error && error.status === 400 && page > 1) {
      setError(null)
      setPage(1)
    }
  }, [error, page, setError])

  const handleChange = (e) => {
    const { name, value } = e.target
    setSelectedSupplier((prev) => ({ ...prev, [name]: value }))

    if (modalMode === 'edit' || modalMode === 'create') {
      if (name === 'name') {
        if (value.trim() === '') {
          setFormErrors((prev) => ({ ...prev, name: 'El nombre es obligatorio' }))
        } else {
          setFormErrors((prev) => ({ ...prev, name: '' }))
        }
      }

      if (name === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          setFormErrors((prev) => ({ ...prev, email: 'Email inválido' }))
        } else {
          setFormErrors((prev) => ({ ...prev, email: '' }))
        }
      } else if (name === 'email') {
        setFormErrors((prev) => ({ ...prev, email: '' }))
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

  const handleSupplierSelect = (supplier, mode) => {
    setSelectedSupplier(supplier)
    setModalMode(mode)
    setIsModalOpen(true)
  }

  const handleCreateNew = () => {
    setSelectedSupplier({
      name: '',
      ruc: '',
      phone: '',
      email: '',
      address: '',
      contactPerson: '',
      status: 'Active'
    })
    setModalMode('create')
    setIsModalOpen(true)
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

  const prepareDataForExport = (allSuppliers) => {
    const headers = [
      'ID',
      'Nombre',
      'RUC',
      'Contacto',
      'Teléfono',
      'Email',
      'Estado'
    ]
    const data = (allSuppliers || []).map(s => [
      s.id,
      s.name || '-',
      s.ruc || '-',
      s.contactPerson || '-',
      s.phone || '-',
      s.email || '-',
      s.status === 'Active' ? 'Activo' : 'Inactivo'
    ])
    return { headers, data }
  }

  const handleConfirmExport = async () => {
    setIsExporting(true)

    try {
      const baseUrl = exportScope === 'filtered' ? filteredBaseUrl : API_URL
      const allSuppliers = await fetchAllPaginatedData(baseUrl)

      if (!allSuppliers || allSuppliers.length === 0) {
        console.warn('No se encontraron datos para exportar.')
        return
      }

      allSuppliers.sort((a, b) => a.name.localeCompare(b.name))
      const { headers, data } = prepareDataForExport(allSuppliers)

      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `reporte-proveedores-${timestamp}`

      if (exportFormat === 'csv') {
        exportToCSV(headers, data, `${filename}.csv`)
      } else if (exportFormat === 'excel') {
        exportToExcel(headers, data, `${filename}.xlsx`, 'Proveedores')
      } else if (exportFormat === 'pdf') {
        exportToPDF(headers, data, `${filename}.pdf`, 'Reporte de Proveedores')
      }

      setExportSuccess(true)

      setTimeout(() => {
        setIsExportModalOpen(false) //
      }, 1500)

      setTimeout(() => {
        setExportSuccess(false)
        setIsExporting(false)
      }, 2000)
    } catch (error) {
      console.error('Error al exportar:', error)
      setIsExporting(false)
    }
  }

  const handleSave = () => {
    setModalLoading(true)

    const supplierData = {
      name: removeExtraSpaces(selectedSupplier.name).trim(),
      ruc: removeExtraSpaces(selectedSupplier.ruc).trim() || null,
      phone: removeExtraSpaces(selectedSupplier.phone).trim() || null,
      email: removeExtraSpaces(selectedSupplier.email).trim() || null,
      address: removeExtraSpaces(selectedSupplier.address).trim() || null,
      contactPerson: removeExtraSpaces(selectedSupplier.contactPerson).trim() || null,
      status: selectedSupplier.status
    }

    const url = modalMode === 'create' ? API_URL : `${API_URL}${selectedSupplier.id}`
    const method = modalMode === 'create' ? 'POST' : 'PATCH'

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(supplierData)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al ${modalMode === 'create' ? 'crear' : 'actualizar'} el proveedor`)
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
        setModalError(`Error al ${modalMode === 'create' ? 'crear' : 'actualizar'} el proveedor: ${error.message}`)
      })
  }

  const handleDelete = () => {
    setModalLoading(true)

    fetch(`${API_URL}${selectedSupplier.id}`, {
      method: 'DELETE'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al eliminar el proveedor')
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
        setModalError(`Error al eliminar el proveedor: ${error.message}`)
      })
  }

  const handleAnimationEnd = () => {
    setSelectedSupplier(null)
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
        title='Gestión de Proveedores'
        description='Administra tus proveedores aquí.'
        actions={[
          {
            label: 'Agregar Proveedor',
            icon: <AddIcon />,
            variant: 'primary',
            onClick: handleCreateNew,
            disabled: loading || error
          },
          {
            label: isExporting ? 'Exportando...' : 'Exportar Datos',
            icon: <DownloadIcon />,
            variant: 'secondary',
            onClick: () => setIsExportModalOpen(true),
            disabled: loading || error || isExporting || !suppliers || suppliers.length === 0
          }
        ]}
      />

      <Separator />

      <FilterSection
        title='Filtrar Proveedores'
        icon={SearchIcon}
        fields={filterFields}
        values={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <Separator />

      <section>
        <DataTable
          title='Lista de Proveedores'
          icon={TruckIcon}
          columns={tableColumns}
          data={suppliers}
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
          refreshLabel='Recargar Proveedores'
          itemName='proveedor'
          itemNamePlural='proveedores'
          emptyIcon={TruckIcon}
          emptyMessage='No se encontraron proveedores'
          emptyDescription='Intenta ajustar los filtros o crear un nuevo proveedor'
          actions={tableActions}
        />
      </section>

      <Modal
        ref={modalRef}
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
                  {modalMode === 'view' && 'Ver Proveedor'}
                  {modalMode === 'edit' && 'Editar Proveedor'}
                  {modalMode === 'delete' && 'Eliminar Proveedor'}
                  {modalMode === 'create' && 'Crear Proveedor'}
                </h3>
              </div>
              <Button type='button' className='modal-close-button no-transform' onClick={handleCloseWithX}>
                <CancelIcon />
              </Button>
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
                        {modalSuccess === 'create' && <span>¡Proveedor creado exitosamente!</span>}
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
                              ? 'Creando proveedor...'
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
              {modalMode === 'delete'
                ? (
                  <DeleteConfirmation
                    title='¿Estás seguro de que deseas eliminar este proveedor?'
                    description='Esta acción no se puede deshacer. El proveedor será eliminado permanentemente.'
                    details={[
                      { label: 'Nombre', value: selectedSupplier?.name },
                      { label: 'RUC', value: selectedSupplier?.ruc || '-' },
                      { label: 'Contacto', value: selectedSupplier?.contactPerson || '-' },
                      { label: 'Teléfono', value: selectedSupplier?.phone || '-' },
                      { label: 'Estado', value: selectedSupplier?.status === 'Active' ? 'Activo' : 'Inactivo' }
                    ]}
                  />
                  )
                : (
                  <div className='modal-input-group'>
                    <div className='input-group'>
                      <label htmlFor='modal-name'>Nombre <RequiredSpan /></label>
                      <Input
                        className={formErrors.name ? 'input-error' : ''}
                        type='text'
                        id='modal-name'
                        name='name'
                        placeholder='Ingrese el nombre del proveedor'
                        value={selectedSupplier?.name || ''}
                        disabled={modalMode === 'view' || modalLoading}
                        onChange={handleChange}
                      />
                      <small className='info-error'>{formErrors.name}</small>
                    </div>
                    <div className='input-group'>
                      <label htmlFor='modal-ruc'>RUC</label>
                      <Input
                        className={formErrors.ruc ? 'input-error' : ''}
                        type='text'
                        id='modal-ruc'
                        name='ruc'
                        placeholder='Ingrese el RUC (opcional)'
                        maxLength={20}
                        value={selectedSupplier?.ruc || ''}
                        disabled={modalMode === 'view' || modalLoading}
                        onChange={handleChange}
                      />
                      <small className='info-error'>{formErrors.ruc}</small>
                    </div>
                    <div className='input-group'>
                      <label htmlFor='modal-contactPerson'>Persona de Contacto</label>
                      <Input
                        className={formErrors.contactPerson ? 'input-error' : ''}
                        type='text'
                        id='modal-contactPerson'
                        name='contactPerson'
                        placeholder='Ingrese el nombre de la persona de contacto'
                        maxLength={100}
                        value={selectedSupplier?.contactPerson || ''}
                        disabled={modalMode === 'view' || modalLoading}
                        onChange={handleChange}
                      />
                      <small className='info-error'>{formErrors.contactPerson}</small>
                    </div>
                    <div className='input-group'>
                      <label htmlFor='modal-phone'>Teléfono</label>
                      <Input
                        className={formErrors.phone ? 'input-error' : ''}
                        type='text'
                        id='modal-phone'
                        name='phone'
                        placeholder='Ingrese el teléfono'
                        maxLength={20}
                        value={selectedSupplier?.phone || ''}
                        disabled={modalMode === 'view' || modalLoading}
                        onChange={handleChange}
                      />
                      <small className='info-error'>{formErrors.phone}</small>
                    </div>
                    <div className='input-group'>
                      <label htmlFor='modal-email'>Email</label>
                      <Input
                        className={formErrors.email ? 'input-error' : ''}
                        type='email'
                        id='modal-email'
                        name='email'
                        placeholder='Ingrese el email'
                        value={selectedSupplier?.email || ''}
                        disabled={modalMode === 'view' || modalLoading}
                        onChange={handleChange}
                      />
                      <small className='info-error'>{formErrors.email}</small>
                    </div>
                    <div className='input-group'>
                      <label htmlFor='modal-address'>Dirección</label>
                      <textarea
                        className={formErrors.address ? 'input-error' : ''}
                        id='modal-address'
                        name='address'
                        placeholder='Ingrese la dirección'
                        maxLength={150}
                        value={selectedSupplier?.address || ''}
                        disabled={modalMode === 'view' || modalLoading}
                        onChange={handleChange}
                      />
                      <small className='info-error'>{formErrors.address}</small>
                    </div>
                    <div className='input-group'>
                      <label htmlFor='modal-status'>Estado <RequiredSpan /></label>
                      <Select
                        className={formErrors.status ? 'input-error' : ''}
                        name='status'
                        id='modal-status'
                        disabled={modalMode === 'view' || modalLoading}
                        value={String(selectedSupplier?.status || '')}
                        onChange={(val) => handleChange({ target: { name: 'status', value: val } })}
                        options={[{ label: 'Estados', items: statusOptions.map(o => ({ label: o.label, value: String(o.value) })) }]}
                        containerRef={modalRef}
                      />
                      <small className='info-error'>{formErrors.status}</small>
                    </div>
                  </div>
                  )}
            </CardBody>
            <CardFooter className='modal-footer'>
              <Button type='button' onClick={handleCancel} disabled={modalLoading}>
                <CancelIcon />
                Cancelar
              </Button>
              {modalMode === 'view' && (
                <Button type='button' className='edit' onClick={() => setModalMode('edit')} disabled={modalLoading}>
                  <EditIcon />
                  Editar
                </Button>
              )}
              {(modalMode === 'edit' || modalMode === 'create') && (
                <Button
                  type='button'
                  className='primary'
                  onClick={handleSave}
                  disabled={modalLoading || Object.values(formErrors).some((error) => error !== '') || !selectedSupplier?.name}
                >
                  <AddIcon />
                  {modalMode === 'create' ? 'Crear Proveedor' : 'Guardar Cambios'}
                </Button>
              )}
              {modalMode === 'delete' && (
                <Button type='button' className='delete' onClick={handleDelete} disabled={modalLoading}>
                  <TrashBinIcon />
                  Confirmar Eliminación
                </Button>
              )}
            </CardFooter>
          </Card>
        </form>
      </Modal>

      <Modal
        ref={exportModalRef}
        isOpen={isExportModalOpen}
        onAnimationEnd={() => {
          if (!isExportModalOpen) {
            setExportScope('filtered')
            setExportFormat('csv')
          }
        }}
      >
        <form action=''>
          <Card>
            <CardHeader>
              <div className='header-with-icon'>
                <DownloadIcon />
                <h3>Exportar Datos de Proveedores</h3>
              </div>
              <Button type='button' className='modal-close-button no-transform' onClick={() => setIsExportModalOpen(false)}>
                <CancelIcon />
              </Button>
            </CardHeader>
            <CardBody className='modal-body'>
              {isExporting && (
                <div className='modal-loading-overlay'>
                  {exportSuccess
                    ? (
                      <div className='modal-success-overlay'>
                        <CheckIcon width={40} height={40} color='#059669' />
                        <span>¡Exportación completada exitosamente!</span>
                      </div>
                      )
                    : (
                      <Loader width={32} height={32} text='Generando archivo... Esto puede tardar.' />
                      )}
                </div>
              )}
              <div className='modal-input-group'>
                <div className='input-group'>
                  <label htmlFor='modal-export-scope'>Datos a Exportar</label>
                  <Select
                    name='export-scope'
                    id='modal-export-scope'
                    disabled={isExporting}
                    value={exportScope}
                    onChange={(val) => setExportScope(val)}
                    containerRef={exportModalRef}
                    options={[
                      {
                        label: 'Alcance',
                        items: [
                          { label: 'Exportar vista actual (filtrada)', value: 'filtered' },
                          { label: 'Exportar todos los proveedores', value: 'all' }
                        ]
                      }
                    ]}
                  />
                  <small className='input-helper-text'>
                    {exportScope === 'filtered'
                      ? 'Se exportarán solo los proveedores que coincidan con tus filtros actuales.'
                      : 'Se exportarán todos los proveedores, ignorando los filtros.'}
                  </small>
                </div>
                <div className='input-group'>
                  <label htmlFor='modal-export-format'>Formato de Archivo</label>
                  <Select
                    name='export-format'
                    id='modal-export-format'
                    disabled={isExporting}
                    value={exportFormat}
                    onChange={(val) => setExportFormat(val)}
                    containerRef={exportModalRef}
                    options={[
                      {
                        label: 'Formato',
                        items: [
                          { label: 'CSV', value: 'csv' },
                          { label: 'Excel', value: 'excel' },
                          { label: 'PDF', value: 'pdf' }
                        ]
                      }
                    ]}
                  />
                  <small className='input-helper-text'>
                    {formatDescriptions[exportFormat]}
                  </small>
                </div>
              </div>
            </CardBody>
            <CardFooter className='modal-footer'>
              <Button type='button' onClick={() => setIsExportModalOpen(false)} disabled={isExporting}>
                <CancelIcon />
                Cancelar
              </Button>
              <Button
                type='button'
                className='primary'
                onClick={handleConfirmExport}
                disabled={isExporting}
              >
                <DownloadIcon />
                {isExporting ? 'Generando...' : 'Confirmar Exportación'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Modal>
    </>
  )
}
