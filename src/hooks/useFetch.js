import { useCallback, useEffect, useState } from 'react'

/**
 * Hook para realizar peticiones de datos a una URL.
 * * Encapsula la lógica de fetch, incluyendo el manejo de estados de carga, errores, y la posibilidad de re-lanzar la petición.
 *
 * @param {string} url - La URL del endpoint al que se realizará la petición.
 * @returns {{
 *   data: any,
 *   loading: boolean,
 *   error: Object | null,
 *   setData: (data: any) => void,
 *   setLoading: (loading: boolean) => void,
 *   setError: (error: Object | null) => void,
 *   refetch: () => void
 * }} Un objeto que contiene los datos, el estado de carga, el error, y funciones para manipular el estado y re-lanzar la petición.
 */
export function useFetch (url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [trigger, setTrigger] = useState(0)

  const refetch = useCallback(() => {
    setTrigger(prev => prev + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(url, { signal })

        if (!response.ok) {
          const errorText = await response.text()

          if (signal.aborted) return

          let parsed = { message: errorText }
          try {
            parsed = JSON.parse(errorText)
          } catch {
            parsed = { message: errorText }
          }

          setError({
            status: response.status,
            ...parsed
          })
          setData(null)
          return
        }

        const contentType = response.headers.get('content-type') || ''
        if (!contentType.includes('application/json')) {
          const text = await response.text()
          if (signal.aborted) return
          setError({ message: 'Respuesta no-JSON del servidor', details: text.slice(0, 100) })
          setData(null)
          return
        }

        const result = await response.json()

        if (!signal.aborted) {
          setData(result)
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          if (!signal.aborted) {
            setError({
              message: error.message || 'Error de red',
              error
            })
            setData(null)
          }
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      controller.abort()
    }
  }, [url, trigger])

  return { data, loading, error, setData, setLoading, setError, refetch }
}
