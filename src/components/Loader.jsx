export function Loader ({ width = 40, height = 40, text = 'Cargando...' }) {
  return (
    <div className='loading-container'>
      <div className='loader' style={{ width, height }} />
      <span style={{ color: '#6b7280' }}>{text}</span>
    </div>
  )
}
