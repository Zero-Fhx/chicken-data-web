// fileName: DishesComparisonTable.jsx (REEMPLAZAR ARCHIVO)

import '@/styles/DishesComparisonTable.css' // Usaremos este CSS

// Copiamos la función de formato de los otros componentes
const formatChange = (change) => {
  if (change == null) {
    return <span className='kpi-change neutral'>-</span>
  }
  const value = Number(change)
  const prefix = value > 0 ? '▲' : (value < 0 ? '▼' : '')
  const color = value > 0 ? 'positive' : (value < 0 ? 'negative' : 'neutral')
  return (
    <span className={`kpi-change ${color}`}>
      {prefix} {Math.abs(value).toFixed(1)}%
    </span>
  )
}

export function DishesComparisonTable ({ data }) {
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
    <div className='comparison-wrapper'>
      <div className='table-scroll-wrapper'>
        <table className='dishes-comparison-table'>
          <thead>
            <tr>
              <th>Plato</th>
              <th>Vendidos (Actual)</th>
              <th>Vendidos (Ant.)</th>
              <th>% Cambio (Cant.)</th>
              <th>% Cambio (Ing.)</th>
            </tr>
          </thead>
          <tbody>
            {dishes.map((dish, idx) => {
              const name = dish.name || dish.title || `#${dish.id || idx}`
              const currentQty = getValue(dish, ['currentMonth.quantitySold'])
              const previousQty = getValue(dish, ['lastMonth.quantitySold'])

              // Nuevos campos
              const qtyPercent = getValue(dish, ['change.quantityPercent'])
              const revPercent = getValue(dish, ['change.revenuePercent'])

              return (
                <tr key={name + idx}>
                  <td>{name}</td>
                  <td className='text-right'>{currentQty ?? '-'}</td>
                  <td className='text-right'>{previousQty ?? '-'}</td>
                  {/* Nuevas Celdas */}
                  <td className='text-center'>{formatChange(qtyPercent)}</td>
                  <td className='text-center'>{formatChange(revPercent)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
