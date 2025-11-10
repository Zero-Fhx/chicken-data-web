import '@/styles/TopDishesList.css' // Importar estilos

const formatCurrency = (value) => `S/. ${(Number(value) || 0).toFixed(2)}`

export function TopDishesList ({ loading, data, error }) {
  // Dejar que el wrapper gestione loading/error visuales.
  if (loading) return null
  if (error) return null
  if (!data || data.length === 0) return <p>No hay platos para mostrar.</p>

  return (
    <ol className='top-dishes-list'>
      {data.slice(0, 5).map((dish, index) => (
        <li key={dish.id || dish.name} className='top-dishes-item'>
          <div className='top-dishes-info'>
            <span className='top-dishes-rank'>{index + 1}.</span>
            <span className='top-dishes-name'>{dish.name}</span>
          </div>
          <div className='top-dishes-qty'>Vendidos: {dish.quantitySold}</div>
          {dish.revenue && (
            <div className='top-dishes-stats'>
              <span className='top-dishes-revenue'>
                {formatCurrency(dish.revenue)}
              </span>
              <span className='top-dishes-percentage'>
                {dish.revenuePercentage}%
              </span>
            </div>
          )}
        </li>
      ))}
    </ol>
  )
}
