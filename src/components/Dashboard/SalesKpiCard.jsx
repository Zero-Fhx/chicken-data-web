// fileName: SalesKpiCard.jsx (REEMPLAZAR ARCHIVO COMPLETO)

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

export function SalesKpiCard () {
  const [period, setPeriod] = useState('today')

  // Hook 1: Para los números (S/. 28.50 y ▲ 58.3%)
  const { data: salesData, loading: statsLoading, error: statsError, refetch: refetchStats } = useFetch(
    `${API_ENDPOINTS.dashboard}/stats/sales`
  )

  // Hook 2: Para los datos del mini-gráfico
  const trendApiUrl = useMemo(() => {
    const params = getTrendParams(period)
    return `${API_ENDPOINTS.dashboard}/trends?${params}`
  }, [period])
  const { data: trendsData, loading: trendsLoading, error: trendsError, refetch: refetchTrends } = useFetch(trendApiUrl)

  // Lógica de datos
  const periodData = salesData?.data ? salesData.data[period] : null
  const value = formatCurrency(periodData?.total)
  const availablePeriods = ['today', 'week', 'month']

  const controls = (
    <PeriodSelector
      selectedPeriod={period}
      onPeriodChange={setPeriod}
      availablePeriods={availablePeriods}
      groupName='sales-period'
    />
  )

  const refetchAll = () => {
    refetchStats()
    refetchTrends()
  }

  return (
    <KpiCard
      title='Ventas'
      // --- CAMBIOS CLAVE AQUÍ ---
      statsLoading={statsLoading}       // 1. Loading solo para los stats
      trendsLoading={trendsLoading}     // 2. Loading solo para el gráfico
      period={period}                 // 3. Pasa el período para el título
      error={statsError || trendsError} // 4. Combina los errores
      // --- FIN CAMBIOS ---
      onRetry={refetchAll}
      value={value}
      growth={periodData?.growth}
      cardControls={controls}
      sparklineData={trendsData?.data?.sales}
    />
  )
}
