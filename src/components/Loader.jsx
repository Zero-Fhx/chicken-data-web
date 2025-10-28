export function Loader ({ width = 40, height = 40, text = 'Cargando...' }) {
  return (
    <div className='loading-container'>
      <div className='loader' style={{ width, height }} />
      {text && <span className='loading-text'>{text}</span>}
    </div>
  )
}
