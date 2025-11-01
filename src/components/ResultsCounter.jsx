import { Loader } from '@/components/Loader'

import '@/styles/ResultsCounter.css'

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
