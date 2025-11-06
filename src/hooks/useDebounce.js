import { useEffect, useState } from 'react'

/**
 * Hook que retrasa la actualización de un valor hasta que ha pasado un tiempo determinado sin que este cambie.
 * * Es útil para evitar ejecuciones costosas (como peticiones a una API) mientras el usuario sigue escribiendo en un input.
 *
 * @param {any} value - El valor que se quiere "debounced".
 * @param {number} delay - El tiempo en milisegundos que se debe esperar antes de actualizar el valor.
 * @returns {any} El valor "debounced", que se actualizará solo después de que el valor original no haya cambiado durante el `delay` especificado.
 */
export function useDebounce (value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
