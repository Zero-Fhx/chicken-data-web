export const parseLocalDate = (dateString) => {
  if (!dateString) return new Date()

  const [year, month, day] = dateString.split('T')[0].split('-')

  return new Date(year, month - 1, day)
}

export const formatLocalDate = (dateString) => {
  if (!dateString) return '-'

  const date = parseLocalDate(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
