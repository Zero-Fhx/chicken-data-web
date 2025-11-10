import { DashboardCard } from '@/components/Dashboard/DashboardCard'
import { useFetch } from '@/hooks/useFetch'
import API_ENDPOINTS from '@/services/api'
// --- TAREA 14: Importar el nuevo componente de UI ---
import { InventorySummary } from '@/components/Dashboard/InventorySummary'

export function InventorySummaryCard ({ className = '' }) {
  // La llamada a la API es la misma, lo cual es eficiente
  const { data: inventoryData, loading, error, refetch } = useFetch(
    `${API_ENDPOINTS.dashboard}/stats/inventory`
  )

  // Pasamos el objeto 'data' completo
  const inventory = inventoryData?.data

  return (
    <DashboardCard
      title='Resumen de Inventario'
      // --- TAREA 15: Usar la prop 'className' ---
      className={`${className || 'span-2'} inventory-card`} // Default a span-2 si no se pasa nada
      loading={loading}
      error={error}
      onRetry={refetch}
    >
      <InventorySummary
        loading={loading}
        data={inventory}
        error={error}
      />
    </DashboardCard>
  )
}
