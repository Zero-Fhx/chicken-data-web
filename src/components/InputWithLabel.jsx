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
    if (labelRef.current && wrapperRef.current) {
      const labelWidth = labelRef.current.offsetWidth
      wrapperRef.current.style.setProperty('--label-width', `${labelWidth}px`)
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
