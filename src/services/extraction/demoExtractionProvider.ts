import type { ExtractionService } from './extraction.types'

const KNOWN_TECHNOLOGIES = [
  'React',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Next.js',
  'Vue',
  'Angular',
  'GraphQL',
  'Redux',
  'MobX',
  'Vite',
  'Webpack',
  'Jest',
  'Vitest',
  'Cypress',
  'Playwright',
  'MUI',
  'Tailwind',
  'HTML',
  'CSS',
  'AWS',
  'Docker',
  'Kubernetes',
  'REST',
  'MongoDB',
  'PostgreSQL',
  'Redis',
  'Python',
  'Go',
  'Java',
]

const ROLE_PATTERN =
  /\b((?:senior |junior |staff |lead |principal )?(?:frontend|front-end|front end|full[- ]?stack|backend|back-end|software|web)[- ](?:engineer|developer|tech lead))\b/i

const LABELED_COMPANY_PATTERN = /^company\s*[:-]\s*(.+)$/im

const INLINE_COMPANY_PATTERN = /\b(?:at|join)\s+([A-Z][A-Za-z0-9&.]*(?:\s+[A-Z][A-Za-z0-9&.]*){0,2})/

const LABELED_LOCATION_PATTERN = /^location\s*[:-]\s*(.+)$/im

const KNOWN_LOCATION_PATTERN =
  /\b(tel aviv|jerusalem|haifa|herzliya|ramat gan|beer sheva|remote|hybrid|new york|london|berlin|amsterdam|paris)\b/i

const SALARY_PATTERN =
  /(?:[$€£₪]\s?\d[\d,.]*[kK]?|\d[\d,.]*[kK]?\s?(?:ILS|NIS|USD|EUR|GBP))(?:\s?[-–]\s?(?:[$€£₪]\s?)?\d[\d,.]*[kK]?)?/

function toTitleCase(value: string) {
  return value.replace(/\S+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1))
}

export function parseCompany(text: string): string {
  const labeled = LABELED_COMPANY_PATTERN.exec(text)
  if (labeled) return labeled[1].trim()
  const inline = INLINE_COMPANY_PATTERN.exec(text)
  if (inline) return inline[1].trim()
  const firstLine = text.split('\n').find((line) => line.trim().length > 0)?.trim() ?? ''
  return firstLine.length > 0 && firstLine.length <= 40 ? firstLine : ''
}

export function parseRole(text: string): string {
  const match = ROLE_PATTERN.exec(text)
  return match ? toTitleCase(match[1].replace(/\s+/g, ' ')) : ''
}

export function parseLocation(text: string): string {
  const labeled = LABELED_LOCATION_PATTERN.exec(text)
  if (labeled) return labeled[1].trim()
  const known = KNOWN_LOCATION_PATTERN.exec(text)
  return known ? toTitleCase(known[1]) : ''
}

export function parseStack(text: string): string[] {
  return KNOWN_TECHNOLOGIES.filter((technology) => {
    const escaped = technology.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return new RegExp(`\\b${escaped}\\b`, 'i').test(text)
  })
}

export function parseSalaryRange(text: string): string {
  const match = SALARY_PATTERN.exec(text)
  return match ? match[0].replace(/\s+/g, '') : ''
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function createDemoExtractionProvider(stepDelayMs = 500): ExtractionService {
  return {
    async *extract(postingText) {
      await sleep(stepDelayMs * 1.6)
      yield { field: 'company', value: parseCompany(postingText) }
      await sleep(stepDelayMs)
      yield { field: 'role', value: parseRole(postingText) }
      await sleep(stepDelayMs)
      yield { field: 'location', value: parseLocation(postingText) }
      await sleep(stepDelayMs * 1.3)
      yield { field: 'stack', value: parseStack(postingText) }
      await sleep(stepDelayMs)
      yield { field: 'salaryRange', value: parseSalaryRange(postingText) }
    },
  }
}
