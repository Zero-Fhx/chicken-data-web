import '../../styles/FinancialSummary.css'

const formatCurrency = (v) => {
  if (v == null) return 'N/A'
  return `S/. ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const formatNumber = (v, digits = 2) => (v == null ? 'N/A' : Number(v).toLocaleString('es-PE', { minimumFractionDigits: digits, maximumFractionDigits: digits }))

export function SalesProjections ({ data }) {
  if (!data) return <div>No hay datos de proyección de ventas.</div>

  return (
    <div className='financial-summary'>
      <div className='projections-summary'>
        <div className='proj-item'>
          <div className='proj-label'>Periodo</div>
          <div className='proj-value'>{data.period ?? '30 días'}</div>
        </div>

        <div className='proj-item'>
          <div className='proj-label'>Ingresos proyectados</div>
          <div className='proj-value highlight'>{formatCurrency(data.projectedRevenue)}</div>
        </div>

        <div className='proj-item'>
          <div className='proj-label'>Órdenes proyectadas</div>
          <div className='proj-value'>{formatNumber(data.projectedOrders, 0)}</div>
        </div>

        <div className='proj-item'>
          <div className='proj-label'>Órdenes promedio/día</div>
          <div className='proj-value'>{formatNumber(data.avgOrdersPerDay, 2)}</div>
        </div>

        <div className='proj-item'>
          <div className='proj-label'>Ingreso promedio/día</div>
          <div className='proj-value'>{formatCurrency(data.avgRevenuePerDay)}</div>
        </div>

        <div className='proj-range'>
          <div className='proj-label'>Rango estimado</div>
          <div className='proj-range-values'>
            <small className='range-conservative'>Conservador: {formatCurrency(data.range?.conservative)}</small>
            <br />
            <small className='range-optimistic'>Optimista: {formatCurrency(data.range?.optimistic)}</small>
          </div>
        </div>
      </div>
    </div>
  )
}
