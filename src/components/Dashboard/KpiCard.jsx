import { ErrorState } from '@/components/ErrorState'
import { Loader } from '@/components/Loader'
import '@/styles/KpiCard.css' // Solo importa su propio CSS

// Iconos
const ArrowUpIcon = () => <span style={{ color: '#28a745' }}>▲</span>
const ArrowDownIcon = () => <span style={{ color: '#dc3545' }}>▼</span>

export function KpiCard ({
  title,
  value,
  loading,
  error = null,
  onRetry = null,
  growth,
  className = '', // Para el layout (ej. span-2)
  cardControls = null // Para los selectores
}) {
  const hasGrowth = growth !== undefined && growth !== null
  const isPositive = hasGrowth && growth > 0

  const renderContent = () => {
    if (loading) return <Loader width={28} height={28} text='' />
    if (error) {
      const message = typeof error === 'string' ? error : (error.message || '')
      return <ErrorState message={message} onRetry={onRetry} />
    }
    return <div className='kpi-card-value'>{value || 'N/A'}</div>
  }

  return (
    <div className={`kpi-card-wrapper ${className}`}>

      {/* Encabezado */}
      <div className='kpi-card-header'>
        <h3 className='kpi-card-title'>{title}</h3>
        {cardControls}
      </div>

      {/* Contenido */}
      <div className='kpi-card-content'>
        {renderContent()}

        {hasGrowth && (
          <span className={`kpi-card-growth ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {Math.abs(growth)}%
          </span>
        )}
      </div>

      {/* Footer de fuente eliminado */}
    </div>
  )
}
