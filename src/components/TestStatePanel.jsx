import { Card, CardBody, CardHeader } from './Card'
import { WarningIcon } from './Icons'
import { Separator } from './Separator'
import { Button } from './ui/Button'

/**
 * Panel de control para simular estados de la aplicación durante el desarrollo.
 * * Permite forzar estados de carga y de error para probar la resiliencia de la UI sin depender de la respuesta real de una API.
 *
 * @param {Object} props - Objeto de propiedades del componente.
 * @param {boolean} props.loading - El estado de carga actual.
 * @param {function} props.setLoading - Callback para actualizar el estado de carga.
 * @param {Object|null} props.error - El objeto de error actual.
 * @param {function} props.setError - Callback para actualizar el estado de error.
 *
 * @returns {React.ReactElement} El elemento JSX renderizado.
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
                <Button
                  className='info'
                  onClick={() => setLoading(true)}
                >
                  Activar Carga
                </Button>
                <Button
                  className='muted'
                  onClick={() => setLoading(false)}
                >
                  Desactivar Carga
                </Button>
              </div>
              <p className='muted-text' style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Estado actual: <strong>{loading ? 'Cargando...' : 'Inactivo'}</strong>
              </p>
            </div>

            <div style={{ flex: '1', minWidth: '250px' }}>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Estado de Error</h3>
              <div className='button-group'>
                <Button
                  className='danger'
                  onClick={() => setError({ message: 'Error simulado para pruebas' })}
                >
                  Simular Error
                </Button>
                <Button
                  className='muted'
                  onClick={() => setError(null)}
                >
                  Limpiar Error
                </Button>
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
              <Button
                className='warning'
                onClick={() => {
                  setLoading(false)
                  setError(null)
                }}
              >
                Resetear Todo
              </Button>
              <Button
                className='info'
                onClick={() => {
                  setLoading(true)
                  setTimeout(() => setLoading(false), 2000)
                }}
              >
                Simular Carga (2s)
              </Button>
              <Button
                className='danger'
                onClick={() => {
                  setError({ message: 'Error de conexión con el servidor' })
                  setTimeout(() => setError(null), 3000)
                }}
              >
                Simular Error (3s)
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </section>
  )
}
