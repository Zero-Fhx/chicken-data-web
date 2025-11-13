// fileName: ComparisonsCard.jsx (REEMPLAZAR ARCHIVO COMPLETO)

import { useState } from 'react'
import { ComparisonKpiView } from './ComparisonKpiView'
import { DashboardCard } from './DashboardCard'
import { DishesComparisonTable } from './DishesComparisonTable'
import { PeriodSelector } from './PeriodSelector'

// 1. ACEPTA PROPS (ya no usa useFetch)
export function ComparisonsCard ({
  className = 'span-2',
  comparisonsData,
  loading,
  error,
  refetch
}) {
  const [view, setView] = useState('sales')
  const [period, setPeriod] = useState('week')

  // 2. USA LOS DATOS DE LAS PROPS
  const comparisons = comparisonsData

  const viewControls = (
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

  const periodControls = (
    <PeriodSelector
      selectedPeriod={period}
      onPeriodChange={setPeriod}
      availablePeriods={['today', 'week', 'month', 'year']}
      groupName='comparisons-period'
    />
  )

  const renderContent = () => {
    if (view === 'sales') {
      return (
        <ComparisonKpiView
          data={comparisons?.sales}
          period={period}
          label='Ventas'
        />
      )
    }
    if (view === 'purchases') {
      return (
        <ComparisonKpiView
          data={comparisons?.purchases}
          period={period}
          label='Compras'
        />
      )
    }
    if (view === 'dishes') {
      return <DishesComparisonTable data={comparisons?.dishes} />
    }
    return null
  }

  return (
    <DashboardCard
      title='Comparaciones'
      className={className}
      // 3. PASA LAS PROPS AL WRAPPER
      loading={loading}
      error={error}
      onRetry={refetch}
      cardControls={
        <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'row' }}>
          {viewControls}
          {view !== 'dishes' && <div className='controls-separator' />}
          {view !== 'dishes' && periodControls}
        </div>
      }
    >
      {renderContent()}
    </DashboardCard>
  )
}
