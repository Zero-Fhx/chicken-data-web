// fileName: InventorySummary.jsx

import '@/styles/InventorySummary.css' // Reutilizamos el CSS
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const formatCurrency = (value) => `S/. ${(Number(value) || 0).toFixed(2)}`

// Datos y colores para el gráfico de estado de stock
const COLORS = {
  optimal: '#00C49F', // Verde
  lowStock: '#FFBB28', // Naranja
  outOfStock: '#FF8042' // Rojo
}

export function InventorySummary ({ loading, data }) {
  if (loading) return null
  if (!data) return <p>No hay datos de inventario.</p>

  const { totalValue, total, alerts } = data

  const stockStatusData = [
    { name: 'Óptimo', value: alerts?.optimal ?? 0 },
    { name: 'Bajo', value: alerts?.lowStock ?? 0 },
    { name: 'Agotado', value: alerts?.outOfStock ?? 0 }
  ].filter(item => item.value > 0) // Filtramos para no mostrar items con 0

  return (
    <div className='inventory-summary-v2'>
      {/* Columna 1: KPIs Principales */}
      <div className='inventory-kpis'>
        <div className='inventory-item'>
          <h4 className='inventory-title'>Valor Total</h4>
          <p className='inventory-value'>{formatCurrency(totalValue)}</p>
        </div>
        <div className='inventory-item'>
          <h4 className='inventory-title'>Ingredientes Totales</h4>
          <p className='inventory-value'>{total ?? 0}</p>
        </div>
      </div>

      {/* Columna 2: Gráfico Mini-Dona */}
      <div className='inventory-chart-container'>
        <ResponsiveContainer width='100%' height={120}>
          <PieChart>
            <Pie
              data={stockStatusData}
              dataKey='value'
              nameKey='name'
              cx='50%'
              cy='50%'
              innerRadius={30} // Esto la hace una Dona
              outerRadius={50}
              fill='#8884d8'
              paddingAngle={2}
            >
              {stockStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name.replace('Óptimo', 'optimal').replace('Bajo', 'lowStock').replace('Agotado', 'outOfStock')]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              layout='vertical'
              align='right'
              verticalAlign='middle'
              iconType='circle'
              wrapperStyle={{ fontSize: '12px', right: '-10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
