/**
 * Componente para mostrar un indicador de carga.
 * * Consiste en una animación de spinner y un texto opcional para indicar que el contenido se está cargando.
 *
 * @param {Object} props - Objeto de propiedades del componente.
 * @param {number} [props.width=40] - El ancho del spinner en píxeles.
 * @param {number} [props.height=40] - La altura del spinner en píxeles.
 * @param {string} [props.text='Cargando...'] - El texto que se muestra debajo del spinner.
 *
 * @returns {React.ReactElement} El elemento JSX renderizado.
 */
export function Loader ({ width = 40, height = 40, text = 'Cargando...' }) {
  return (
    <div className='loading-container'>
      <div className='loader' style={{ width, height }} />
      {text && <span className='loading-text'>{text}</span>}
    </div>
  )
}
