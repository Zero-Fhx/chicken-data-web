import { DashboardCard } from '@/components/Dashboard/DashboardCard'
import { RecentActivityFeed } from '@/components/Dashboard/RecentActivityFeed'
import { useFetch } from '@/hooks/useFetch'
import API_ENDPOINTS from '@/services/api'

export function RecentActivityCard ({ className = '' }) {
  // Llama a su propio endpoint de actividad
  const {
    data: activityData,
    loading,
    error,
    refetch
  } = useFetch(`${API_ENDPOINTS.dashboard}/stats/activity`)

  const recentActivity = activityData?.data

  return (
    <DashboardCard
      title='Actividad Reciente'
      className={className || 'span-2'} // Usa el className de la prop
      loading={loading}
      error={error}
      onRetry={refetch}
    >
      <RecentActivityFeed
        loading={loading}
        data={recentActivity}
      />
    </DashboardCard>
  )
}
