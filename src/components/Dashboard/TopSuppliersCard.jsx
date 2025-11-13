import { DashboardCard } from '@/components/Dashboard/DashboardCard'
import { TopSuppliersList } from '@/components/Dashboard/TopSuppliersList'
import { useFetch } from '@/hooks/useFetch'
import API_ENDPOINTS from '@/services/api'

export function TopSuppliersCard () {
  // Llama a su propio endpoint
  const { data: suppliersData, loading, error, refetch } = useFetch(
    `${API_ENDPOINTS.dashboard}/stats/suppliers`
  )

  const topSuppliers = suppliersData?.data?.topSuppliers

  return (
    <DashboardCard
      title='Proveedores Principales del Mes'
      className='span-2'
      loading={loading}
      error={error}
      onRetry={refetch}
    >
      <TopSuppliersList
        loading={loading}
        data={topSuppliers}
      />
    </DashboardCard>
  )
}
