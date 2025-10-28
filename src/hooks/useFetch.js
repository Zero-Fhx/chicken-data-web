import { useCallback, useEffect, useState } from 'react'

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

          setError({
            status: response.status,
            ...JSON.parse(errorText)
          })
          setData(null)
          return
        }

        const result = await response.json()

        if (!signal.aborted) {
          setData(result)
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch abortado exitosamente.')
        } else {
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
