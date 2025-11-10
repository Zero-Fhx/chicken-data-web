// --- CORRECCIÓN: Ya no importa useState ni PeriodSelector ---
import '@/styles/FinancialSummary.css'

const formatCurrency = (value) => `S/. ${(Number(value) || 0).toFixed(2)}`

// Mapeo de períodos a Español
const periodLabels = {
  today: 'Hoy',
  week: 'Semana',
  month: 'Mes'
}

// --- CORRECCIÓN: Vuelve a aceptar 'period' como prop ---
export function FinancialSummary ({ loading, data, period = 'month' }) {
  // Dejar que el wrapper muestre Loader/ErrorState
  if (loading) return null
  if (!data) return <p>No hay datos financieros.</p>

  const { profitMargin, roi, costs, profit } = data
  const periodLabel = periodLabels[period] || 'Mes'

  return (
    <div className='financial-summary'>

      {/* --- SECCIÓN DINÁMICA --- */}
      {/* --- CORRECCIÓN: El PeriodSelector se ha quitado de aquí --- */}
      <div className='financial-dynamic-grid'>
        <div className='financial-item'>
          <h4 className='financial-title'>Margen ({periodLabel})</h4>
          <p className='financial-value'>{profitMargin?.[period] ?? 0}%</p>
        </div>
        <div className='financial-item'>
          <h4 className='financial-title'>Utilidad ({periodLabel})</h4>
          <p className='financial-value'>{formatCurrency(profit?.[period])}</p>
        </div>
      </div>

      {/* --- SEPARADOR (Se mantiene) --- */}
      <hr className='financial-separator' />

      {/* --- SECCIÓN ESTÁTICA (Se mantiene) --- */}
      <div className='financial-static-grid'>
        <div className='financial-item'>
          <h4 className='financial-title'>
            ROI del Mes
            <span
              className='help-tooltip'
              title='Retorno de Inversión (Mensual): Mide la ganancia neta en relación al costo.'
            >
              ?
            </span>
          </h4>
          <p className='financial-value'>{roi?.month ?? 0}%</p>
        </div>
        <div className='financial-item'>
          <h4 className='financial-title'>Costo Alimentos</h4>
          <p className='financial-value'>{costs?.foodCostPercentage ?? 0}%</p>
        </div>
        <div className='financial-item'>
          <h4 className='financial-title'>Costo Prom. p/ Plato</h4>
          <p className='financial-value'>
            {formatCurrency(costs?.averageCostPerDish)}
          </p>
        </div>
        <div className='financial-item'>
          <h4 className='financial-title'>Utilidad Prom. p/ Plato</h4>
          <p className='financial-value'>
            {formatCurrency(profit?.averageProfitPerDish)}
          </p>
        </div>
      </div>

    </div>
  )
}
