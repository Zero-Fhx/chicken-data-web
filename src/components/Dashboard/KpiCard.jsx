// fileName: KpiCard.jsx (REEMPLAZAR ARCHIVO COMPLETO)

import { ErrorState } from '@/components/ErrorState'
import { Loader } from '@/components/Loader'
import '@/styles/KpiCard.css'
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts'

// Iconos (sin cambios)
const ArrowUpIcon = () => <span style={{ color: '#28a745' }}>▲</span>
const ArrowDownIcon = () => <span style={{ color: '#dc3545' }}>▼</span>

// Mapa para los títulos (sin cambios)
const sparklineLabels = {
  today: 'Tendencia (Últimas 24h)',
  week: 'Tendencia (Últimos 7d)',
  month: 'Tendencia (Últimos 30d)'
}

// --- 1. TOOLTIP PERSONALIZADO MEJORADO ---
const CustomSparklineTooltip = ({ active, payload, title }) => {
  if (active && payload && payload.length) {
    // 'payload[0].payload' contiene el objeto de datos original
    const dataPoint = payload[0].payload

    // Leemos la fecha/hora desde la clave 'name'
    const dateLabel = dataPoint.name
    // Leemos el valor desde la clave 'value'
    const value = dataPoint.value

    // Pluralizamos el 'title'
    const labelName = title === 'Ventas' ? 'Ingresos' : 'Costos'

    return (
      <div className='custom-sparkline-tooltip'>
        {/* Mostramos la fecha/hora */}
        <p className='label'>{`${dateLabel}`}</p>

        {/* Mostramos el valor (ej. "Costos: S/. 117.25") */}
        <p className='item'>
          {`${labelName}:`}
          <span className='value'>{`S/. ${Number(value || 0).toFixed(2)}`}</span>
        </p>
      </div>
    )
  }
  return null
}
// --- FIN Tooltip ---

export function KpiCard ({
  title,
  value,
  statsLoading,
  trendsLoading,
  period,
  error = null,
  onRetry = null,
  growth,
  className = '',
  cardControls = null,
  sparklineData
}) {
  const hasGrowth = growth !== undefined && growth !== null
  const isPositive = hasGrowth && growth > 0
  const growthColor = isPositive ? '#28a745' : '#dc3545'
  const sparklineLabel = sparklineLabels[period] || 'Tendencia'

  const dataKey = title === 'Ventas' ? 'revenue' : 'cost'

  // El 'name' aquí se pasa al 'dateLabel' del tooltip
  const chartData = (sparklineData || []).map(item => ({
    name: item.period, // 'name' se leerá desde dataPoint.name
    value: Number(item[dataKey] || 0) // 'value' se leerá desde dataPoint.value
  }))

  const renderContent = () => {
    // ... (esta función no cambia)
    if (statsLoading) return <Loader width={28} height={28} text='' />
    if (error && !value) {
      const message = typeof error === 'string' ? error : (error.message || '')
      return <ErrorState message={message} onRetry={onRetry} />
    }
    return (
      <div className='kpi-card-metrics'>
        <div className='kpi-card-value'>{value || 'N/A'}</div>
        {hasGrowth && (
          <span className={`kpi-card-growth ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {Math.abs(growth)}%
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={`kpi-card-wrapper ${className}`}>
      {/* Encabezado (sin cambios) */}
      <div className='kpi-card-header'>
        <h3 className='kpi-card-title'>{title}</h3>
        {cardControls}
      </div>

      {/* Contenido */}
      <div className='kpi-card-content'>
        {renderContent()}

        {!statsLoading && period !== 'today' && (
          <div className='kpi-sparkline'>
            <h4 className='kpi-sparkline-title'>{sparklineLabel}</h4>
            <div className='kpi-sparkline-chart-wrapper'>
              {trendsLoading
                ? (<Loader width={20} height={20} text='' />)
                : (
                    !error && chartData.length > 0 && (
                      <ResponsiveContainer width='100%' height={40}>
                        <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                          <Tooltip
                            content={<CustomSparklineTooltip title={title} />} // Pasa el 'title'
                            cursor={{ stroke: growthColor, strokeWidth: 1, strokeDasharray: '3 3' }}
                          />
                          <defs>
                            <linearGradient id={isPositive ? 'positiveGradient' : 'negativeGradient'} x1='0' y1='0' x2='0' y2='1'>
                              <stop offset='5%' stopColor={growthColor} stopOpacity={0.4} />
                              <stop offset='95%' stopColor={growthColor} stopOpacity={0.05} />
                            </linearGradient>
                          </defs>
                          <Area
                            type='monotone'
                            dataKey='value' // Este es el payload[0].value
                            stroke={growthColor}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill={`url(#${isPositive ? 'positiveGradient' : 'negativeGradient'})`}
                            dot={false}
                            activeDot={{ r: 4, strokeWidth: 1, fill: '#fff', stroke: growthColor }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )
                  )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
