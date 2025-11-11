import { ArrowLeftIcon, ArrowRightIcon } from '@/components/Icons'
import { Button } from '@/components/ui/Button'

import '@/styles/Pagination.css'

/**
 * Componente para la navegación entre páginas.
 * * Muestra botones para ir a la página anterior, siguiente y a páginas específicas.
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

      {[...Array(totalPages || 1)].map((_, i) => (
        <Button
          key={i}
          className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
          onClick={() => onPageChange(i + 1)}
          disabled={disabled}
        >
          {i + 1}
        </Button>
      ))}

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
