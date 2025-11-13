// fileName: FinancialSummary.jsx

import '@/styles/FinancialSummary.css' // Usaremos el nuevo CSS
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

const formatCurrency = (value) => `S/. ${(Number(value) || 0).toFixed(2)}`

const periodLabels = {
  today: 'Hoy',
  week: 'Semana',
  month: 'Mes'
}

// Componente Helper para el Medidor (Gauge)
// (Cambiado para que el texto esté en el centro)
const GaugeChart = ({ value, title }) => {
  const percentValue = value || 0
  const data = [
    { name: 'value', value: percentValue },
    { name: 'remaining', value: 100 - percentValue }
  ]

  // Color basado en el valor (amarillo para <50%, verde para >=50%)
  const color = percentValue < 50 ? '#FFBB28' : '#00C49F'

  return (
    <div className='financial-gauge-item'>
      <h4 className='financial-title'>{title}</h4>
      <div style={{ width: 100, height: 100, position: 'relative' }}>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={data}
              dataKey='value'
              cx='50%'
              cy='50%'
              innerRadius={30}
              outerRadius={45}
              startAngle={90}
              endAngle={-270}
              fill='#8884d8'
              stroke='none'
            >
              <Cell fill={color} />
              <Cell fill='#f0f0f0' />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Label en el centro, como en tu imagen */}
        <div className='financial-gauge-label'>
          {percentValue.toFixed(1)}%
        </div>
      </div>
    </div>
  )
}

export function FinancialSummary ({ loading, data, period = 'month' }) {
  if (loading) return null
  if (!data) return <p>No hay datos financieros.</p>

  const { profitMargin, roi, costs, profit } = data
  const periodLabel = periodLabels[period] || 'Mes'

  return (
    <div className='financial-summary-v2'>
      {/* Fila 1: KPIs dinámicos (AHORA 2 COLUMNAS) */}
      <div className='financial-kpi-grid'>
        <div className='financial-item-flat'>
          <h4 className='financial-title-flat'>Utilidad Neta ({periodLabel})</h4>
          <p className='financial-value-main'>
            {formatCurrency(profit?.[period])}
          </p>
        </div>
        <div className='financial-item-flat'>
          <h4 className='financial-title-flat'>Utilidad Prom. p/ Plato</h4>
          <p className='financial-value-main'>
            {formatCurrency(profit?.averageProfitPerDish)}
          </p>
        </div>
      </div>

      {/* Fila 2: Medidores (AHORA 2 COLUMNAS) */}
      <div className='financial-gauge-grid'>
        <GaugeChart
          title={`Margen de Ganancia (${periodLabel})`}
          value={profitMargin?.[period]}
        />
        <GaugeChart
          title='Costo de Alimentos (Mes)'
          value={costs?.foodCostPercentage}
        />
      </div>

      {/* Fila 3: KPIs secundarios (Sin cambios, 2 columnas) */}
      <div className='financial-static-grid'>
        <div className='financial-item'>
          <h4 className='financial-title-box'>ROI del Mes</h4>
          <p className='financial-value'>{roi?.month ?? 0}%</p>
        </div>
        <div className='financial-item'>
          <h4 className='financial-title-box'>Costo Prom. p/ Plato</h4>
          <p className='financial-value'>
            {formatCurrency(costs?.averageCostPerDish)}
          </p>
        </div>
      </div>
    </div>
  )
}
