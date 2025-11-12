import { useFetch } from '@/hooks/useFetch'
import API_ENDPOINTS from '@/services/api'
import '@/styles/PurchaseRecommendations.css'
import { useState } from 'react'
import { DashboardCard } from './DashboardCard'
import { PeriodSelector } from './PeriodSelector'
import { SalesProjections } from './SalesProjections'
import { StockDepletionList } from './StockDepletionList'

export function ProjectionsCard ({ className = 'span-2' }) {
  const { data: projectionsResp, loading, error, refetch } = useFetch(`${API_ENDPOINTS.dashboard}/projections`)
  const projections = projectionsResp?.data
  const [view, setView] = useState('recommendations')

  const controls = (
    <PeriodSelector
      selectedPeriod={view}
      onPeriodChange={setView}
      // Pasamos opciones personalizadas para que los valores sean semánticos
      options={[
        { value: 'recommendations', label: 'Recomendaciones' },
        { value: 'sales', label: 'Proy. Ventas' },
        { value: 'depletion', label: 'Agotamiento' }
      ]}
      groupName='projections-view'
    />
  )

  return (
    <DashboardCard
      title='Proyecciones'
      className={className}
      loading={loading}
      error={error}
      onRetry={refetch}
      cardControls={controls}
    >
      {/* Render según la vista seleccionada usando los mismos contenidos previos */}
      {view === 'recommendations' && (
        <div className='purchase-recommendations-wrapper'>
          {/* Summary destacado */}
          {projections?.purchases?.summary && (
            <div className='purchase-recommendations-summary card-highlight'>
              <div className='summary-item'><strong>Items:</strong> <span className='summary-value'>{projections.purchases.summary.totalItems}</span></div>
              <div className='summary-item'><strong>Prioridad media:</strong> <span className='summary-value'>{projections.purchases.summary.mediumPriorityItems}</span></div>
              <div className='summary-item'><strong>Costo estimado:</strong> <span className='summary-value'>S/. {Number(projections.purchases.summary.estimatedTotalCost || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
              {projections.purchases.summary.nextPurchaseDate && (
                <div className='summary-item'><strong>Próxima compra:</strong> <span className='summary-value'>{projections.purchases.summary.nextPurchaseDate.date} ({projections.purchases.summary.nextPurchaseDate.daysFromNow} días)</span></div>
              )}
            </div>
          )}

          {/* Tabla compacta: mostrar solo columnas esenciales */}
          <div className='purchase-recommendations-wrapper'> {/* Wrapper EXTERIOR (para border-radius) */}
            <div className='table-scroll-wrapper'> {/* Wrapper INTERIOR (para scroll) */}
              <table className='purchase-recommendations-table compact'>
                <thead>
                  <tr>
                    <th>Ingrediente</th>
                    <th>Stock</th>
                    <th>Días</th>
                    <th>Cantidad rec.</th>
                    <th>Costo</th>
                    <th>Prioridad</th>
                  </tr>
                </thead>
                <tbody>
                  {projections?.purchases?.recommendations?.map(rec => (
                    <tr key={rec.ingredientId ?? rec.ingredientName}>
                      <td>{rec.ingredientName}</td>
                      <td className='stock-small'>{rec.currentStock != null ? Number(rec.currentStock).toFixed(2) : '-'}</td>
                      <td>{rec.daysUntilDepleted != null ? Number(rec.daysUntilDepleted).toFixed(1) : '-'}</td>
                      <td>{rec.recommendedOrderQuantity ?? rec.recommendedAmount ?? '-'}</td>
                      <td>{rec.estimatedCost != null ? `S/. ${Number(rec.estimatedCost).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}</td>
                      <td>
                        <span className={`priority-chip ${rec.priority === 'high' ? 'priority-alta' : rec.priority === 'low' ? 'priority-baja' : 'priority-media'}`}>
                          {rec.priority === 'high' ? 'Alta' : rec.priority === 'low' ? 'Baja' : 'Media'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {view === 'sales' && (
        <SalesProjections data={projections?.sales} />
      )}

      {view === 'depletion' && (
        <StockDepletionList data={projections?.stock} />
      )}
    </DashboardCard>
  )
}
