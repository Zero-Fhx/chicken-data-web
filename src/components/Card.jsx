import '@/styles/Card.css'

/**
 * Componente contenedor principal con estilo de tarjeta.
 * * Se utiliza como base para agrupar contenido relacionado en una sección visualmente separada.
 *
 * @param {Object} props - Objeto de propiedades del componente.
 * @param {React.ReactNode} [props.children] - Nodos hijos que el componente renderizará dentro de la tarjeta.
 * @param {string} [props.className] - Clases CSS adicionales para aplicar al contenedor de la tarjeta.
 *
 * @returns {React.ReactElement} El elemento JSX renderizado.
 */
export function Card ({ children, className }) {
  const cardClass = className ? `card ${className}` : 'card'

  return (
    <div className={cardClass}>
      {children}
    </div>
  )
}

/**
 * Componente para el encabezado de una tarjeta (Card).
 * * Generalmente contiene el título de la tarjeta o controles principales.
 *
 * @param {Object} props - Objeto de propiedades del componente.
 * @param {React.ReactNode} [props.children] - Nodos hijos que el componente renderizará dentro del encabezado.
 * @param {string} [props.className] - Clases CSS adicionales para aplicar al encabezado de la tarjeta.
 *
 * @returns {React.ReactElement} El elemento JSX renderizado.
 */
export function CardHeader ({ children, className }) {
  const headerClass = className ? `card-header ${className}` : 'card-header'

  return (
    <header className={headerClass}>
      {children}
    </header>
  )
}

/**
 * Componente para el cuerpo de una tarjeta (Card).
 * * Es el contenedor principal para el contenido de la tarjeta.
 *
 * @param {Object} props - Objeto de propiedades del componente.
 * @param {React.ReactNode} [props.children] - Nodos hijos que el componente renderizará dentro del cuerpo.
 * @param {string} [props.className] - Clases CSS adicionales para aplicar al cuerpo de la tarjeta.
 *
 * @returns {React.ReactElement} El elemento JSX renderizado.
 */
export function CardBody ({ children, className }) {
  const bodyClass = className ? `card-body ${className}` : 'card-body'

  return (
    <div className={bodyClass}>
      {children}
    </div>
  )
}

/**
 * Componente para el pie de una tarjeta (Card).
 * * Usualmente contiene acciones secundarias, paginación o información de resumen.
 *
 * @param {Object} props - Objeto de propiedades del componente.
 * @param {React.ReactNode} [props.children] - Nodos hijos que el componente renderizará dentro del pie.
 * @param {string} [props.className] - Clases CSS adicionales para aplicar al pie de la tarjeta.
 *
 * @returns {React.ReactElement} El elemento JSX renderizado.
 */
export function CardFooter ({ children, className }) {
  const footerClass = className ? `card-footer ${className}` : 'card-footer'

  return (
    <footer className={footerClass}>
      {children}
    </footer>
  )
}