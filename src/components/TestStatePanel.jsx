import { Card, CardBody, CardHeader } from './Card'
import { WarningIcon } from './Icons'
import { Separator } from './Separator'

/**
 * Panel de Control de Estados para Testing
 * Permite simular diferentes estados de la aplicación (loading, error)
 *
 * @param {Object} props
 * @param {boolean} props.loading - Estado actual de carga
 * @param {function} props.setLoading - Función para cambiar el estado de carga
 * @param {Object|null} props.error - Estado actual de error (null si no hay error)
 * @param {function} props.setError - Función para cambiar el estado de error
 */
export function TestStatePanel ({ loading, setLoading, error, setError }) {
  return (
    <section>
      <Card>
        <CardHeader>
          <div className='header-with-icon'>
            <WarningIcon />
            <h2>Panel de Control de Estados</h2>
          </div>
        </CardHeader>

        <CardBody>
          <p className='muted-text' style={{ marginBottom: '1rem' }}>
            Esta sección te permite simular diferentes estados de la aplicación para pruebas.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '250px' }}>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Estado de Carga</h3>
              <div className='button-group'>
                <button
                  className='info'
                  onClick={() => setLoading(true)}
                >
                  Activar Carga
                </button>
                <button
                  className='muted'
                  onClick={() => setLoading(false)}
                >
                  Desactivar Carga
                </button>
              </div>
              <p className='muted-text' style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Estado actual: <strong>{loading ? 'Cargando...' : 'Inactivo'}</strong>
              </p>
            </div>

            <div style={{ flex: '1', minWidth: '250px' }}>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Estado de Error</h3>
              <div className='button-group'>
                <button
                  className='danger'
                  onClick={() => setError({ message: 'Error simulado para pruebas' })}
                >
                  Simular Error
                </button>
                <button
                  className='muted'
                  onClick={() => setError(null)}
                >
                  Limpiar Error
                </button>
              </div>
              <p className='muted-text' style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Estado actual: <strong>{error ? `Error: ${error.message}` : 'Sin errores'}</strong>
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Acciones Rápidas</h3>
            <div className='button-group'>
              <button
                className='warning'
                onClick={() => {
                  setLoading(false)
                  setError(null)
                }}
              >
                Resetear Todo
              </button>
              <button
                className='info'
                onClick={() => {
                  setLoading(true)
                  setTimeout(() => setLoading(false), 2000)
                }}
              >
                Simular Carga (2s)
              </button>
              <button
                className='danger'
                onClick={() => {
                  setError({ message: 'Error de conexión con el servidor' })
                  setTimeout(() => setError(null), 3000)
                }}
              >
                Simular Error (3s)
              </button>
            </div>
          </div>
        </CardBody>
      </Card>
    </section>
  )
}
