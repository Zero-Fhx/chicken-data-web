import { useCallback, useEffect, useState } from 'react'

export function useFetch (url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(url)
      const result = await response.json()
      setData(result)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = () => { fetchData() }

  return { data, loading, error, setData, setLoading, setError, refetch }
}
