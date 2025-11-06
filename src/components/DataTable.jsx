import { Card, CardBody, CardFooter, CardHeader } from '@/components/Card'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { Loader } from '@/components/Loader'
import { Pagination } from '@/components/Pagination'
import { ResultsCounter } from '@/components/ResultsCounter'
import { TableControls } from '@/components/TableControls'

/**
 * Componente genérico para renderizar una tabla de datos paginada y con controles.
 * * Maneja estados de carga, error y vacío, y permite la personalización de columnas, acciones y renderizado de celdas.
 *
 * @param {Object} props - Objeto de propiedades del componente.
 * @param {string} [props.title='Lista'] - Título que se muestra en la cabecera de la tabla.
 * @param {React.ComponentType} [props.icon] - Componente de ícono para mostrar junto al título.
 * @param {Array<Object>} [props.columns=[]] - Array de objetos que definen las columnas de la tabla.
 * @param {Array<Object>} [props.data=[]] - Array de objetos que representan los datos de las filas.
 * @param {boolean} [props.loading=false] - Controla si se muestra el estado de carga.
 * @param {Object} [props.error=null] - Objeto de error para mostrar el estado de error.
 * @param {Object} [props.meta=null] - Metadatos de la respuesta de la API, usualmente para paginación.
 * @param {number} [props.page=1] - El número de la página actual.
 * @param {number} [props.pageSize=10] - La cantidad de elementos por página.
 * @param {function} props.onPageChange - Callback que se ejecuta cuando cambia la página.
 * @param {function} props.onPageSizeChange - Callback que se ejecuta cuando cambia el tamaño de la página.
 * @param {function} props.onRefresh - Callback que se ejecuta para recargar los datos.
 * @param {Array<number>} [props.pageSizeOptions=[5, 10, 20, 50]] - Opciones para el selector de tamaño de página.
 * @param {string} [props.refreshLabel='Recargar'] - Etiqueta para el botón de recargar.
 * @param {string} [props.itemName='elemento'] - Nombre del item en singular.
 * @param {string} [props.itemNamePlural='elementos'] - Nombre del item en plural.
 * @param {React.ComponentType} [props.emptyIcon] - Componente de ícono para el estado vacío.
 * @param {string} [props.emptyMessage='No se encontraron resultados'] - Mensaje para el estado vacío.
 * @param {string} [props.emptyDescription=''] - Descripción adicional para el estado vacío.
 * @param {Array<Object>} [props.actions=[]] - Array de objetos que definen las acciones por fila.
 * @param {function} [props.renderCell] - Función opcional para personalizar el renderizado de todas las celdas.
 *
 * @returns {React.ReactElement} El elemento JSX renderizado.
 */
export function DataTable ({
  title = 'Lista',
  icon: Icon,
  columns = [],
  data = [],
  loading = false,
  error = null,
  meta = null,
  page = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  onRefresh,
  pageSizeOptions = [5, 10, 20, 50],
  refreshLabel = 'Recargar',
  itemName = 'elemento',
  itemNamePlural = 'elementos',
  emptyIcon: EmptyIcon,
  emptyMessage = 'No se encontraron resultados',
  emptyDescription = '',
  actions = [],
  renderCell
}) {
  const renderCellContent = (row, column) => {
    if (renderCell) {
      return renderCell(row, column)
    }

    if (column.render) {
      return column.render(row)
    }

    const value = row[column.key]
    return value !== undefined && value !== null ? value : '-'
  }

  const renderActions = (row) => {
    if (actions.length === 0) return null

    return (
      <div className='button-group' style={{ justifyContent: 'center' }}>
        {actions.map((action, index) => (
          <button
            key={index}
            className={`${action.variant || 'primary'} ${action.iconOnly ? 'icon-only' : ''} no-transform`}
            onClick={() => action.onClick(row)}
            disabled={action.disabled?.(row) || false}
            title={action.label}
          >
            {action.icon}
            {!action.iconOnly && <span>{action.label}</span>}
          </button>
        ))}
      </div>
    )
  }

  return (
    <>
      <ResultsCounter
        loading={loading}
        error={error}
        items={data}
        meta={meta}
        pageSize={pageSize}
        icon={Icon}
        itemName={itemName}
        itemNamePlural={itemNamePlural}
      />

      <Card>
        <CardHeader>
          <TableControls
            title={title}
            icon={Icon}
            pageSize={pageSize}
            onPageSizeChange={(size) => {
              if (onPageSizeChange) {
                onPageSizeChange(size)
              }
            }}
            onRefresh={onRefresh}
            loading={loading}
            pageSizeOptions={pageSizeOptions}
            refreshLabel={refreshLabel}
          />
        </CardHeader>

        <CardBody className='no-padding'>
          <table>
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={column.key || index}
                    className={column.align === 'center' ? 'center-cell' : ''}
                    style={column.width ? { width: column.width } : undefined}
                  >
                    {column.label}
                  </th>
                ))}
                {actions.length > 0 && (
                  <th className='center-cell'>Acciones</th>
                )}
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr className='loading-state-row'>
                  <td
                    className='center-cell'
                    colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                    style={{ padding: '2rem' }}
                  >
                    <Loader width={24} height={24} />
                  </td>
                </tr>
              )}

              {error && !(error.status === 400 && page > 1) && (
                <tr className='error-state-row'>
                  <td
                    className='center-cell'
                    colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                    style={{ padding: 0 }}
                  >
                    <ErrorState
                      title={`Error al cargar ${itemNamePlural}`}
                      message={error.message}
                      onRetry={onRefresh}
                    />
                  </td>
                </tr>
              )}

              {!loading && !error && data && (
                data.length > 0
                  ? data.map((row, rowIndex) => (
                    <tr key={row.id || rowIndex}>
                      {columns.map((column, colIndex) => (
                        <td
                          key={column.key || colIndex}
                          className={column.align === 'center' ? 'center-cell' : ''}
                        >
                          {column.ellipsis
                            ? (
                              <div className='ellipsis-cell'>
                                {renderCellContent(row, column)}
                              </div>
                              )
                            : (
                                renderCellContent(row, column)
                              )}
                        </td>
                      ))}
                      {actions.length > 0 && (
                        <td className='center-cell'>
                          {renderActions(row)}
                        </td>
                      )}
                    </tr>
                  ))
                  : (
                    <tr className='empty-state-row'>
                      <td
                        className='center-cell'
                        colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                        style={{ padding: 0 }}
                      >
                        <EmptyState
                          icon={EmptyIcon}
                          message={emptyMessage}
                          description={emptyDescription}
                        />
                      </td>
                    </tr>
                    )
              )}
            </tbody>
          </table>
        </CardBody>

        {meta && meta.pagination && (
          <CardFooter>
            <Pagination
              currentPage={page}
              totalPages={meta.pagination.pageCount}
              onPageChange={onPageChange}
            />
          </CardFooter>
        )}
      </Card>
    </>
  )
}
