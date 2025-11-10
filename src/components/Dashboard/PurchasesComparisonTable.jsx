import '../../styles/PurchasesComparisonTable.css'

const formatCurrency = (v) => (v == null ? 'N/A' : `S/. ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)

const periodLabel = {
  today: 'Hoy',
  week: 'Semana',
  month: 'Mes',
  year: 'Año'
}

export function PurchasesComparisonTable ({ data, label = 'Compras' }) {
  if (!data) return <div>No hay datos.</div>

  // Si la respuesta viene por periodos (today/week/month/year)
  const periods = ['today', 'week', 'month', 'year'].filter(p => data[p] != null)

  if (periods.length > 0) {
    return (
      <table className='comparison-table'>
        <thead>
          <tr>
            <th>Periodo</th>
            <th>{label}</th>
            <th>Vs periodo anterior</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          {periods.map(p => {
            const cur = data[p]?.current ?? null
            // determine comparison object key for this period
            const cmpKey = p === 'today' ? 'vsYesterday' : p === 'week' ? 'vsLastWeek' : p === 'month' ? 'vsLastMonth' : 'vsLastYear'
            const cmp = data[p]?.[cmpKey] ?? null
            return (
              <tr key={p}>
                <td>{periodLabel[p]}</td>
                <td>{formatCurrency(cur)}</td>
                <td>{cmp?.value != null ? formatCurrency(cmp.value) : '-'}</td>
                <td>{cmp?.change != null ? `${Number(cmp.change).toFixed(1)}%` : '-'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }

  // Fallback: older shape with current/vsLastWeek/vsLastMonth
  return (
    <table className='comparison-table'>
      <thead>
        <tr>
          <th>Periodo</th>
          <th>{label}</th>
          <th>Vs Semana Pasada</th>
          <th>Vs Mes Pasado</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Actual</td>
          <td>{formatCurrency(data.current)}</td>
          <td>{data.vsLastWeek?.change != null ? `${Number(data.vsLastWeek.change).toFixed(1)}%` : '-'}</td>
          <td>{data.vsLastMonth?.change != null ? `${Number(data.vsLastMonth.change).toFixed(1)}%` : '-'}</td>
        </tr>
      </tbody>
    </table>
  )
}
