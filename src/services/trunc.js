export default function trunc(value, decimals = 2) {
  const string = value.toString();
  const decimalPointIndex = string.indexOf('.');

  if (decimalPointIndex === -1) {
    return Number(string);
  }
  
  const decimalLength = decimalPointIndex + 1;
  const numStr = string.substr(0, decimalLength + decimals);
  return Number(numStr);
}