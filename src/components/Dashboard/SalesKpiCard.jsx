import { KpiCard } from '@/components/Dashboard/KpiCard' // <- Único import de UI
import { PeriodSelector } from '@/components/Dashboard/PeriodSelector'
import { useFetch } from '@/hooks/useFetch'
import API_ENDPOINTS from '@/services/api'
import { useState } from 'react'

const formatCurrency = (value) => `S/. ${(Number(value) || 0).toFixed(2)}`

export function SalesKpiCard () {
  const [period, setPeriod] = useState('today')

  const { data: salesData, loading, error, refetch } = useFetch(
    `${API_ENDPOINTS.dashboard}/stats/sales`
  )

  const periodData = salesData?.data ? salesData.data[period] : null
  const value = formatCurrency(periodData?.total)
  const availablePeriods = ['today', 'week', 'month']

  // Definimos los controles aquí mismo
  const controls = (
    <PeriodSelector
      selectedPeriod={period}
      onPeriodChange={setPeriod}
      availablePeriods={availablePeriods}
      groupName='sales-period'
    />
  )

  return (
    // --- TAREA 20: Ya no usa DashboardCard ---
    <KpiCard
      title='Ventas'
      loading={loading}
      error={error}
      onRetry={refetch}
      value={value}
      growth={periodData?.growth}
      cardControls={controls}
    />
  )
}
