import { useState } from 'react'

import { CancelIcon } from './Icons'

import '@/styles/ErrorModal.css'

/**
 * Componente modal para mostrar un mensaje de error.
 * * Aparece como una notificación flotante en la parte inferior de la pantalla y se cierra con una animación.
 *
 * @param {Object} props - Objeto de propiedades del componente.
 * @param {string} props.message - El mensaje de error a mostrar.
 * @param {function} props.onClose - Callback que se ejecuta para cerrar el modal.
 *
 * @returns {React.ReactElement} El elemento JSX renderizado.
 */
export function ErrorModal ({ message, onClose }) {
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  return (
    <div className={`error-modal ${isClosing ? 'closing' : ''}`}>
      <div className='error-modal-content'>
        <div className='error-modal-icon'>
          <CancelIcon width={40} height={40} color='#dc2626' />
        </div>
        <div className='error-modal-message'>
          <span>{message}</span>
        </div>
      </div>
      <div className='error-modal-actions'>
        <button type='button' className='error-close-button' onClick={handleClose}>
          Cerrar
        </button>
      </div>
    </div>
  )
}
