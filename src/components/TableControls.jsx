import { RefreshIcon } from '@/components/Icons'

import '@/styles/TableControls.css'

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
