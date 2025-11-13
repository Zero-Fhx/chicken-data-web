// fileName: PurchaseRecommendations.jsx (Código completo v3)

import { useFetch } from '@/hooks/useFetch'
import API_ENDPOINTS from '@/services/api'
import '@/styles/PurchaseRecommendations.css'
import { useState } from 'react'
import { DashboardCard } from './DashboardCard'
import { PeriodSelector } from './PeriodSelector'
import { PriorityBar } from './PriorityBar'
import { SalesProjections } from './SalesProjections'
import { StockDepletionList } from './StockDepletionList' // Ya lo estabas importando

const formatCurrency = (v) => {
  if (v == null) return 'N/A'
  return `S/. ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function ProjectionsCard ({ className = 'span-2' }) {
  const { data: projectionsResp, loading, error, refetch } = useFetch(`${API_ENDPOINTS.dashboard}/projections`)
  const projections = projectionsResp?.data

  // 1. VISTA POR DEFECTO AHORA ES 'recommendations'
  const [view, setView] = useState('recommendations')
  const [isTableOpen, setIsTableOpen] = useState(false)

  const controls = (
    <PeriodSelector
      selectedPeriod={view}
      onPeriodChange={setView}
      // 2. ELIMINAR "Agotamiento" de las opciones
      options={[
        { value: 'recommendations', label: 'Recomendaciones' },
        { value: 'sales', label: 'Proy. Ventas' }
      ]}
      groupName='projections-view'
    />
  )

  const summary = projections?.purchases?.summary

  return (
    <DashboardCard
      title='Proyecciones'
      className={className}
      loading={loading}
      error={error}
      onRetry={refetch}
      cardControls={controls}
    >
      {view === 'recommendations' && (
        <div className='recommendations-v2'>

          <div className='kpi-grid'>
            <div className='kpi-item'>
              <span className='kpi-item-value'>{summary?.totalItems ?? 0}</span>
              <span className='kpi-item-label'>Ingredientes a comprar</span>
            </div>
            <div className='kpi-item'>
              <span className='kpi-item-value'>{formatCurrency(summary?.estimatedTotalCost)}</span>
              <span className='kpi-item-label'>Costo Estimado</span>
            </div>
          </div>

          <div className='priority-bar-wrapper'>
            <h4 className='recommendations-subtitle'>Prioridad de Compra</h4>
            <PriorityBar
              high={summary?.highPriorityItems ?? 0}
              medium={summary?.mediumPriorityItems ?? 0}
              low={summary?.lowPriorityItems ?? 0}
            />
          </div>

          <div className='table-wrapper'>
            <details open={isTableOpen} onToggle={(e) => setIsTableOpen(e.currentTarget.open)}>
              <summary className='table-summary-toggle'>
                {/* SVG incrustado */}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 16 16'
                  fill='currentColor'
                  className='table-toggle-icon'
                >
                  <path d='M4.97 4.03a.75.75 0 0 0 0 1.06L7.94 8l-2.97 2.97a.75.75 0 0 0 1.06 1.06l3.5-3.5a.75.75 0 0 0 0-1.06l-3.5-3.5a.75.75 0 0 0-1.06 0z' />
                </svg>
                {isTableOpen ? 'Ocultar detalle' : 'Mostrar detalle de items'}
              </summary>

              {/* 3. USAR 'StockDepletionList' AQUÍ */}
              <div style={{ marginTop: '12px' }}>
                <StockDepletionList data={projections?.stock} />
              </div>
            </details>
          </div>
        </div>
      )}

      {view === 'sales' && (
        <SalesProjections data={projections?.sales} />
      )}

      {/* 4. ELIMINAR EL 'view === 'depletion' */}

    </DashboardCard>
  )
}
