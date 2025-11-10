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

// Colores
const COLOR_SALES = '#8884d8'
const COLOR_PURCHASES = '#FF8042'

// Normaliza cualquier entrada en un array seguro
const asArray = (v) => {
  if (!v) return []
  if (Array.isArray(v)) return v
  if (typeof v === 'object') return Object.values(v)
  return []
}

// Función para fusionar datos de ventas y compras por periodo
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

export function TrendChart ({ loading, data, dataType = 'both' }) {
  // El wrapper DashboardCard mostrará Loader/ErrorState
  if (loading) return null
  if (!data || (!data.sales && !data.purchases)) return <p>No hay datos de tendencias.</p>

  const { sales, purchases } = data || {}
  let chartData = []

  if (dataType === 'sales') {
    chartData = asArray(sales).map((item) => ({
      name: item.period || item.date,
      revenue: Number(item.revenue || item.total || 0)
    }))
  } else if (dataType === 'purchases') {
    chartData = asArray(purchases).map((item) => ({
      name: item.period || item.date,
      cost: Number(item.cost || item.total || 0)
    }))
  } else {
    // both
    chartData = mergeTrendData(sales, purchases)
  }

  // Use a non-breaking space after the currency symbol so labels don't break into multiple lines
  const formatCurrency = (value) => `S/.\u00A0${Number(value).toFixed(2)}`

  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        barSize={15}
      >
        <CartesianGrid strokeDasharray='3 3' stroke='#e9ecef' />
        <XAxis dataKey='name' fontSize={12} tickLine={false} axisLine={false} stroke='#6c757d' />
        <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatCurrency} stroke='#6c757d' />
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

        {(dataType === 'sales' || dataType === 'both') && (
          <Bar dataKey='revenue' name='Ingresos' fill={COLOR_SALES} radius={[4, 4, 0, 0]} />
        )}

        {(dataType === 'purchases' || dataType === 'both') && (
          <Bar dataKey='cost' name='Costos' fill={COLOR_PURCHASES} radius={[4, 4, 0, 0]} />
        )}
      </BarChart>
    </ResponsiveContainer>
  )
}
