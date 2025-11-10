import '@/styles/PeriodSelector.css'
import { useId } from 'react'

export function PeriodSelector ({
  selectedPeriod,
  onPeriodChange,
  availablePeriods,
  options,
  groupName,
  labels = {}
}) {
  const id = useId()
  // Mapeo por defecto
  const defaultLabels = {
    today: 'Hoy',
    week: 'Semana',
    month: 'Mes',
    year: 'Año'
  }

  // Fusionar labels por defecto con labels personalizados
  const periodLabels = { ...defaultLabels, ...labels }

  // Permitir opciones personalizadas o array simple
  const items = options || (Array.isArray(availablePeriods)
    ? availablePeriods.map(p => ({ label: periodLabels[p] || p, value: p }))
    : [])

  // Garantizar un name único por instancia para evitar colisiones entre cards
  const name = `${groupName || 'period'}-${id}`

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div className='period-selector'>
        {items.map((opt) => (
          <label key={opt.value} className='period-option'>
            <input
              type='radio'
              name={name}
              value={opt.value}
              checked={selectedPeriod === opt.value}
              onChange={(e) => onPeriodChange(e.target.value)}
            />
            <span className='period-label'>{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
