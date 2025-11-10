import { useFetch } from '@/hooks/useFetch'
import API_ENDPOINTS from '@/services/api'
import { useState } from 'react'
import { DashboardCard } from './DashboardCard'
import { DishesComparisonTable } from './DishesComparisonTable'
import { PeriodSelector } from './PeriodSelector'
import { PurchasesComparisonTable } from './PurchasesComparisonTable'

export function ComparisonsCard ({ className = 'span-2' }) {
  const { data: comparisonsResp, loading, error, refetch } = useFetch(`${API_ENDPOINTS.dashboard}/comparisons`)
  const comparisons = comparisonsResp?.data
  const [view, setView] = useState('sales')

  const controls = (
    <PeriodSelector
      selectedPeriod={view}
      onPeriodChange={setView}
      options={[
        { value: 'sales', label: 'Ventas' },
        { value: 'purchases', label: 'Compras' },
        { value: 'dishes', label: 'Platos' }
      ]}
      groupName='comparisons-view'
    />
  )

  return (
    <DashboardCard title='Comparaciones' className={className} loading={loading} error={error} onRetry={refetch} cardControls={controls}>
      {view === 'sales' && (
        <PurchasesComparisonTable data={comparisons?.sales} label='Ventas' />
      )}

      {view === 'purchases' && (
        <PurchasesComparisonTable data={comparisons?.purchases} />
      )}

      {/* Inventory comparisons omitted by request */}

      {view === 'dishes' && (
        <DishesComparisonTable data={comparisons?.dishes} />
      )}
    </DashboardCard>
  )
}
