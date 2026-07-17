import { describe, expect, it } from 'vitest'
import { createDemoExtractionProvider, parseSalaryRange } from './demoExtractionProvider'
import type { ExtractionChunk } from './extraction.types'

const SAMPLE_POSTING = `Senior Frontend Engineer
Company: Lumenpath
Location: Tel Aviv, Hybrid

We are building a real-time analytics platform and are looking for an
experienced engineer to join the web team.

Requirements:
- 5+ years with React and TypeScript
- Experience with GraphQL and testing with Vitest
- Familiarity with Docker is a plus

Salary: ₪40k-48k`

async function collectChunks(text: string) {
  const provider = createDemoExtractionProvider(0)
  const chunks: ExtractionChunk[] = []
  for await (const chunk of provider.extract(text)) {
    chunks.push(chunk)
  }
  return chunks
}

describe('demoExtractionProvider', () => {
  it('emits every field exactly once in a stable order', async () => {
    const chunks = await collectChunks(SAMPLE_POSTING)
    expect(chunks.map((chunk) => chunk.field)).toEqual([
      'company',
      'role',
      'location',
      'stack',
      'salaryRange',
    ])
  })

  it('extracts structured values from a realistic posting', async () => {
    const chunks = await collectChunks(SAMPLE_POSTING)
    const byField = Object.fromEntries(chunks.map((chunk) => [chunk.field, chunk.value]))
    expect(byField.company).toBe('Lumenpath')
    expect(byField.role).toBe('Senior Frontend Engineer')
    expect(byField.location).toBe('Tel Aviv, Hybrid')
    expect(byField.stack).toEqual(
      expect.arrayContaining(['React', 'TypeScript', 'GraphQL', 'Vitest', 'Docker']),
    )
    expect(byField.salaryRange).toBe('₪40k-48k')
  })

  it('returns empty values instead of failing on unrelated text', async () => {
    const chunks = await collectChunks('lorem ipsum dolor sit amet')
    const byField = Object.fromEntries(chunks.map((chunk) => [chunk.field, chunk.value]))
    expect(byField.role).toBe('')
    expect(byField.stack).toEqual([])
    expect(byField.salaryRange).toBe('')
  })
})

describe('parseSalaryRange', () => {
  it('matches currency ranges in different formats', () => {
    expect(parseSalaryRange('pay is $120k - 140k per year')).toBe('$120k-140k')
    expect(parseSalaryRange('₪38,000-45,000 monthly')).toBe('₪38,000-45,000')
  })
})
