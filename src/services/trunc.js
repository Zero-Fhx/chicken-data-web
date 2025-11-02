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
