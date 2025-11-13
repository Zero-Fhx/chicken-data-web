import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const escapeCSV = (val) => {
  if (val == null) {
    return ''
  }
  let str = String(val)
  if (str.includes(',')) {
    str = `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/**
 * Exporta datos a un archivo CSV.
 * @param {string[]} headers - Array de strings para las cabeceras. Ej: ['ID', 'Nombre']
 * @param {Array<Array<any>>} data - Array de arrays con los datos de las filas. Ej: [[1, 'Plato A'], [2, 'Plato B']]
 * @param {string} filename - Nombre del archivo (ej. "reporte.csv")
 */
export const exportToCSV = (headers, data, filename) => {
  let csvContent = 'data:text/csv;charset=utf-8,'

  // Añadir cabeceras
  csvContent += headers.map(escapeCSV).join(',') + '\r\n'

  // Añadir filas
  data.forEach(rowArray => {
    csvContent += rowArray.map(escapeCSV).join(',') + '\r\n'
  })

  // Crear y descargar el archivo
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Exporta datos a un archivo Excel (.xlsx).
 * @param {string[]} headers - Array de strings para las cabeceras.
 * @param {Array<Array<any>>} data - Array de arrays con los datos de las filas.
 * @param {string} filename - Nombre del archivo (ej. "reporte.xlsx")
 * @param {string} sheetName - Nombre de la hoja dentro del archivo.
 */
export const exportToExcel = (headers, data, filename, sheetName = 'Datos') => {
  // Combinar cabeceras y datos
  const dataToExport = [headers, ...data]

  // Crear la hoja de trabajo
  const ws = XLSX.utils.aoa_to_sheet(dataToExport)

  // (Opcional) Ajustar anchos de columna
  const colWidths = headers.map((_, i) => ({
    wch: dataToExport.reduce((w, r) => Math.max(w, String(r[i] || '').length), 10)
  }))
  ws['!cols'] = colWidths

  // Crear el libro de trabajo
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)

  // Descargar el archivo
  XLSX.writeFile(wb, filename)
}

/**
 * Exporta datos a un archivo PDF.
 * @param {string[]} headers - Array de strings para las cabeceras.
 * @param {Array<Array<any>>} data - Array de arrays con los datos de las filas.
 * @param {string} filename - Nombre del archivo (ej. "reporte.pdf")
 * @param {string} title - Título para el documento PDF.
 */
export const exportToPDF = (headers, data, filename, title) => {
  // eslint-disable-next-line new-cap
  const doc = new jsPDF()

  doc.text(title, 14, 20)

  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 25,
    theme: 'striped',
    headStyles: {
      fillColor: [34, 49, 63],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
  })

  doc.save(filename)
}
