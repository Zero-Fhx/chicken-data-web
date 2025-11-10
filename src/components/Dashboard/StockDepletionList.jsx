import '../../styles/StockDepletionList.css'

const formatNumber = (v, digits = 2) => (v == null ? 'N/A' : Number(v).toLocaleString('es-PE', { minimumFractionDigits: digits, maximumFractionDigits: digits }))
const formatCurrency = (v) => (v == null ? 'N/A' : `S/. ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)

export function StockDepletionList ({ data }) {
  if (!data || data.length === 0) return <div>No hay ingredientes próximos a agotarse.</div>

  return (
    <div className='stock-depletion-wrapper'>
      <table className='stock-depletion-table compact'>
        <thead>
          <tr>
            <th>Ingrediente</th>
            <th>Stock</th>
            <th>Días</th>
            <th>Cantidad rec.</th>
            <th>Costo</th>
            <th>Prioridad</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.ingredientId ?? item.ingredientName}>
              <td>{item.ingredientName}</td>
              <td className='stock-small'>{formatNumber(item.currentStock, 2)}</td>
              <td>{formatNumber(item.daysUntilDepleted, 1)}</td>
              <td>{formatNumber(item.recommendedOrderQuantity, 2)}</td>
              <td>{formatCurrency(item.estimatedCost)}</td>
              <td>
                <span className={`priority-chip ${item.priority === 'high' ? 'priority-alta' : item.priority === 'low' ? 'priority-baja' : 'priority-media'}`}>
                  {item.priority === 'high' ? 'Alta' : item.priority === 'low' ? 'Baja' : 'Media'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
