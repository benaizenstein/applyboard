export interface ExtractedFields {
  company: string
  role: string
  location: string
  stack: string[]
  salaryRange: string
}

export type ExtractionChunk = {
  [K in keyof ExtractedFields]: { field: K; value: ExtractedFields[K] }
}[keyof ExtractedFields]

export interface ExtractionService {
  extract(postingText: string): AsyncGenerator<ExtractionChunk>
}
