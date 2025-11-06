/**
 * Trunca un número a una cantidad específica de decimales sin redondear.
 * * Convierte el número a string y corta los decimales sobrantes.
 *
 * @param {number|string} value - El número o string numérico a truncar.
 * @param {number} [decimals=2] - La cantidad de decimales a conservar.
 * @returns {string} El número truncado como una cadena de texto.
 */
export default function trunc (value, decimals = 2) {
  const string = value.toString()
  const decimalPointIndex = string.indexOf('.')

  if (decimalPointIndex === -1) {
    return string
  }

  const decimalLength = decimalPointIndex + 1
  const numStr = string.substring(0, decimalLength + decimals)
  return numStr
}
