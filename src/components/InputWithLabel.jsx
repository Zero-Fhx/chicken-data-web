import { useEffect, useRef } from 'react'
import '../styles/InputWithLabel.css'

/**
 * Componente de input que incluye una etiqueta de texto a la izquierda o derecha.
 * * Se usa para campos de formulario que necesitan mostrar unidades o símbolos junto al valor, como monedas o medidas.
 *
 * @param {Object} props - Objeto de propiedades del componente.
 * @param {string} props.label - El texto que se mostrará como etiqueta junto al input.
 * @param {'left'|'right'} [props.position='right'] - La posición de la etiqueta ('left' o 'right').
 * @param {string} [props.className=''] - Clases CSS adicionales para el elemento input.
 * @param {Object} props.restInputProps - Cualquier otra propiedad estándar de un input HTML (ej: `type`, `value`, `onChange`).
 *
 * @returns {React.ReactElement} El elemento JSX renderizado.
 */
export function InputWithLabel ({
  label,
  position = 'right',
  className = '',
  ...restInputProps
}) {
  const displayLabel = label || '...'
  const labelRef = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    const updateLabelWidth = () => {
      if (labelRef.current && wrapperRef.current) {
        const labelWidth = labelRef.current.offsetWidth
        if (labelWidth > 0) {
          wrapperRef.current.style.setProperty('--label-width', `${labelWidth}px`)
        }
      }
    }

    const timeoutId = setTimeout(updateLabelWidth, 0)

    const observer = new ResizeObserver(updateLabelWidth)
    if (labelRef.current) {
      observer.observe(labelRef.current)
    }

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [displayLabel])

  return (
    <div ref={wrapperRef} className={`input-with-label-wrapper ${position}`}>
      {position === 'left' && displayLabel && (
        <span ref={labelRef} className='input-label left'>{displayLabel}</span>
      )}
      <input
        {...restInputProps}
        className={`input-with-label ${className}`}
      />
      {position === 'right' && displayLabel && (
        <span ref={labelRef} className='input-label right'>{displayLabel}</span>
      )}
    </div>
  )
}
