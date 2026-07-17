import { createDemoExtractionProvider } from './demoExtractionProvider'
import type { ExtractionService } from './extraction.types'

export const extractionService: ExtractionService = createDemoExtractionProvider()
