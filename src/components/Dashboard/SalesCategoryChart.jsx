import '@/styles/PieChartWrapper.css'
import { useState } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Sector } from 'recharts'

const COLORS = [
  '#0088FE', // Azul
  '#00C49F', // Verde
  '#FFBB28', // Amarillo
  '#FF8042', // Naranja
  '#AF19FF', // Violeta
  '#FF1967', // Rosa
  '#3498DB', // Azul Claro
  '#E74C3C'  // Rojo
]

// --- TAREA 12: Aceptar la prop 'period' ---
export function SalesCategoryChart ({ loading, data, period = 'month' }) {
  // Estado local para hover/active del pie
  const [activeIndex, setActiveIndex] = useState(undefined)

  // Delegate loading UI to DashboardCard wrapper
  if (loading) return null
  if (!data || data.length === 0) return <p>No hay datos de categorías para mostrar.</p>

  const chartData = data.map(category => ({
    name: category.categoryName,
    // --- TAREA 12: Usar el 'period' dinámicamente ---
    value: Number(category[period]?.revenue ?? 0)
  })).filter(item => item.value > 0)

  chartData.sort((a, b) => a.name.localeCompare(b.name))

  if (chartData.length === 0) return <p>No hay ventas para este período.</p>
  const RADIAN = Math.PI / 180
  const renderActiveShape = ({ cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value }) => {
    const sin = Math.sin(-RADIAN * (midAngle ?? 0))
    const cos = Math.cos(-RADIAN * (midAngle ?? 0))
    const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos
    const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin
    const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos
    const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 22
    const ey = my

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor='middle' fill={fill} fontWeight={700}>
          {payload.name}
        </text>
        <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
        <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={(outerRadius ?? 0) + 6} outerRadius={(outerRadius ?? 0) + 10} fill={fill} />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill='none' />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke='none' />
        {(() => {
          const v = Number((payload && payload.value) ?? value ?? 0)
          const valueStr = `S/. ${v.toFixed(2)}`
          const percentStr = `(${(percent * 100).toFixed(2)}%)`
          const approxCharWidth = 7
          const padding = 8
          const valueFontSize = 14
          const percentFontSize = 13
          const lineGap = 4

          const boxWidth = Math.max(valueStr.length, percentStr.length) * approxCharWidth + padding * 2
          const totalTextHeight = valueFontSize + percentFontSize + lineGap
          const boxHeight = padding * 2 + totalTextHeight

          const gapX = 16
          const boxX = cos >= 0 ? ex + gapX : ex - boxWidth - gapX

          let boxY = ey - boxHeight / 2
          const chartTopLimit = (cy ?? 0) - (outerRadius ?? 0) - 24
          const chartBottomLimit = (cy ?? 0) + (outerRadius ?? 0) + 24
          if (boxY < chartTopLimit) boxY = chartTopLimit
          if (boxY + boxHeight > chartBottomLimit) boxY = chartBottomLimit - boxHeight

          const centerX = boxX + boxWidth / 2
          const valueY = boxY + padding + valueFontSize / 2
          const percentY = boxY + padding + valueFontSize + lineGap + percentFontSize / 2

          return (
            <g>
              <rect x={boxX} y={boxY} rx={6} ry={6} width={boxWidth} height={boxHeight} fill='rgba(255,255,255,0.92)' stroke='rgba(0,0,0,0.06)' />
              <text x={centerX} y={valueY} textAnchor='middle' fill='#333' fontWeight={700} fontSize={valueFontSize} dominantBaseline='middle'>{valueStr}</text>
              <text x={centerX} y={percentY} textAnchor='middle' fill='#666' fontSize={percentFontSize} dominantBaseline='middle'>{percentStr}</text>
            </g>
          )
        })()}
      </g>
    )
  }

  return (
    <div className='pie-chart-wrapper'>
      <ResponsiveContainer width='100%' height={350}>
        <PieChart style={{ overflow: 'visible' }} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <Legend
            layout='vertical'
            align='right'
            verticalAlign='middle'
            iconType='circle'
            wrapperStyle={{ fontSize: '14px', lineHeight: '20px', right: 20 }}
          />

          <Pie
            data={chartData}
            dataKey='value'
            nameKey='name'
            cx='45%'
            innerRadius='60%'
            outerRadius='80%'
            cy='50%'
            fill='#8884d8'
            paddingAngle={2}
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(undefined)}
            labelLine={false}
            label={({ percent, x, y }) => (
              <text x={x} y={y} fill='#343a40' fontSize='12' fontWeight='600' textAnchor='middle' dominantBaseline='central'>
                {`${(percent * 100).toFixed(0)}%`}
              </text>
            )}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
