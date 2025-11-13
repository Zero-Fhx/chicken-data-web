// fileName: PriorityBar.jsx

import '@/styles/PriorityBar.css' // Crearemos este archivo a continuación

export const PriorityBar = ({ high, medium, low = 0 }) => {
  const total = (high || 0) + (medium || 0) + (low || 0)
  if (total === 0) {
    return (
      <div className='priority-bar-container'>
        <div className='priority-bar-empty'>No hay items con prioridad.</div>
      </div>
    )
  }

  const highPct = (high / total) * 100
  const mediumPct = (medium / total) * 100
  const lowPct = (low / total) * 100

  return (
    <div className='priority-bar-container'>
      {/* La barra visual */}
      <div className='priority-bar'>
        <div className='bar-segment high' style={{ width: `${highPct}%` }} title={`Alta: ${high}`} />
        <div className='bar-segment medium' style={{ width: `${mediumPct}%` }} title={`Media: ${medium}`} />
        <div className='bar-segment low' style={{ width: `${lowPct}%` }} title={`Baja: ${low}`} />
      </div>

      {/* La leyenda */}
      <div className='priority-legend'>
        <span className='legend-item high'><span className='dot' /> Alta ({high})</span>
        <span className='legend-item medium'><span className='dot' /> Media ({medium})</span>
        {low > 0 && <span className='legend-item low'><span className='dot' /> Baja ({low})</span>}
      </div>
    </div>
  )
}
