import { useEffect, useRef } from 'react'

export function Modal ({ isOpen, onAnimationEnd, children }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen && !dialog.hasAttribute('open')) {
      dialog.removeAttribute('data-closing')
      dialog.showModal()
    } else if (!isOpen && dialog.hasAttribute('open')) {
      dialog.setAttribute('data-closing', 'true')

      const handleAnimationEnd = () => {
        dialog.removeAttribute('data-closing')
        dialog.close()
        if (onAnimationEnd) {
          onAnimationEnd()
        }
      }

      const modalContent = dialog.querySelector('.modal-content')
      if (modalContent) {
        modalContent.addEventListener('animationend', handleAnimationEnd, { once: true })
      }

      setTimeout(() => {
        if (dialog.hasAttribute('data-closing')) {
          dialog.removeAttribute('data-closing')
          dialog.close()
          if (onAnimationEnd) {
            onAnimationEnd()
          }
        }
      }, 350)
    }
  }, [isOpen, onAnimationEnd])

  return (
    <dialog ref={dialogRef} className='modal-dialog' closedby='none'>
      <div className='modal-content'>
        {children}
      </div>
    </dialog>
  )
}
