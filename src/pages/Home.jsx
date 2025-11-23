import { ComparisonsCard } from '@/components/Dashboard/ComparisonCard'
import { DashboardCard } from '@/components/Dashboard/DashboardCard'
import { FinancialSummary } from '@/components/Dashboard/FinancialSummary'
import { InventorySummaryCard } from '@/components/Dashboard/InventorySummaryCard'
import { PeriodSelector } from '@/components/Dashboard/PeriodSelector'
import { PurchasesCategoryChart } from '@/components/Dashboard/PurchasesCategoryChart'
import { PurchasesKpiCard } from '@/components/Dashboard/PurchasesKpiCard'
import { RecentActivityCard } from '@/components/Dashboard/RecentActivityCard'
import { SalesCategoryChart } from '@/components/Dashboard/SalesCategoryChart'
import { SalesKpiCard } from '@/components/Dashboard/SalesKpiCard'
import { TrendChart } from '@/components/Dashboard/TrendChart'
import { PageHeader } from '@/components/PageHeader'
import { Separator } from '@/components/Separator'
import { Select } from '@/components/ui/Select'
import { useFetch } from '@/hooks/useFetch'
import API_ENDPOINTS from '@/services/api'
import { useEffect, useState } from 'react'

import { AlertsFeedCard } from '@/components/Dashboard/AlertsFeedCard'
import { TopDishesCard } from '@/components/Dashboard/TopDishesCard'
import { TopSuppliersCard } from '@/components/Dashboard/TopSuppliersCard'
import '@/styles/Dashboard.css'

const API_STATS = `${API_ENDPOINTS.dashboard}/stats`
const API_ALERTS = `${API_ENDPOINTS.dashboard}/alerts`
// API_TRENDS ahora será dinámica
const API_PROJECTIONS = `${API_ENDPOINTS.dashboard}/projections?days=30`
const API_COMPARISONS = `${API_ENDPOINTS.dashboard}/comparisons`
const API_BREAKDOWN_SALES = `${API_ENDPOINTS.dashboard}/breakdown/sales`
const API_BREAKDOWN_PURCHASES = `${API_ENDPOINTS.dashboard}/breakdown/purchases`

// Mapa de opciones de período válidas para cada granularidad
// Basado en la API
const GRANULARITY_PERIOD_MAP = {
  daily: [
    { label: '7 días', value: '7d' },
    { label: '14 días', value: '14d' },
    { label: '30 días', value: '30d' },
    { label: '60 días', value: '60d' },
    { label: '90 días', value: '90d' }
  ],
  weekly: [
    { label: '4 semanas', value: '4w' },
    { label: '8 semanas', value: '8w' },
    { label: '12 semanas', value: '12w' },
    { label: '26 semanas', value: '26w' },
    { label: '52 semanas', value: '52w' }
  ],
  monthly: [
    { label: '3 meses', value: '3m' },
    { label: '6 meses', value: '6m' },
    { label: '12 meses', value: '12m' },
    { label: '24 meses', value: '24m' }
  ]
}

