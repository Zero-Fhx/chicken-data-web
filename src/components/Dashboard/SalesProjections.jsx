// fileName: SalesProjections.jsx

import '../../styles/FinancialSummary.css' // Reutilizamos este
import '../../styles/SalesProjections.css' // Y añadimos uno nuevo

const formatCurrency = (v) => {
  if (v == null) return 'N/A'
  return `S/. ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const formatNumber = (v, digits = 0) => (v == null ? 'N/A' : Number(v).toLocaleString('es-PE', { minimumFractionDigits: digits, maximumFractionDigits: digits }))

// Componente del Gráfico de Rango
const RangeChart = ({ min, max, value }) => {
  if (min == null || max == null || value == null || max === min) {
    return null
  }

  // Calcular posición del marcador
  const range = max - min
  const valuePercent = ((value - min) / range) * 100

  // Asegurarse de que el marcador esté dentro de los límites
  const markerPosition = Math.max(0, Math.min(100, valuePercent))

  return (
    <div className='range-chart'>
      <div className='range-bar'>
        {/* Marcador de la proyección */}
        <div
          className='range-marker'
          style={{ left: `${markerPosition}%` }}
          title={`Proyectado: ${formatCurrency(value)}`}
        />
      </div>
      <div className='range-labels'>
        <span className='range-label-min'>{formatCurrency(min)}</span>
        <span className='range-label-max'>{formatCurrency(max)}</span>
      </div>
    </div>
  )
}

export function SalesProjections ({ data }) {
  if (!data) return <div>No hay datos de proyección de ventas.</div>

  const { projectedRevenue, projectedOrders, range } = data

  return (
    <div className='projections-v2'>

      {/* 1. KPIs Principales */}
      <div className='kpi-main'>
        <span className='kpi-main-value'>{formatCurrency(projectedRevenue)}</span>
        <span className='kpi-main-label'>Ingresos Proyectados</span>
      </div>

      <div className='kpi-main' style={{ marginTop: '16px' }}>
        <span className='kpi-main-value'>{formatNumber(projectedOrders)}</span>
        <span className='kpi-main-label'>Órdenes Proyectadas</span>
      </div>

      {/* 2. Gráfico de Rango */}
      <div className='range-container'>
        <h4 className='range-title'>Rango de Proyección</h4>
        <RangeChart
          min={range?.conservative}
          max={range?.optimistic}
          value={projectedRevenue}
        />
      </div>

    </div>
  )
}
