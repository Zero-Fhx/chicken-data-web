import { ArrowLeftIcon, ArrowRightIcon } from '@/components/Icons'

import '@/styles/Pagination.css'

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
      <button
        className='pagination-btn'
        onClick={handlePrevious}
        disabled={currentPage === 1 || disabled}
      >
        <ArrowLeftIcon />
        Anterior
      </button>

      {[...Array(totalPages || 1)].map((_, i) => (
        <button
          key={i}
          className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
          onClick={() => onPageChange(i + 1)}
          disabled={disabled}
        >
          {i + 1}
        </button>
      ))}

      <button
        className='pagination-btn'
        onClick={handleNext}
        disabled={currentPage === totalPages || disabled}
      >
        Siguiente
        <ArrowRightIcon />
      </button>
    </div>
  )
}
