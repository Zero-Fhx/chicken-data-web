const TIMEZONE = import.meta.env.VITE_TIMEZONE || 'America/Lima'
const LOCALE = import.meta.env.VITE_LOCALE || 'es-PE'

/**
 * Formatea una fecha y hora a un formato legible.
 * * Devuelve una cadena con el año, mes, día, hora, minutos y zona horaria.
 *
 * @param {string|Date} dateString - La fecha a formatear, puede ser un string ISO o un objeto Date.
 * @returns {string} La fecha y hora formateada (ej: "5 de noviembre de 2025, 10:30 AM GMT-5") o "-" si la fecha no es válida.
 */
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

/**
 * Formatea una fecha a un formato legible.
 * * Devuelve una cadena con el día de la semana, día, mes y año.
 *
 * @param {string|Date} dateString - La fecha a formatear, puede ser un string ISO o un objeto Date.
 * @returns {string} La fecha formateada (ej: "miércoles, 5 de noviembre de 2025") o "-" si la fecha no es válida.
 */
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

/**
 * Formatea la hora de una fecha a un formato legible.
 * * Devuelve una cadena con la hora y minutos en formato de 12 horas.
 *
 * @param {string|Date} dateString - La fecha de la que se extraerá la hora, puede ser un string ISO o un objeto Date.
 * @returns {string} La hora formateada (ej: "10:30 AM") o "-" si la fecha no es válida.
 */
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

/**
 * Formatea una fecha a un formato corto (dd/mm/yyyy).
 * * Devuelve una cadena con el día, mes y año en formato numérico.
 *
 * @param {string|Date} dateString - La fecha a formatear, puede ser un string ISO o un objeto Date.
 * @returns {string} La fecha formateada en formato corto (ej: "05/11/2025") o "-" si la fecha no es válida.
 */
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

/**
 * Formatea una fecha al formato requerido por los inputs de tipo `date` (yyyy-mm-dd).
 * * Utiliza el locale 'en-CA' para asegurar el formato correcto.
 *
 * @param {string|Date} dateString - La fecha a formatear, puede ser un string ISO o un objeto Date.
 * @returns {string} La fecha formateada en formato yyyy-mm-dd (ej: "2025-11-05") o una cadena vacía si la fecha no es válida.
 */
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

/**
 * Obtiene la fecha actual en el formato requerido por los inputs de tipo `date` (yyyy-mm-dd).
 * * Devuelve la fecha de hoy según la zona horaria configurada.
 *
 * @returns {string} La fecha actual en formato yyyy-mm-dd (ej: "2025-11-05").
 */
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
