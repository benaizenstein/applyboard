import { describe, expect, it } from 'vitest'
import { applicationFormSchema, emptyApplicationForm } from './applicationForm.schema'

const validValues = {
  ...emptyApplicationForm,
  company: 'Lumenpath',
  role: 'Senior Frontend Engineer',
}

describe('applicationFormSchema', () => {
  it('accepts a valid application', () => {
    const result = applicationFormSchema.safeParse(validValues)
    expect(result.success).toBe(true)
  })

  it('rejects an empty company with a translatable message', () => {
    const result = applicationFormSchema.safeParse({ ...validValues, company: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('form.errors.required')
    }
  })

  it('trims surrounding whitespace', () => {
    const result = applicationFormSchema.parse({ ...validValues, company: '  Lumenpath  ' })
    expect(result.company).toBe('Lumenpath')
  })

  it('rejects notes longer than 500 characters', () => {
    const result = applicationFormSchema.safeParse({ ...validValues, notes: 'a'.repeat(501) })
    expect(result.success).toBe(false)
  })
})
