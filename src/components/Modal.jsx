import { useEffect, useRef } from 'react'

export function Modal ({ isOpen, onClose, children }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      dialog.removeAttribute('data-closing')
      dialog.showModal()
    } else {
      if (dialog.hasAttribute('open')) {
        dialog.setAttribute('data-closing', 'true')

        const handleAnimationEnd = () => {
          dialog.removeAttribute('data-closing')
          dialog.close()
        }

        dialog.addEventListener('animationend', handleAnimationEnd, { once: true })
      }
    }
  }, [isOpen])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleClose = () => {
      onClose()
    }

    dialog.addEventListener('close', handleClose)

    return () => {
      dialog.removeEventListener('close', handleClose)
    }
  }, [onClose])

  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) {
      onClose()
    }
  }

  return (
    <dialog className='modal' onClick={handleBackdropClick}>
      <div className='modal-content'>
        {children}
      </div>
    </dialog>
  )
}
