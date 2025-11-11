import '@/styles/ui/Input.css'
import classnames from 'classnames'
import React from 'react'

const Input = React.forwardRef(({ className, type = 'text', ...props }, ref) => {
  const classes = classnames('form-control', className)

  return <input ref={ref} type={type} className={classes} {...props} />
})

export { Input }
