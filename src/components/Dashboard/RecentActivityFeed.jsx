import { DollarIcon, ShoppingCartIcon } from '@/components/Icons'
import '@/styles/RecentActivityFeed.css' // Importar estilos

export function RecentActivityFeed ({ loading, data }) {
  // El wrapper `DashboardCard` muestra el Loader/ErrorState.
  if (loading) return null
  if (!data) return <p>No hay actividad reciente.</p>

  const { lastSale, lastPurchase } = data

  return (
    <ul className='activity-feed'>
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
    </ul>
  )
}
