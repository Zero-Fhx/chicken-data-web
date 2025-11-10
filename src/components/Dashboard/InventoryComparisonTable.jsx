import '../../styles/InventoryComparisonTable.css'

const formatCurrency = (v) => (v == null ? 'N/A' : `S/. ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)

export function InventoryComparisonTable ({ data }) {
  if (!data) return <div>No hay datos de inventario.</div>

  const total = data.totalIngredients?.current ?? data.totalIngredients ?? data.totalIngredientsCurrent
  const lowStock = data.lowStockItems?.current ?? data.lowStockItems ?? data.lowStockItemsCurrent
  const totalValue = data.totalValue?.current ?? data.totalValue ?? data.totalValueCurrent

  return (
    <table className='inventory-comparison-table compact'>
      <thead>
        <tr>
          <th>Métrica</th>
          <th>Valor</th>
          <th>Vs 30 días</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Total ingredientes</td>
          <td>{total ?? '-'}</td>
          <td>{data.totalIngredients?.vs30DaysAgo?.change != null ? `${Number(data.totalIngredients.vs30DaysAgo.change).toFixed(1)}%` : '-'}</td>
        </tr>
        <tr>
          <td>Items en stock bajo</td>
          <td>{lowStock ?? '-'}</td>
          <td>{data.lowStockItems?.vs30DaysAgo?.change != null ? `${Number(data.lowStockItems.vs30DaysAgo.change).toFixed(1)}%` : '-'}</td>
        </tr>
        <tr>
          <td>Valor total</td>
          <td>{formatCurrency(totalValue)}</td>
          <td>{data.totalValue?.vs30DaysAgo?.change != null ? `${Number(data.totalValue.vs30DaysAgo.change).toFixed(1)}%` : '-'}</td>
        </tr>
      </tbody>
    </table>
  )
}
