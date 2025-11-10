import '../../styles/DishesComparisonTable.css'

export function DishesComparisonTable ({ data }) {
  // Aceptar varias formas: { topDishes: [...] } o directamente un array
  const dishes = data?.topDishes ?? (Array.isArray(data) ? data : null)
  if (!dishes || dishes.length === 0) return <div>No hay datos de platos.</div>

  const getValue = (dish, paths) => {
    for (const p of paths) {
      const parts = p.split('.')
      let cur = dish
      for (const part of parts) {
        if (cur == null) break
        cur = cur[part]
      }
      if (cur != null) return cur
    }
    return null
  }

  return (
    <table className='dishes-comparison-table'>
      <thead>
        <tr>
          <th>Plato</th>
          <th>Vendidos (Actual)</th>
          <th>Ingresos (Actual)</th>
          <th>Vendidos (Anterior)</th>
          <th>Ingresos (Anterior)</th>
        </tr>
      </thead>
      <tbody>
        {dishes.map((dish, idx) => {
          const name = dish.name || dish.title || `#${dish.id || idx}`
          const currentQty = getValue(dish, ['currentMonth.quantitySold', 'current.quantitySold', 'quantitySold'])
          const currentRev = getValue(dish, ['currentMonth.revenue', 'current.revenue', 'revenue'])
          const previousQty = getValue(dish, ['lastMonth.quantitySold', 'previousMonth.quantitySold', 'previous.quantitySold'])
          const previousRev = getValue(dish, ['lastMonth.revenue', 'previousMonth.revenue', 'previous.revenue'])

          return (
            <tr key={name + idx}>
              <td>{name}</td>
              <td>{currentQty ?? '-'}</td>
              <td>{currentRev != null ? `S/. ${Number(currentRev).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}</td>
              <td>{previousQty ?? '-'}</td>
              <td>{previousRev != null ? `S/. ${Number(previousRev).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
