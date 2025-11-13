// fileName: PurchasesKpiCard.jsx (REEMPLAZAR ARCHIVO COMPLETO)

import { KpiCard } from '@/components/Dashboard/KpiCard'
import { PeriodSelector } from '@/components/Dashboard/PeriodSelector'
import { useFetch } from '@/hooks/useFetch'
import API_ENDPOINTS from '@/services/api'
import { useMemo, useState } from 'react'

const formatCurrency = (value) => `S/. ${(Number(value) || 0).toFixed(2)}`

const getTrendParams = (period) => {
  switch (period) {
    case 'today':
      return 'period=1d&granularity=hourly'
    case 'week':
      return 'period=7d&granularity=daily'
    case 'month':
      return 'period=30d&granularity=daily'
    default:
      return 'period=7d&granularity=daily'
  }
}

export function PurchasesKpiCard () {
  const [period, setPeriod] = useState('today')

  // Hook 1: Para los números
  const { data: purchasesData, loading: statsLoading, error: statsError, refetch: refetchStats } = useFetch(
    `${API_ENDPOINTS.dashboard}/stats/purchases`
  )

  // Hook 2: Para los datos del mini-gráfico
  const trendApiUrl = useMemo(() => {
    const params = getTrendParams(period)
    return `${API_ENDPOINTS.dashboard}/trends?${params}`
  }, [period])
  const { data: trendsData, loading: trendsLoading, error: trendsError, refetch: refetchTrends } = useFetch(trendApiUrl)

  // Lógica de datos
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

  const refetchAll = () => {
    refetchStats()
    refetchTrends()
  }

  return (
    <KpiCard
      title='Compras'
      // --- CAMBIOS CLAVE AQUÍ ---
      statsLoading={statsLoading}
      trendsLoading={trendsLoading}
      period={period}
      error={statsError || trendsError}
      // --- FIN CAMBIOS ---
      onRetry={refetchAll}
      value={value}
      growth={periodData?.growth}
      cardControls={controls}
      sparklineData={trendsData?.data?.purchases}
    />
  )
}
