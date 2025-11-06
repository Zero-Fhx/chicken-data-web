const DEFAULT_TIMEZONE = import.meta.env.VITE_TIMEZONE || 'America/Lima'
const DEFAULT_LOCALE = import.meta.env.VITE_LOCALE || 'es-PE'

/**
 * Formatea una fecha y hora a un formato legible.
 * * Devuelve una cadena con el año, mes, día, hora, minutos y zona horaria.
 *
 * @param {string|Date} dateString - La fecha a formatear.
 * @param {string} [locale] - El locale a usar (ej: 'es-PE'). Por defecto usa DEFAULT_LOCALE.
 * @param {string} [timezone] - La zona horaria (ej: 'America/Lima'). Por defecto usa DEFAULT_TIMEZONE.
 * @returns {string} La fecha y hora formateada o "-".
 */
export const formatDateTime = (dateString, locale = DEFAULT_LOCALE, timezone = DEFAULT_TIMEZONE) => {
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
    timeZone: timezone
  }

  const formatter = new Intl.DateTimeFormat(locale, options)
  return formatter.format(date)
}

/**
 * Formatea una fecha a un formato legible.
 * * Devuelve una cadena con el día de la semana, día, mes y año.
 *
 * @param {string|Date} dateString - La fecha a formatear.
 * @param {string} [locale] - El locale a usar. Por defecto usa DEFAULT_LOCALE.
 * @param {string} [timezone] - La zona horaria. Por defecto usa DEFAULT_TIMEZONE.
 * @returns {string} La fecha formateada o "-".
 */
export const formatDate = (dateString, locale = DEFAULT_LOCALE, timezone = DEFAULT_TIMEZONE) => {
  if (!dateString) return '-'

  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  if (isNaN(date.getTime())) return '-'

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: timezone
  }

  const formatter = new Intl.DateTimeFormat(locale, options)
  return formatter.format(date)
}

/**
 * Formatea la hora de una fecha a un formato legible.
 * * Devuelve una cadena con la hora y minutos en formato de 12 horas.
 *
 * @param {string|Date} dateString - La fecha de la que se extraerá la hora.
 * @param {string} [locale] - El locale a usar. Por defecto usa DEFAULT_LOCALE.
 * @param {string} [timezone] - La zona horaria. Por defecto usa DEFAULT_TIMEZONE.
 * @returns {string} La hora formateada o "-".
 */
export const formatTime = (dateString, locale = DEFAULT_LOCALE, timezone = DEFAULT_TIMEZONE) => {
  if (!dateString) return '-'

  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  if (isNaN(date.getTime())) return '-'

  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone
  }

  const formatter = new Intl.DateTimeFormat(locale, options)
  return formatter.format(date)
}

/**
 * Formatea una fecha a un formato corto (dd/mm/yyyy).
 * * Devuelve una cadena con el día, mes y año en formato numérico.
 *
 * @param {string|Date} dateString - La fecha a formatear.
 * @param {string} [locale] - El locale a usar. Por defecto usa DEFAULT_LOCALE.
 * @param {string} [timezone] - La zona horaria. Por defecto usa DEFAULT_TIMEZONE.
 * @returns {string} La fecha formateada en formato corto o "-".
 */
export const formatDateShort = (dateString, locale = DEFAULT_LOCALE, timezone = DEFAULT_TIMEZONE) => {
  if (!dateString) return '-'

  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  if (isNaN(date.getTime())) return '-'

  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: timezone
  }

  const formatter = new Intl.DateTimeFormat(locale, options)
  return formatter.format(date)
}

/**
 * Formatea una fecha al formato requerido por los inputs de tipo `date` (yyyy-mm-dd).
 * * Utiliza el locale 'en-CA' para asegurar el formato correcto.
 *
 * @param {string|Date} dateString - La fecha a formatear.
 * @param {string} [timezone] - La zona horaria. Por defecto usa DEFAULT_TIMEZONE.
 * @returns {string} La fecha formateada en formato yyyy-mm-dd o una cadena vacía.
 */
export const formatDateInput = (dateString, timezone = DEFAULT_TIMEZONE) => {
  if (!dateString) return ''

  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  if (isNaN(date.getTime())) return ''

  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: timezone
  })

  return formatter.format(date)
}

/**
 * Obtiene la fecha actual en el formato requerido por los inputs de tipo `date` (yyyy-mm-dd).
 * * Devuelve la fecha de hoy según la zona horaria configurada.
 *
 * @param {string} [timezone] - La zona horaria. Por defecto usa DEFAULT_TIMEZONE.
 * @returns {string} La fecha actual en formato yyyy-mm-dd.
 */
export const getToday = (timezone = DEFAULT_TIMEZONE) => {
  const now = new Date()

  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: timezone
  })

  return formatter.format(now)
}
