import { ArrowLeftIcon, ArrowRightIcon } from '@/components/Icons'
import { Button } from '@/components/ui/Button'

import '@/styles/Pagination.css'

/**
 * Componente para la navegación entre páginas.
 * * Muestra botones para ir a la página anterior, siguiente y un rango limitado de páginas específicas.
 *
 * @param {Object} props - Objeto de propiedades del componente.
 * @param {number} props.currentPage - El número de la página actual.
 * @param {number} props.totalPages - El número total de páginas disponibles.
 * @param {function} props.onPageChange - Callback que se ejecuta cuando se selecciona una nueva página.
 * @param {boolean} [props.disabled=false] - Deshabilita todos los botones de la paginación.
 *
 * @returns {React.ReactElement} El elemento JSX renderizado.
 */
export function Pagination ({ currentPage, totalPages, onPageChange, disabled = false }) {
  const MAX_PAGE_BUTTONS = 5

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const getPageNumbers = () => {
    if (totalPages <= 1) return []

    let startPage, endPage

    if (totalPages <= MAX_PAGE_BUTTONS) {
      //
      startPage = 1
      endPage = totalPages
    } else {
      const maxPagesBeforeCurrentPage = Math.floor(MAX_PAGE_BUTTONS / 2)
      const maxPagesAfterCurrentPage = Math.ceil(MAX_PAGE_BUTTONS / 2) - 1

      if (currentPage <= maxPagesBeforeCurrentPage) {
        startPage = 1
        endPage = MAX_PAGE_BUTTONS
      } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
        startPage = totalPages - MAX_PAGE_BUTTONS + 1
        endPage = totalPages
      } else {
        startPage = currentPage - maxPagesBeforeCurrentPage
        endPage = currentPage + maxPagesAfterCurrentPage
      }
    }

    return Array.from({ length: endPage + 1 - startPage }, (_, i) => startPage + i)
  }

  const pageNumbers = getPageNumbers()

  if (totalPages <= 1) return null

  return (
    <div className='pagination'>
      <Button
        className='pagination-btn'
        onClick={handlePrevious}
        disabled={currentPage === 1 || disabled}
      >
        <ArrowLeftIcon />
        Anterior
      </Button>

      {pageNumbers[0] > 1 && (
        <>
          <Button
            key={1}
            className='pagination-btn'
            onClick={() => onPageChange(1)}
            disabled={disabled}
          >
            1
          </Button>
          {pageNumbers[0] > 2 && <span className='pagination-ellipsis'>...</span>}
        </>
      )}

      {pageNumbers.map((page) => (
        <Button
          key={page}
          className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
          disabled={disabled}
        >
          {page}
        </Button>
      ))}

      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className='pagination-ellipsis'>...</span>}
          <Button
            key={totalPages}
            className='pagination-btn'
            onClick={() => onPageChange(totalPages)}
            disabled={disabled}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        className='pagination-btn'
        onClick={handleNext}
        disabled={currentPage === totalPages || disabled}
      >
        Siguiente
        <ArrowRightIcon />
      </Button>
    </div>
  )
}
