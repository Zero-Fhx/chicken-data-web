import { Loader } from '@/components/Loader'

import '@/styles/ResultsCounter.css'

/**
 * Componente que muestra un contador de resultados para una lista o tabla.
 * * Indica el rango de elementos que se están mostrando y el total, y también maneja los estados de carga, error o si no hay resultados.
 *
 * @param {Object} props - Objeto de propiedades del componente.
 * @param {boolean} props.loading - Indica si los datos se están cargando.
 * @param {Object} [props.error] - Objeto de error, si ocurrió alguno durante la carga.
 * @param {Array<Object>} [props.items=[]] - El array de datos a contar.
 * @param {Object} [props.meta] - Metadatos de paginación de la API.
 * @param {number} props.pageSize - El tamaño de la página actual.
 * @param {React.ComponentType} props.icon - Componente de ícono para mostrar junto al contador.
 * @param {string} [props.itemName='elemento'] - Nombre del item en singular.
 * @param {string} [props.itemNamePlural='elementos'] - Nombre del item en plural.
 *
 * @returns {React.ReactElement} El elemento JSX renderizado.
 */
export function ResultsCounter ({
  loading,
  error,
  items = [],
  meta,
  pageSize,
  icon: Icon,
  itemName = 'elemento',
  itemNamePlural = 'elementos'
}) {
  if (loading) {
    return (
      <div className='results-counter loading'>
        <span className='result-icon'>
          <Loader width={20} height={20} text='' />
        </span>
        <span className='result-text loading'>Cargando {itemNamePlural}...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className='results-counter error'>
        <span className='result-icon'>
          <Icon />
        </span>
        <span className='result-text error'>Error al cargar los {itemNamePlural}</span>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className='results-counter no-results'>
        <span className='result-icon'>
          <Icon />
        </span>
        <span className='result-text no-results'>No se encontraron {itemNamePlural}</span>
      </div>
    )
  }

  const { total, page, pageSize: metaPageSize } = meta?.pagination || {}

  const renderText = () => {
    if (total === 1) {
      return (
        <>
          Mostrando <span className='result-number'>1</span> {itemName}
        </>
      )
    }

    if (total <= pageSize) {
      return (
        <>
          Mostrando <span className='result-number'>{total}</span> {itemNamePlural}
        </>
      )
    }

    const start = page * metaPageSize - (metaPageSize - 1)
    const end = Math.min(page * metaPageSize, total)

    if (items.length === 1) {
      return (
        <>
          Mostrando <span className='result-number'>{start}</span> de{' '}
          <span className='result-number'>{total}</span> {itemNamePlural}
        </>
      )
    }

    return (
      <>
        Mostrando <span className='result-number'>{start} - {end}</span> de{' '}
        <span className='result-number'>{total}</span> {itemNamePlural}
      </>
    )
  }

  return (
    <div className='results-counter'>
      <span className='result-icon'>
        <Icon />
      </span>
      <span className='result-text'>{renderText()}</span>
    </div>
  )
}
