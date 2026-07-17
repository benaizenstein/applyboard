import { z } from 'zod'
import { APPLICATION_STAGES } from '../../api/applications/applications.types'

export const applicationFormSchema = z.object({
  company: z.string().trim().min(1, 'form.errors.required'),
  role: z.string().trim().min(1, 'form.errors.required'),
  location: z.string().trim(),
  stage: z.enum(APPLICATION_STAGES),
  stack: z.array(z.string().trim().min(1)),
  salaryRange: z.string().trim(),
  notes: z.string().trim().max(500, 'form.errors.notesTooLong'),
})

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>

export const emptyApplicationForm: ApplicationFormValues = {
  company: '',
  role: '',
  location: '',
  stage: 'saved',
  stack: [],
  salaryRange: '',
  notes: '',
}
