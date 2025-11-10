import { DashboardCard } from '@/components/Dashboard/DashboardCard'
import { KpiCard } from '@/components/Dashboard/KpiCard'
import { useFetch } from '@/hooks/useFetch'
import API_ENDPOINTS from '@/services/api'

export function AlertsKpiCard ({ className = '' }) {
  // 1. Llama al mismo endpoint de alertas
  const { data: alertsData, loading, error, refetch } = useFetch(
    `${API_ENDPOINTS.dashboard}/alerts`
  )

  // 2. Extrae solo el dato que necesita: summary.critical
  const criticalCount = alertsData?.data?.summary?.critical ?? 0

  return (
    <DashboardCard
      title='Alertas Críticas (KPI)'
      className={className || 'span-2'} // Default a span-2
      loading={loading}
      error={error}
      onRetry={refetch}
    >
      <KpiCard
        loading={loading}
        error={error}
        onRetry={refetch}
        value={criticalCount}
      />
    </DashboardCard>
  )
}
