import '@/styles/TopSuppliersList.css' // Importar estilos

const formatCurrency = (value) => `S/. ${(Number(value) || 0).toFixed(2)}`

export function TopSuppliersList ({ loading, data }) {
  // El wrapper `DashboardCard` muestra Loader/ErrorState si aplica.
  if (loading) return null
  if (!data || data.length === 0) return <p>No hay proveedores para mostrar.</p>

  return (
    <ul className='top-suppliers-list'>
      {data.slice(0, 5).map(supplier => (
        <li key={supplier.id} className='top-suppliers-item'>
          <div className='top-suppliers-info'>
            <span className='top-suppliers-name'>{supplier.name}</span>
            <span className='top-suppliers-count'>
              {supplier.purchaseCount} compras
            </span>
          </div>
          <span className='top-suppliers-spent'>
            {formatCurrency(supplier.totalSpent)}
          </span>
        </li>
      ))}
    </ul>
  )
}