export function Home () {
  // FASE 5: Estados para controles avanzados
  const [trendPeriod, setTrendPeriod] = useState('7d')
  const [trendGranularity, setTrendGranularity] = useState('daily')
  const [trendType, setTrendType] = useState('both')
  const [projectionDays, setProjectionDays] = useState(30)
  const [salesBreakdownPeriod, setSalesBreakdownPeriod] = useState('month')
  const [purchasesBreakdownPeriod, setPurchasesBreakdownPeriod] = useState('month')
  const [financialPeriod, setFinancialPeriod] = useState('month')

  // FASE 5: URLs dinámicas
  const API_TRENDS = `${API_ENDPOINTS.dashboard}/trends?period=${trendPeriod}&granularity=${trendGranularity}`
  const API_PROJECTIONS = `${API_ENDPOINTS.dashboard}/projections?days=${projectionDays}`

  const { data, loading: financialLoading, error: _error } = useFetch(API_STATS)
  const { data: trendsData, loading: trendsLoading } = useFetch(API_TRENDS)
  const { data: projectionsData, loading: _projectionsLoading } = useFetch(API_PROJECTIONS)
  const { data: comparisonsData, loading: comparisonsLoading, error: comparisonsError, refetch: comparisonsRefetch } = useFetch(API_COMPARISONS)
  const { data: salesBreakdownData, loading: salesBreakdownLoading } = useFetch(API_BREAKDOWN_SALES)
  const { data: purchasesBreakdownData, loading: purchasesBreakdownLoading } = useFetch(API_BREAKDOWN_PURCHASES)

  const { success: _success, data: metrics } = data || {}
  const { sales: _sales, purchases: _purchases, inventory: _inventory, dishes: _dishes, suppliers: _suppliers, recentActivity: _recentActivity, financial } = metrics || {}
  const { data: trends } = trendsData || {}
  const { data: _projections } = projectionsData || {}
  const { data: comparisons } = comparisonsData || {}
  const { data: salesBreakdown } = salesBreakdownData || {}
  const { data: purchasesBreakdown } = purchasesBreakdownData || {}

  // FASE 5: Hook para sincronizar el período con la granularidad
  useEffect(() => {
    // 1. Obtiene la lista de períodos válidos para la granularidad actual
    const validPeriods = GRANULARITY_PERIOD_MAP[trendGranularity]

    // 2. Comprueba si el período actual está en esa lista
    const isCurrentPeriodValid = validPeriods.some(
      option => option.value === trendPeriod
    )

    // 3. Si no es válido, resetea el período al primer valor de la nueva lista
    if (!isCurrentPeriodValid) {
      setTrendPeriod(validPeriods[0].value)
    }
    // Ejecutar este efecto solo si 'trendGranularity' cambia
  }, [trendGranularity, trendPeriod])

  // FASE 5: Controles para las tarjetas
  // --- TAREA 21: Añadir opción 'Ambos' y usar labels ---
  const trendToggleControls = (
    <PeriodSelector
      selectedPeriod={trendType}
      onPeriodChange={setTrendType}
      // Añadimos las tres opciones
      availablePeriods={['sales', 'purchases', 'both']}
      labels={{ sales: 'Ventas', purchases: 'Compras', both: 'Ambos' }}
      groupName='trend-type'
    />
  )

  const trendControls = (
    <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
      {trendToggleControls}
      <div className='controls-separator' />
      <div className='period-selector'>
        <Select
          className='tab'
          value={trendGranularity}
          onChange={(val) => setTrendGranularity(val)}
          options={[{ label: 'Diario', value: 'daily' }, { label: 'Semanal', value: 'weekly' }, { label: 'Mensual', value: 'monthly' }]}
        />
        <Select
          className='tab'
          value={trendPeriod}
          onChange={(val) => setTrendPeriod(val)}
          // ¡Usa el mapa dinámico según la granularidad seleccionada!
          options={GRANULARITY_PERIOD_MAP[trendGranularity]}
        />
      </div>
    </div>
  )

  const _projectionControls = (
    <div className='card-controls'>
      <span>Proyectar:</span>
      <Select
        value={String(projectionDays)}
        onChange={(val) => setProjectionDays(Number(val))}
        options={[{ label: '30 días', value: '30' }, { label: '60 días', value: '60' }]}
      />
    </div>
  )

  const salesBreakdownControls = (
    <PeriodSelector
      selectedPeriod={salesBreakdownPeriod}
      onPeriodChange={setSalesBreakdownPeriod}
      availablePeriods={['week', 'month', 'year']}
      groupName='sales-breakdown-period'
    />
  )

  const purchasesBreakdownControls = (
    <PeriodSelector
      selectedPeriod={purchasesBreakdownPeriod}
      onPeriodChange={setPurchasesBreakdownPeriod}
      availablePeriods={['week', 'month', 'year']}
      groupName='purchases-breakdown-period'
    />
  )

  // --- CORRECCIÓN: Re-añadir este bloque ---
  const financialControls = (
    <PeriodSelector
      selectedPeriod={financialPeriod}
      onPeriodChange={setFinancialPeriod}
      availablePeriods={['today', 'week', 'month']}
      groupName='financial-period'
    />
  )

  return (
    <div>
      <PageHeader
        title='Dashboard'
        description='Resumen ejecutivo de ventas, compras, inventario y métricas clave del negocio.'
      />

      <Separator />

      {/* --- TAREA FASE 5: Grid con controles en tarjetas --- */}
      <div className='dashboard-grid'>
        {/* Fila 1: KPIs Principales */}
        <SalesKpiCard />
        <PurchasesKpiCard />
        <InventorySummaryCard className='span-1' />
        <RecentActivityCard className='span-1' />

        {/* Fila 2: Gráfico Principal */}
        <DashboardCard
          title='Tendencia'
          className='span-3'
          loading={trendsLoading}
          cardControls={
            <div style={{ display: 'flex', gap: '1rem', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
              {trendControls}
            </div>
          }
        >
          <TrendChart data={trends} dataType={trendType} period={trendPeriod} />
        </DashboardCard>

        <AlertsFeedCard className='span-1 span-md-2' />

        {/* Fila 3: Desgloses (Sin cambios) */}
        <DashboardCard
          title='Ventas por Categoría'
          className='span-2'
          loading={salesBreakdownLoading}
          cardControls={salesBreakdownControls}
        >
          <SalesCategoryChart data={salesBreakdown?.byCategory} period={salesBreakdownPeriod} />
        </DashboardCard>

        <DashboardCard
          title='Compras por Categoría'
          className='span-2'
          loading={purchasesBreakdownLoading}
          cardControls={purchasesBreakdownControls}
        >
          <PurchasesCategoryChart data={purchasesBreakdown?.byCategory} period={purchasesBreakdownPeriod} />
        </DashboardCard>

        {/* Fila 4: Listas (Sin cambios) */}
        <TopDishesCard />
        <TopSuppliersCard />

        {/* Fila 5: Proyecciones + Comparaciones: ocuparán la misma fila (cada una span-2) */}
        {/* <ProjectionsCard className='span-2' /> */}
        <ComparisonsCard
          className='span-2'
          comparisonsData={comparisons}
          loading={comparisonsLoading}
          error={comparisonsError}
          refetch={comparisonsRefetch}
        />

        {/* --- TAREA 15: Fila 7 (Combinada) --- */}
        <DashboardCard
          title='Resumen: Métricas Financieras'
          className='span-2'
          loading={financialLoading}
          cardControls={financialControls}
        >
          <FinancialSummary data={financial} period={financialPeriod} />
        </DashboardCard>

        {/* <AlertsKpiCard className='span-2' /> */}

      </div>
      {/* --- Fin del Grid --- */}

    </div>
  )
}
