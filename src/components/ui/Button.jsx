import '@/styles/ui/Button.css'
import classnames from 'classnames'
import React from 'react'

const Button = React.forwardRef(({ className, children, ...props }, ref) => {
  const classes = classnames('btn', className)

  return (
    <button ref={ref} className={classes} {...props}>
      {children}
    </button>
  )
})

export { Button }
