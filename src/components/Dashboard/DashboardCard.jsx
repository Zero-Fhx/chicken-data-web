import { ErrorState } from '@/components/ErrorState'
import { Loader } from '@/components/Loader'
import '@/styles/DashboardCard.css'
import React from 'react'

export function DashboardCard ({
  title,
  className = '',
  loading,
  error = null,
  onRetry = null,
  cardControls,
  children
}) {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { loading, error })
    }
    return child
  })

  const renderContent = () => {
    if (loading) return <Loader />
    if (error) {
      const message = typeof error === 'string' ? error : (error.message || '')
      return (
        <ErrorState
          message={message}
          onRetry={onRetry}
        />
      )
    }
    return childrenWithProps
  }

  return (
    <div className={`dashboard-card ${className}`}>
      <div className='dashboard-card-header'>
        <h3 className='dashboard-card-title'>{title}</h3>
        {cardControls && cardControls}
      </div>
      <div className='dashboard-card-content'>
        {renderContent()}
      </div>
      {/* Fuente eliminada por decisión de diseño */}
    </div>
  )
}
