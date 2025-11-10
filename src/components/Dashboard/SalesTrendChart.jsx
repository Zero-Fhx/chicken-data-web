import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

// Archivo renombrado a TrendChart.jsx
export function TrendChart ({ data, dataType = 'sales' }) {
  if (!data) return <p>No hay datos de tendencias para mostrar.</p>
  const COLORS = {
    sales: '#4F8A8B',
    purchases: '#F9AE3D'
  }
  const chartArr = (dataType === 'sales' ? data.sales : data.purchases) || []
  const chartData = chartArr.map(item => ({
    name: item.period || item.date,
    value: dataType === 'sales' ? Number(item.revenue || 0) : Number(item.cost || 0)
  }))
  // Prevent line breaks in axis ticks by using a non-breaking space
  const formatCurrency = value => `S/.\u00A0${Number(value).toFixed(2)}`
  return (
    <ResponsiveContainer width='100%' height={300}>
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        barSize={20}
      >
        <CartesianGrid strokeDasharray='3 3' stroke='#e9ecef' />
        <XAxis
          dataKey='name'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          stroke='#6c757d'
        />
        <YAxis
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatCurrency}
          stroke='#6c757d'
        />
        <Tooltip
          formatter={formatCurrency}
          cursor={{ fill: 'rgba(233, 236, 239, 0.5)' }}
          contentStyle={{
            borderRadius: '8px',
            borderColor: '#e9ecef',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          labelStyle={{ color: '#343a40', fontWeight: '600' }}
        />
        <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
        <Bar
          dataKey='value'
          name={dataType === 'sales' ? 'Ingresos' : 'Costos'}
          fill={COLORS[dataType]}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
