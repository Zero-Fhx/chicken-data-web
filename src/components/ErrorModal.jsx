import { useState } from 'react'

import { CancelIcon } from './Icons'

import '@/styles/ErrorModal.css'

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
