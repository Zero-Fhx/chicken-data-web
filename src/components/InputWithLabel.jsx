import { useEffect, useRef } from 'react'
import '../styles/InputWithLabel.css'

export function InputWithLabel ({
  label,
  position = 'right',
  className = '',
  ...restInputProps
}) {
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
  }, [label])

  return (
    <div ref={wrapperRef} className={`input-with-label-wrapper ${position}`}>
      {position === 'left' && label && (
        <span ref={labelRef} className='input-label left'>{label}</span>
      )}
      <input
        {...restInputProps}
        className={`input-with-label ${className}`}
      />
      {position === 'right' && label && (
        <span ref={labelRef} className='input-label right'>{label}</span>
      )}
    </div>
  )
}
