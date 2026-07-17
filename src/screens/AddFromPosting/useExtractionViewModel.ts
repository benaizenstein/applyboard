import { useRef, useState } from 'react'
import { extractionService } from '../../services/extraction/ExtractionService'
import type { ExtractionChunk } from '../../services/extraction/extraction.types'

export type ExtractionStatus = 'idle' | 'running' | 'done'

export const EXTRACTION_FIELD_ORDER: ExtractionChunk['field'][] = [
  'company',
  'role',
  'location',
  'stack',
  'salaryRange',
]

export function useExtractionViewModel(onChunk: (chunk: ExtractionChunk) => void) {
  const [status, setStatus] = useState<ExtractionStatus>('idle')
  const [completedFields, setCompletedFields] = useState<ExtractionChunk['field'][]>([])
  const runIdRef = useRef(0)

  async function run(postingText: string) {
    const runId = ++runIdRef.current
    setStatus('running')
    setCompletedFields([])
    for await (const chunk of extractionService.extract(postingText)) {
      if (runIdRef.current !== runId) return
      onChunk(chunk)
      setCompletedFields((fields) => [...fields, chunk.field])
    }
    if (runIdRef.current === runId) {
      setStatus('done')
    }
  }

  function reset() {
    runIdRef.current += 1
    setStatus('idle')
    setCompletedFields([])
  }

  return { status, completedFields, run, reset }
}
