// fileName: TopDishesList.jsx (REEMPLAZAR ARCHIVO COMPLETO)

import '@/styles/TopDishesList.css' // Asegúrate de que este CSS esté actualizado (ver paso 2)
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
const COLOR_DISHES = '#82ca9d' // Verde

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
        <p className='item' style={{ color: COLOR_DISHES }}>
          <span className='tooltip-color-box' style={{ backgroundColor: COLOR_DISHES }} />
          {'Vendidos : '}
          <span className='value'>{payload[0].value}</span>
        </p>
      </div>
    )
  }
  return null
}
// --- FIN FUNCIÓN PERSONALIZADA ---

export function TopDishesList ({ loading, data, error }) {
  if (loading) return null
  if (error) return null
  if (!data || data.length === 0) return <p>No hay platos para mostrar.</p>

  const chartData = data
  const chartHeight = (chartData.length * 45) + 30

  return (
    <div className='top-dishes-chart-container' style={{ width: '100%', height: `${chartHeight}px` }}>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={chartData}
          layout='vertical'
          margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray='3 3' stroke='#e9ecef' />
          <XAxis
            type='number'
            orientation='top'
            axisLine={false}
            tickLine={false}
            fontSize={12}
            stroke='#6c757d'
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
            dataKey='quantitySold'
            fill={COLOR_DISHES}
            radius={[0, 4, 4, 0]}
            barSize={18}
            name='Vendidos' // Usado por la Leyenda
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
