/**
 * Normaliza un texto para búsquedas, con opciones configurables.
 * Preserva la 'ñ' como una letra distinta.
 *
 * @param {string} text - El texto a normalizar.
 * @param {object} [options] - Opciones de normalización.
 * @param {boolean} [options.trim] - Quitar espacios al inicio/final (default: true).
 * @param {boolean} [options.toLowerCase] - Convertir a minúsculas (default: true).
 * @param {boolean} [options.removeAccents] - Quitar tildes y diacríticos (default: true).
 * @param {boolean} [options.removeExtraSpaces] - Reemplazar espacios múltiples por uno solo (default: true).
 * @returns {string} El texto normalizado.
 */
export const normalizeString = (text, { trim = true, toLowerCase = true, removeAccents = true, removeExtraSpaces = true } = {}) => {
  if (typeof text !== 'string') return ''

  let normalized = text

  if (trim) {
    normalized = normalized.trim()
  }

  if (toLowerCase) {
    normalized = normalized.toLowerCase()
  }

  if (removeAccents) {
    normalized = normalized
      .replace(/[áäâà]/g, 'a')
      .replace(/[ÁÄÂÀ]/g, 'A')
      .replace(/[éëêè]/g, 'e')
      .replace(/[ÉËÊÈ]/g, 'E')
      .replace(/[íïîì]/g, 'i')
      .replace(/[ÍÏÎÌ]/g, 'I')
      .replace(/[óöôò]/g, 'o')
      .replace(/[ÓÖÔÒ]/g, 'O')
      .replace(/[úüûù]/g, 'u')
      .replace(/[ÚÜÛÙ]/g, 'U')
  }

  if (removeExtraSpaces) {
    normalized = normalized.replace(/\s+/g, ' ')
  }

  return normalized
}

/**
 * Remueve acentos de las vocales en un texto.
 * @param {string} text - El texto del cual se removerán los acentos.
 * @returns {string} El texto sin acentos.
 */
export const removeAccents = (text) => {
  if (typeof text !== 'string') return ''
  const normalized = text
    .replace(/[áäâà]/g, 'a')
    .replace(/[ÁÄÂÀ]/g, 'A')
    .replace(/[éëêè]/g, 'e')
    .replace(/[ÉËÊÈ]/g, 'E')
    .replace(/[íïîì]/g, 'i')
    .replace(/[ÍÏÎÌ]/g, 'I')
    .replace(/[óöôò]/g, 'o')
    .replace(/[ÓÖÔÒ]/g, 'O')
    .replace(/[úüûù]/g, 'u')
    .replace(/[ÚÜÛÙ]/g, 'U')

  return normalized
}

/**
 * Reemplaza múltiples espacios consecutivos por un solo espacio.
 * @param {string} text - El texto a normalizar.
 * @returns {string} El texto con espacios normalizados.
 */
export const removeExtraSpaces = (text) => {
  if (typeof text !== 'string') return ''
  const normalized = text.replace(/\s+/g, ' ')
  return normalized
}
