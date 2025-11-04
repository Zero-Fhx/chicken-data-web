import { useEffect, useRef } from 'react'
import '../styles/InputWithLabel.css'

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
