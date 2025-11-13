// fileName: TopSuppliersList.jsx (REEMPLAZAR ARCHIVO COMPLETO)

import '@/styles/TopSuppliersList.css' // Asegúrate de que este CSS esté actualizado (ver paso 4)
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Text,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

// Colores
const COLOR_SUPPLIERS = '#8884d8' // Púrpura

const formatCurrency = (value) => `S/. ${(Number(value) || 0).toFixed(2)}`

// Componente personalizado para el "label" de la categoría (YAxis)
const CustomYAxisTick = ({ y, payload }) => {
  const truncatedName = payload.value.length > 22
    ? `${payload.value.substring(0, 22)}...`
    : payload.value
  return (
    <Text x={0} y={y} dy={5} textAnchor='start' fill='#666' fontSize={14}>
      {truncatedName}
    </Text>
  )
}

// --- 1. FUNCIÓN DE RENDERIZADO PERSONALIZADO PARA EL TOOLTIP ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className='custom-tooltip'>
        <p className='label'>{`${label}`}</p>
        <p className='item' style={{ color: COLOR_SUPPLIERS }}>
          <span className='tooltip-color-box' style={{ backgroundColor: COLOR_SUPPLIERS }} />
          {'Total Gastado : '}
          <span className='value'>{formatCurrency(payload[0].value)}</span>
        </p>
      </div>
    )
  }
  return null
}
// --- FIN FUNCIÓN PERSONALIZADA ---

export function TopSuppliersList ({ loading, data }) {
  if (loading) return null
  if (!data || data.length === 0) return <p>No hay proveedores para mostrar.</p>

  const chartData = data
  const chartHeight = (chartData.length * 45) + 30

  return (
    <div className='top-suppliers-chart-container' style={{ width: '100%', height: `${chartHeight}px` }}>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={chartData}
          layout='vertical'
          margin={{ top: 20, right: 50, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray='3 3' stroke='#e9ecef' />
          <XAxis
            type='number'
            orientation='top'
            axisLine={false}
            tickLine={false}
            fontSize={12}
            stroke='#6c757d'
            tickFormatter={formatCurrency}
          />
          <YAxis
            dataKey='name'
            type='category'
            axisLine={false}
            tickLine={false}
            width={180}
            tick={<CustomYAxisTick />}
            tickMargin={15}
            interval={0}
          />

          {/* --- 2. TOOLTIP ACTUALIZADO --- */}
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(233, 236, 239, 0.5)' }}
          />

          <Bar
            dataKey='totalSpent'
            fill={COLOR_SUPPLIERS}
            radius={[0, 4, 4, 0]}
            barSize={18}
            name='Total Gastado' // Usado por la Leyenda
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
