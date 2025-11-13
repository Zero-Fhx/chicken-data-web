// fileName: RecentActivityFeed.jsx (REEMPLAZAR ARCHIVO COMPLETO)

import { DollarIcon, ShoppingCartIcon } from '@/components/Icons'
import '@/styles/RecentActivityFeed.css'

// --- 1. AÑADIMOS NUEVOS ICONOS (SVG incrustados para simplicidad) ---

// Icono para Platos (un plato/gráfico)
const DishesIcon = ({ width = 18, height = 18 }) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <path d='M21.21 15.89A10 10 0 1 1 8.11 2.79' />
    <path d='M22 12A10 10 0 0 0 12 2v10z' />
  </svg>
)

// Icono para Ingrediente (una caja)
const IngredientIcon = ({ width = 18, height = 18 }) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <path d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' />
    <polyline points='3.27 6.96 12 12.01 20.73 6.96' />
    <line x1='12' y1='22.08' x2='12' y2='12' />
  </svg>
)

export function RecentActivityFeed ({ loading, data }) {
  if (loading) return null

  // --- 2. LEEMOS LOS DATOS DE 'today' ---
  const { lastSale, lastPurchase, today } = data || {}

  const hasActivity = lastSale || lastPurchase || (today?.dishesSold > 0) || today?.mostUsedIngredient

  if (!hasActivity) {
    return <p>No hay actividad reciente.</p>
  }

  return (
    <ul className='activity-feed'>
      {/* Última Venta (sin cambios) */}
      {lastSale && (
        <li className='activity-item'>
          <div className='activity-icon sale'>
            <DollarIcon width={18} height={18} />
          </div>
          <div className='activity-details'>
            <span className='activity-title'>Última Venta</span>
            <span className='activity-time'>{lastSale.timeAgo}</span>
          </div>
        </li>
      )}
      {/* Última Compra (sin cambios) */}
      {lastPurchase && (
        <li className='activity-item'>
          <div className='activity-icon purchase'>
            <ShoppingCartIcon width={18} height={18} />
          </div>
          <div className='activity-details'>
            <span className='activity-title'>Última Compra</span>
            <span className='activity-time'>{lastPurchase.timeAgo}</span>
          </div>
        </li>
      )}

      {/* --- 3. NUEVOS ITEMS DEL FEED --- */}

      {/* Platos Vendidos Hoy */}
      {today?.dishesSold > 0 && (
        <li className='activity-item'>
          <div className='activity-icon dishes'>
            <DishesIcon />
          </div>
          <div className='activity-details'>
            <span className='activity-title'>Platos Vendidos Hoy</span>
            <span className='activity-time'>{today.dishesSold} platos</span>
          </div>
        </li>
      )}

      {/* Ingrediente Más Usado */}
      {today?.mostUsedIngredient && (
        <li className='activity-item'>
          <div className='activity-icon ingredient'>
            <IngredientIcon />
          </div>
          <div className='activity-details'>
            <span className='activity-title'>Ingrediente Más Usado del Día</span>
            <span className='activity-time'>{today.mostUsedIngredient.name}</span>
          </div>
        </li>
      )}
    </ul>
  )
}
