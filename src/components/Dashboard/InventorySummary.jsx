import { ArrowLeftIcon, ArrowRightIcon } from '@/components/Icons'
import { Button } from '@/components/ui/Button'
import '@/styles/InventorySummary.css'
import { useEffect, useRef, useState } from 'react'

const formatCurrency = (value) => `S/. ${(Number(value) || 0).toFixed(2)}`

export function InventorySummary ({ loading, data }) {
  const carouselRef = useRef(null)
  const [isCentered, setIsCentered] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    const el = carouselRef.current
    if (!el) return

    const update = () => {
      setIsCentered(el.scrollWidth <= el.clientWidth + 1)
      setCanScrollLeft(el.scrollLeft > 0)
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
    }

    update()
    window.addEventListener('resize', update)
    el.addEventListener('scroll', update)

    return () => {
      window.removeEventListener('resize', update)
      el.removeEventListener('scroll', update)
    }
  }, [data])

  const scrollByAmount = (dir = 1) => {
    const el = carouselRef.current
    if (!el) return
    const amount = Math.max(120, Math.floor(el.clientWidth * 0.7))
    el.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  // El wrapper `DashboardCard` debe mostrar Loader/ErrorState; no renderizamos texto simple aquí.
  if (loading) return null
  if (!data) return <p>No hay datos de inventario.</p>

  const { totalValue, total, active, alerts } = data

  return (
    // Wrapper con controles prev/next y el carrusel
    <div className={`inventory-carousel-wrapper ${isCentered ? 'is-centered' : ''}`}>
      <Button
        type='button'
        className='inventory-prev'
        aria-label='Anterior'
        onClick={() => scrollByAmount(-1)}
        disabled={!canScrollLeft}
        hidden={false}
      >
        <ArrowLeftIcon width={14} height={14} color='#6c757d' />
      </Button>

      <div
        ref={carouselRef}
        className='inventory-carousel'
      >

        <div className='inventory-item'>
          <h4 className='inventory-title'>Valor Total</h4>
          <p className='inventory-value'>{formatCurrency(totalValue)}</p>
        </div>

        <div className='inventory-item'>
          <h4 className='inventory-title'>Ingredientes Totales</h4>
          <p className='inventory-value'>{total ?? 0}</p>
        </div>

        <div className='inventory-item'>
          <h4 className='inventory-title'>Ingredientes Activos</h4>
          <p className='inventory-value'>{active ?? 0}</p>
        </div>

        <div className='inventory-item'>
          <h4 className='inventory-title'>Stock Óptimo</h4>
          <p className='inventory-value'>{alerts?.optimal ?? 0}</p>
        </div>

      </div>

      <Button
        type='button'
        className='inventory-next'
        aria-label='Siguiente'
        onClick={() => scrollByAmount(1)}
        disabled={!canScrollRight}
        hidden={false}
      >
        <ArrowRightIcon width={14} height={14} color='#6c757d' />
      </Button>
    </div>
  )
}
