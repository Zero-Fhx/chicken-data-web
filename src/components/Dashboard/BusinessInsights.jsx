import { DashboardCard } from '@/components/Dashboard/DashboardCard'
import {
  ChartIcon,
  CheckIcon,
  CubeIcon,
  DollarIcon,
  LightbulbIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  TrophyIcon,
  WarningIcon
} from '@/components/Icons'
import '@/styles/BusinessInsights.css'

export function BusinessInsights ({ comparisons, trends, inventory, salesBreakdown, purchasesBreakdown }) {
  const insights = []

  // Insight 1: Comparación de ventas vs período anterior
  if (comparisons?.sales) {
    const current = comparisons.sales.current || comparisons.sales.today?.total
    const previous = comparisons.sales.previous || comparisons.sales.week?.total

    if (current && previous && previous > 0) {
      const change = ((current - previous) / previous * 100).toFixed(1)
      const isPositive = change > 0
      insights.push({
        icon: isPositive ? <TrendingUpIcon width={20} height={20} /> : <TrendingDownIcon width={20} height={20} />,
        text: `Ventas: ${isPositive ? '+' : ''}${change}% vs período anterior`,
        type: isPositive ? 'success' : 'warning'
      })
    }
  }

  // Insight 2: Comparación de compras vs período anterior
  if (comparisons?.purchases) {
    const current = comparisons.purchases.current || comparisons.purchases.today?.total
    const previous = comparisons.purchases.previous || comparisons.purchases.week?.total

    if (current && previous && previous > 0) {
      const change = ((current - previous) / previous * 100).toFixed(1)
      insights.push({
        icon: <CubeIcon width={20} height={20} />,
        text: `Compras: ${change > 0 ? '+' : ''}${change}% vs período anterior`,
        type: 'info'
      })
    }
  }

  // Insight 3: Margen estimado (calculado de trends)
  if (trends?.sales && trends?.purchases && Array.isArray(trends.sales) && Array.isArray(trends.purchases)) {
    const totalRevenue = trends.sales.reduce((sum, item) => sum + Number(item.revenue || item.total || 0), 0)
    const totalCost = trends.purchases.reduce((sum, item) => sum + Number(item.cost || item.total || 0), 0)

    if (totalRevenue > 0) {
      const margin = ((totalRevenue - totalCost) / totalRevenue * 100).toFixed(1)
      const marginNum = parseFloat(margin)
      insights.push({
        icon: marginNum > 20 ? <DollarIcon width={20} height={20} /> : marginNum > 10 ? <ChartIcon width={20} height={20} /> : <WarningIcon width={20} height={20} />,
        text: `Margen de ganancia: ${margin}%`,
        type: marginNum > 20 ? 'success' : marginNum > 10 ? 'warning' : 'danger'
      })
    }
  }

  // Insight 4: Stock (de inventory)
  if (inventory) {
    const totalItems = inventory.totalItems || inventory.total || inventory.count
    const lowStockCount = inventory.lowStock || inventory.lowStockCount || inventory.criticalStock

    if (lowStockCount && lowStockCount > 0) {
      insights.push({
        icon: <WarningIcon width={20} height={20} />,
        text: `${lowStockCount} producto${lowStockCount > 1 ? 's' : ''} con stock bajo`,
        type: 'warning'
      })
    } else if (totalItems && totalItems > 0) {
      insights.push({
        icon: <CheckIcon width={20} height={20} />,
        text: `Inventario saludable: ${totalItems} productos`,
        type: 'success'
      })
    }
  }

  // Insight 5: Mejor categoría de ventas
  if (salesBreakdown?.byCategory && Array.isArray(salesBreakdown.byCategory) && salesBreakdown.byCategory.length > 0) {
    const sorted = [...salesBreakdown.byCategory]
      .filter(cat => cat.total || cat.revenue || cat.sales)
      .sort((a, b) => {
        const aVal = a.total || a.revenue || a.sales || 0
        const bVal = b.total || b.revenue || b.sales || 0
        return bVal - aVal
      })

    if (sorted.length > 0 && sorted[0].category) {
      insights.push({
        icon: <TrophyIcon width={20} height={20} />,
        text: `Mejor categoría de ventas: ${sorted[0].category}`,
        type: 'success'
      })
    }
  }

  // Insight 6: Análisis de tendencia general (si hay trends)
  if (trends?.sales && Array.isArray(trends.sales) && trends.sales.length >= 2) {
    const recent = trends.sales.slice(-3).reduce((sum, item) => sum + Number(item.revenue || item.total || 0), 0) / 3
    const older = trends.sales.slice(0, 3).reduce((sum, item) => sum + Number(item.revenue || item.total || 0), 0) / 3

    if (recent > 0 && older > 0) {
      const trendChange = ((recent - older) / older * 100).toFixed(1)
      if (Math.abs(trendChange) > 5) {
        insights.push({
          icon: trendChange > 0 ? <TrendingUpIcon width={20} height={20} /> : <TrendingDownIcon width={20} height={20} />,
          text: `Tendencia ${trendChange > 0 ? 'creciente' : 'decreciente'}: ${Math.abs(trendChange)}%`,
          type: trendChange > 0 ? 'success' : 'info'
        })
      }
    }
  }

  // Si no hay suficientes insights, agregar mensaje
  if (insights.length === 0) {
    insights.push({
      icon: <LightbulbIcon width={20} height={20} />,
      text: 'Esperando datos para generar insights...',
      type: 'info'
    })
  }

  return (
    <DashboardCard title='Insights del Negocio' className='span-2' icon={<LightbulbIcon width={20} height={20} />}>
      <div className='business-insights'>
        {insights.map((insight, index) => (
          <div key={index} className={`insight-item insight-${insight.type}`}>
            <span className='insight-icon'>{insight.icon}</span>
            <span className='insight-text'>{insight.text}</span>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
