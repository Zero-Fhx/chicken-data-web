import { DashboardCard } from '@/components/Dashboard/DashboardCard'
import { KpiCard } from '@/components/Dashboard/KpiCard'
import { useFetch } from '@/hooks/useFetch'
import API_ENDPOINTS from '@/services/api'

const formatCurrency = (value) => `S/. ${(Number(value) || 0).toFixed(2)}`

// Este es más simple: no tiene selector de período
export function InventoryKpiCard () {
  const {
    data: inventoryData,
    loading,
    error,
    refetch
  } = useFetch(`${API_ENDPOINTS.dashboard}/stats/inventory`)

  const value = formatCurrency(inventoryData?.data?.totalValue)

  return (
    <DashboardCard title='Valor Inventario' loading={loading} error={error} onRetry={refetch}>
      <KpiCard
        loading={loading}
        error={error}
        onRetry={refetch}
        value={value}
      />
    </DashboardCard>
  )
}
