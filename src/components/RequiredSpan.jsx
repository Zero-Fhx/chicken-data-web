/**
 * Componente que renderiza un asterisco rojo para indicar que un campo es requerido.
 * * Se utiliza junto a las etiquetas (`<label>`) de los campos de formulario obligatorios.
 *
 * @returns {React.ReactElement} El elemento JSX renderizado.
 */
export function RequiredSpan () {
  return (
    <span style={{ color: '#dc3545' }}>
      *
    </span>
  )
}
