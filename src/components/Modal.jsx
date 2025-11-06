import { useEffect, useRef } from 'react'

/**
 * Componente base para mostrar contenido en un diálogo modal.
 * * Utiliza el elemento `<dialog>` de HTML y gestiona su apertura y cierre con animaciones CSS.
 *
 * @param {Object} props - Objeto de propiedades del componente.
 * @param {boolean} props.isOpen - Controla si el modal está visible o no.
 * @param {function} [props.onAnimationEnd] - Callback que se ejecuta cuando la animación de cierre ha terminado.
 * @param {React.ReactNode} [props.children] - Nodos hijos que el componente renderizará dentro del modal.
 *
 * @returns {React.ReactElement} El elemento JSX renderizado.
 */
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
