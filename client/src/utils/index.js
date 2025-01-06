import { useEffect, useState } from 'react'
import XLSX from 'xlsx'
import { message } from 'antd'
import dayjs from 'dayjs'

const autofitColumns = (worksheet, data, header) => {
  if (!data?.length) return

  const keys = Object.keys(data[0])
  const wscols = keys.map((k, i) => ({
    wch: data
      .map(d => d[k])
      .reduce((w, r) => Math.max(w, r?.toString().length || 0), header[i].length),
  }))
  worksheet['!cols'] = wscols
}

const Download = (headers, data, fileName) => {
  if (!data?.length) {
    message.error('No data to download')
    return
  }

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.book_new()
  XLSX.utils.sheet_add_aoa(ws, [headers])
  XLSX.utils.sheet_add_json(ws, data, { origin: 'A2', skipHeader: true, raw: true })
  XLSX.utils.book_append_sheet(wb, ws)

  autofitColumns(ws, data, headers)
  XLSX.writeFile(wb, `${dayjs().format('Y-M-D HH:mm')} ${fileName}.xlsx`)
}

const DownloadFromTable = (tableId, fileName) => {
  const table = document.getElementById(tableId)
  const wb = XLSX.utils.table_to_book(table, { raw: true })
  XLSX.writeFile(wb, `${dayjs().format('Y-M-D HH:mm')} ${fileName}.xlsx`)
}

const useDownloadFromTable = (tableId, fileName) => {
  const [isDownloading, setIsDownloading] = useState(false)
  const download = () => {
    setIsDownloading(true)
  }

  useEffect(() => {
    if (isDownloading) {
      DownloadFromTable(tableId, fileName)
      setIsDownloading(false)
    }
  }, [isDownloading, tableId, fileName])
  return [isDownloading, download]
}

const onlyNumber = event => {
  // only number or key enter
  if (event.key === 'Enter') return
  if (!/[0-9]/.test(event.key)) event.preventDefault()
}

export { Download, DownloadFromTable, useDownloadFromTable, onlyNumber }
