import { useCallback } from 'react'
import type { PageNode } from '@/types/crawler'
import {
  formatAsTxt,
  formatAsCsv,
  formatAsJson,
  formatAsXml,
  formatAsMarkdown,
  downloadFile,
  getFilename,
} from '@/utils/exportFormatters'

type ExportFormat = 'txt' | 'csv' | 'json' | 'xml' | 'md'

export function useExport(pages: PageNode[], rootUrl: string) {
  const exportData = useCallback(
    (format: ExportFormat) => {
      if (pages.length === 0) return

      let content = ''
      let mimeType = 'text/plain'

      switch (format) {
        case 'txt':
          content = formatAsTxt(pages)
          mimeType = 'text/plain'
          break
        case 'csv':
          content = formatAsCsv(pages)
          mimeType = 'text/csv'
          break
        case 'json':
          content = formatAsJson(pages, rootUrl)
          mimeType = 'application/json'
          break
        case 'xml':
          content = formatAsXml(pages, rootUrl)
          mimeType = 'application/xml'
          break
        case 'md':
          content = formatAsMarkdown(pages, rootUrl)
          mimeType = 'text/markdown'
          break
      }

      downloadFile(content, getFilename(format, rootUrl), mimeType)
    },
    [pages, rootUrl]
  )

  return { exportData }
}
