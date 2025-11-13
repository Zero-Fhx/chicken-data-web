// fileName: TrendChart.jsx (VERSIÓN FINAL COMPLETA)

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

import '@/styles/TrendChart.css'

// Colores (sin cambios)
const COLOR_SALES = '#8884d8'
const COLOR_PURCHASES = '#FF8042'

// Normaliza cualquier entrada en un array seguro (sin cambios)
const asArray = (v) => {
  if (!v) return []
  if (Array.isArray(v)) return v
  if (typeof v === 'object') return Object.values(v)
  return []
}

// Función para fusionar datos (sin cambios)
const mergeTrendData = (sales = [], purchases = []) => {
  const merged = {}

  asArray(sales).forEach((item) => {
    const period = item.period || item.date
    merged[period] = {
      name: period,
      revenue: Number(item.revenue || item.total || 0)
    }
  })

  asArray(purchases).forEach((item) => {
    const period = item.period || item.date
    if (!merged[period]) merged[period] = { name: period }
    merged[period].cost = Number(item.cost || item.total || 0)
  })

  return Object.values(merged).sort((a, b) => ('' + a.name).localeCompare('' + b.name))
}

// --- Componente de Tooltip Personalizado ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Ordenar para que 'Ingresos' aparezca antes que 'Costos'
    const sortedPayload = [...payload].sort((a) => a.name === 'Ingresos' ? -1 : 1)

    return (
      <div className='custom-tooltip'>
        <p className='label'>{`${label}`}</p>
        {sortedPayload.map((entry, index) => {
          // Filtro para mostrar solo las entradas que queremos
          if (entry.name === 'Ingresos' || entry.name === 'Costos') {
            const color = entry.name === 'Ingresos' ? COLOR_SALES : COLOR_PURCHASES

            return (
              <p key={`item-${index}`} className='item' style={{ color }}>
                <span className='tooltip-color-box' style={{ backgroundColor: color }} />
                {`${entry.name} : `}
                <span className='value'>S/. {Number(entry.value).toFixed(2)}</span>
              </p>
            )
          }
          return null // Ignorar 'revenue' y 'cost'
        })}
      </div>
    )
  }

  return null
}
// --- FIN Componente de Tooltip ---

export function TrendChart ({ loading, data, dataType = 'both' }) {
  if (loading) return null
  if (!data || (!data.sales && !data.purchases)) return <p>No hay datos de tendencias.</p>

  const { sales, purchases } = data || {}
  let chartData = []

  // Lógica de datos (sin cambios)
  if (dataType === 'sales') {
    chartData = asArray(sales).map((item) => ({ name: item.period || item.date, revenue: Number(item.revenue || item.total || 0) }))
  } else if (dataType === 'purchases') {
    chartData = asArray(purchases).map((item) => ({ name: item.period || item.date, cost: Number(item.cost || item.total || 0) }))
  } else {
    chartData = mergeTrendData(sales, purchases)
  }

  // Formatter solo para el eje Y
  const yAxisFormatter = (value) => `S/.\u00A0${Number(value).toFixed(2)}`

  return (
    <ResponsiveContainer width='100%' height={350}>
      <ComposedChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        {/* Gradientes (sin cambios) */}
        <defs>
          <linearGradient id='colorSalesGradient' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor={COLOR_SALES} stopOpacity={0.8} />
            <stop offset='95%' stopColor={COLOR_SALES} stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id='colorPurchasesGradient' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor={COLOR_PURCHASES} stopOpacity={0.8} />
            <stop offset='95%' stopColor={COLOR_PURCHASES} stopOpacity={0.1} />
          </linearGradient>
        </defs>

        {/* Ejes (sin cambios) */}
        <CartesianGrid strokeDasharray='3 3' stroke='#e9ecef' />
        <XAxis dataKey='name' fontSize={12} tickLine={false} axisLine={false} stroke='#6c757d' />
        <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={yAxisFormatter} stroke='#6c757d' />

        {/* Tooltip (Usa el 'content' personalizado) */}
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: 'rgba(233, 236, 239, 0.5)' }}
        />

        <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />

        {/* Áreas y Líneas (sin cambios) */}
        {(dataType === 'sales' || dataType === 'both') && (
          <Area
            type='monotone'
            dataKey='revenue'
            name='Ingresos'
            fill='url(#colorSalesGradient)'
            fillOpacity={0.4}
            stroke='none'
            dot={false}
          />
        )}
        {(dataType === 'sales' || dataType === 'both') && (
          <Line
            type='monotone'
            dataKey='revenue'
            stroke={COLOR_SALES}
            strokeWidth={2}
            dot={false}
            legendType='none'
            activeDot={{ r: 4 }}
            includeInTooltip={false} // Le decimos que no lo incluya
          />
        )}
        {(dataType === 'purchases' || dataType === 'both') && (
          <Area
            type='monotone'
            dataKey='cost'
            name='Costos'
            fill='url(#colorPurchasesGradient)'
            fillOpacity={0.6}
            stroke='none'
            dot={false}
          />
        )}
        {(dataType === 'purchases' || dataType === 'both') && (
          <Line
            type='monotone'
            dataKey='cost'
            stroke={COLOR_PURCHASES}
            strokeWidth={2}
            dot={false}
            legendType='none'
            activeDot={{ r: 4 }}
            includeInTooltip={false} // Le decimos que no lo incluya
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  )
}
