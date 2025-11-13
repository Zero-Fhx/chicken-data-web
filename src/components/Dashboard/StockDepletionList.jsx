// fileName: StockDepletionList.jsx (CREA O REEMPLAZA ESTE ARCHIVO)

import '@/styles/StockDepletionList.css' // Importamos el nuevo CSS

const formatCurrency = (v) => {
  if (v == null) return 'N/A'
  return `S/. ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function StockDepletionList ({ data }) {
  if (!data || data.length === 0) {
    return <p>No hay items con riesgo de agotamiento.</p>
  }

  return (
    <div className='table-scroll-wrapper'>
      <table className='depletion-table'>
        <thead>
          <tr>
            {/* Encabezados corregidos */}
            <th>Ingrediente</th>
            <th>Stock Actual</th>
            <th>Días Restantes</th>
            <th>Cant. Rec.</th>
            <th>Costo Estimado</th>
            <th>Prioridad</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.ingredientId ?? item.ingredientName}>
              <td data-label='Ingrediente'>{item.ingredientName}</td>

              {/* Se quitó la clase 'stock-small' */}
              <td data-label='Stock Actual' className='text-right'>
                {item.currentStock != null ? Number(item.currentStock).toFixed(2) : '-'}
              </td>

              <td data-label='Días Restantes' className='text-right days-highlight'>
                {item.daysUntilDepleted != null ? Number(item.daysUntilDepleted).toFixed(1) : '-'}
              </td>

              <td data-label='Cant. Rec.' className='text-right'>
                {item.recommendedOrderQuantity ?? item.recommendedAmount ?? '-'}
              </td>

              <td data-label='Costo Estimado' className='text-right cost-value'>
                {formatCurrency(item.estimatedCost)}
              </td>

              <td data-label='Prioridad' className='text-center'>
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
