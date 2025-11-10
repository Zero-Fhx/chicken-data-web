import { AlertsFeed } from '@/components/Dashboard/AlertsFeed'
import { DashboardCard } from '@/components/Dashboard/DashboardCard'
import { useFetch } from '@/hooks/useFetch'
import API_ENDPOINTS from '@/services/api'

export function AlertsFeedCard ({ className = '' }) {
  // 1. Llama a su propio endpoint de alertas
  const { data: alertsData, loading, error, refetch } = useFetch(
    `${API_ENDPOINTS.dashboard}/alerts`
  )

  // 2. Pasa el objeto 'data' completo
  const alerts = alertsData?.data

  return (
    <DashboardCard
      title='Alertas y Notificaciones'
      // 3. Usa la prop className para el layout (span-1)
      className={className || 'span-1'}
      loading={loading}
      error={error}
      onRetry={refetch}
    >
      <AlertsFeed
        loading={loading}
        data={alerts}
        error={error}
      />
    </DashboardCard>
  )
}
