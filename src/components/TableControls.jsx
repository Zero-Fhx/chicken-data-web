import { RefreshIcon } from '@/components/Icons'

import '@/styles/TableControls.css'

/**
 * Componente para los controles de la cabecera de una tabla.
 * * Muestra el título de la tabla, un selector para el tamaño de página y un botón para recargar los datos.
 *
 * @param {Object} props - Objeto de propiedades del componente.
 * @param {string} props.title - El título a mostrar en la cabecera.
 * @param {React.ComponentType} [props.icon] - Componente de ícono para mostrar junto al título.
 * @param {number} props.pageSize - El tamaño de página actual.
 * @param {function} props.onPageSizeChange - Callback que se ejecuta cuando cambia el tamaño de página.
 * @param {function} props.onRefresh - Callback que se ejecuta al hacer clic en el botón de recargar.
 * @param {boolean} [props.loading=false] - Deshabilita los controles mientras los datos se están cargando.
 * @param {Array<number>} [props.pageSizeOptions=[5, 10, 20, 50]] - Opciones para el selector de tamaño de página.
 * @param {string} [props.refreshLabel='Recargar'] - Etiqueta para el botón de recargar.
 *
 * @returns {React.ReactElement} El elemento JSX renderizado.
 */
export function TableControls ({
  title,
  icon: Icon,
  pageSize,
  onPageSizeChange,
  onRefresh,
  loading = false,
  pageSizeOptions = [5, 10, 20, 50],
  refreshLabel = 'Recargar'
}) {
  const handlePageSizeChange = (e) => {
    if (onPageSizeChange) {
      onPageSizeChange(Number(e.target.value))
    }
  }

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh()
    }
  }

  return (
    <div className='table-controls'>
      <div className='table-controls-title'>
        {Icon && <Icon />}
        <h2>{title}</h2>
      </div>
      <div className='table-controls-actions'>
        <select
          className='muted'
          style={{ width: 'auto' }}
          value={pageSize}
          disabled={loading}
          onChange={handlePageSizeChange}
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option} por página
            </option>
          ))}
        </select>
        <button
          className='muted'
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshIcon />
          {refreshLabel}
        </button>
      </div>
    </div>
  )
}
