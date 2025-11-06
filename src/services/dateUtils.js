const TIMEZONE = import.meta.env.VITE_TIMEZONE || 'America/Lima'
const LOCALE = import.meta.env.VITE_LOCALE || 'es-PE'

export const formatDateTime = (dateString) => {
  if (!dateString) return '-'

  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  if (isNaN(date.getTime())) return '-'

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
    timeZone: TIMEZONE
  }

  const formatter = new Intl.DateTimeFormat(LOCALE, options)
  return formatter.format(date)
}

export const formatDate = (dateString) => {
  if (!dateString) return '-'

  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  if (isNaN(date.getTime())) return '-'

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: TIMEZONE
  }

  const formatter = new Intl.DateTimeFormat(LOCALE, options)
  return formatter.format(date)
}

export const formatTime = (dateString) => {
  if (!dateString) return '-'

  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  if (isNaN(date.getTime())) return '-'

  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: TIMEZONE
  }

  const formatter = new Intl.DateTimeFormat(LOCALE, options)
  return formatter.format(date)
}

export const formatDateShort = (dateString) => {
  if (!dateString) return '-'

  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  if (isNaN(date.getTime())) return '-'

  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: TIMEZONE
  }

  const formatter = new Intl.DateTimeFormat(LOCALE, options)
  return formatter.format(date)
}

export const formatDateInput = (dateString) => {
  if (!dateString) return ''

  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  if (isNaN(date.getTime())) return ''

  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: TIMEZONE
  })

  return formatter.format(date)
}

export const getToday = () => {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: TIMEZONE
  })

  return formatter.format(now)
}
