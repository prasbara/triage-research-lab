/**
 * Export and serialization utilities for CSV and JSON datasets
 */

export function convertToCSV(data: Record<string, any>[]): string {
  if (!data || data.length === 0) return ''

  const headers = Object.keys(data[0])
  const headerLine = headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(',')

  const rows = data.map((row) => {
    return headers
      .map((header) => {
        const val = row[header]
        if (val === null || val === undefined) return '""'
        if (typeof val === 'object') {
          return `"${JSON.stringify(val).replace(/"/g, '""')}"`
        }
        return `"${String(val).replace(/"/g, '""')}"`
      })
      .join(',')
  })

  return [headerLine, ...rows].join('\r\n')
}

export function triggerDownload(content: string, filename: string, mimeType = 'text/csv;charset=utf-8;') {
  if (typeof window === 'undefined') return

  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportAsJSON(data: any, filename: string) {
  const jsonStr = JSON.stringify(data, null, 2)
  triggerDownload(jsonStr, filename, 'application/json;charset=utf-8;')
}

export function exportAsCSV(data: Record<string, any>[], filename: string) {
  const csv = convertToCSV(data)
  triggerDownload(csv, filename, 'text/csv;charset=utf-8;')
}
