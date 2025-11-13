// fileName: ComparisonKpiView.jsx (REEMPLAZAR ARCHIVO COMPLETO)

import '@/styles/ComparisonKpiView.css' // Usaremos el CSS de grid

const formatCurrency = (v) => {
  if (v == null) return 'N/A'
  return `S/. ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const formatChange = (change) => {
  if (change == null) {
    return <span className='kpi-change neutral'>-</span>
  }
  const value = Number(change)
  const prefix = value > 0 ? '▲' : (value < 0 ? '▼' : '')
  const color = value > 0 ? 'positive' : (value < 0 ? 'negative' : 'neutral')
  return (
    <span className={`kpi-change ${color}`}>
      {prefix} {Math.abs(value).toFixed(1)}%
    </span>
  )
}

// Mapeo de claves
const periodKeys = {
  today: {
    current: 'current',
    vsPrevious: 'vsYesterday',
    vsLastYear: 'vsSameDayLastYear'
  },
  week: {
    current: 'current',
    vsPrevious: 'vsLastWeek',
    vsLastYear: 'vsSameWeekLastYear'
  },
  month: {
    current: 'current',
    vsPrevious: 'vsLastMonth',
    vsLastYear: 'vsSameMonthLastYear'
  },
  year: {
    current: 'current',
    vsPrevious: 'vsLastYear',
    vsLastYear: null
  }
}

// Mapeo de etiquetas
const periodLabels = {
  today: 'Ayer',
  week: 'Semana Pasada',
  month: 'Mes Pasado',
  year: 'Año Pasado'
}

export function ComparisonKpiView ({ data, period, label }) {
  if (!data || !data[period]) {
    return <p>No hay datos de comparación para este período.</p>
  }

  const periodData = data[period]
  const keys = periodKeys[period]

  const currentValue = periodData[keys.current]
  const previousData = keys.vsPrevious ? periodData[keys.vsPrevious] : null
  const lastYearData = keys.vsLastYear ? periodData[keys.vsLastYear] : null

  const previousLabel = periodLabels[period] || 'Período Anterior'

  // MANTENEMOS LA TRADUCCIÓN
  const lastYearLabel = period === 'year' ? 'Año Pasado' : 'Mismo Período (Año Ant.)'

  return (
    // Revertimos a la estructura de grid
    <div className='comparison-kpi-view'>

      {/* KPI Principal */}
      <div className='kpi-main'>
        <span className='kpi-main-value'>{formatCurrency(currentValue)}</span>
        <span className='kpi-main-label'>{label} (Actual)</span>
      </div>

      {/* Revertimos a 'kpi-grid' */}
      <div className='kpi-grid'>

        {/* KPI vs Período Anterior */}
        <div className='kpi-item'>
          <span className='kpi-item-value'>{formatChange(previousData?.change)}</span>
          <span className='kpi-item-label'>vs. {previousLabel}</span>
          <span className='kpi-item-subvalue'>{formatCurrency(previousData?.value)}</span>
        </div>

        {/* KPI vs Año Pasado (solo si existe) */}
        {lastYearData && (
          <div className='kpi-item'>
            <span className='kpi-item-value'>{formatChange(lastYearData?.change)}</span>
            <span className='kpi-item-label'>vs. {lastYearLabel}</span>
            <span className='kpi-item-subvalue'>{formatCurrency(lastYearData?.value)}</span>
          </div>
        )}

      </div>
    </div>
  )
}
