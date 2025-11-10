import { KpiCard } from '@/components/Dashboard/KpiCard'
import { PeriodSelector } from '@/components/Dashboard/PeriodSelector'
import { useFetch } from '@/hooks/useFetch'
import API_ENDPOINTS from '@/services/api'
import { useState } from 'react'

const formatCurrency = (value) => `S/. ${(Number(value) || 0).toFixed(2)}`

export function PurchasesKpiCard () {
  const [period, setPeriod] = useState('today')

  const { data: purchasesData, loading, error, refetch } = useFetch(
    `${API_ENDPOINTS.dashboard}/stats/purchases`
  )

  const periodData = purchasesData?.data ? purchasesData.data[period] : null
  const value = formatCurrency(periodData?.total)
  const availablePeriods = ['today', 'week', 'month']

  const controls = (
    <PeriodSelector
      selectedPeriod={period}
      onPeriodChange={setPeriod}
      availablePeriods={availablePeriods}
      groupName='purchases-period'
    />
  )

  return (
    // --- TAREA 20: Ya no usa DashboardCard ---
    <KpiCard
      title='Compras'
      loading={loading}
      error={error}
      onRetry={refetch}
      value={value}
      growth={periodData?.growth}
      cardControls={controls}
    />
  )
}
