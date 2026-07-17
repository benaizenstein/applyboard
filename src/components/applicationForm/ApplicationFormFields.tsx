import { Autocomplete, MenuItem, TextField } from '@mui/material'
import { Controller } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { APPLICATION_STAGES } from '../../api/applications/applications.types'
import type { ApplicationFormValues } from './applicationForm.schema'

interface ApplicationFormFieldsProps {
  control: Control<ApplicationFormValues>
}

export function ApplicationFormFields({ control }: ApplicationFormFieldsProps) {
  const { t } = useTranslation()

  return (
    <>
      <Controller
        name="company"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label={t('form.fields.company')}
            error={fieldState.error !== undefined}
            helperText={fieldState.error?.message ? t(fieldState.error.message) : undefined}
            fullWidth
          />
        )}
      />
      <Controller
        name="role"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label={t('form.fields.role')}
            error={fieldState.error !== undefined}
            helperText={fieldState.error?.message ? t(fieldState.error.message) : undefined}
            fullWidth
          />
        )}
      />
      <Controller
        name="location"
        control={control}
        render={({ field }) => (
          <TextField {...field} label={t('form.fields.location')} fullWidth />
        )}
      />
      <Controller
        name="stage"
        control={control}
        render={({ field }) => (
          <TextField {...field} select label={t('form.fields.stage')} fullWidth>
            {APPLICATION_STAGES.map((stage) => (
              <MenuItem key={stage} value={stage}>
                {t(`stages.${stage}`)}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      <Controller
        name="stack"
        control={control}
        render={({ field }) => (
          <Autocomplete
            multiple
            freeSolo
            options={[] as string[]}
            value={field.value}
            onChange={(_event, value) => field.onChange(value)}
            renderInput={(params) => <TextField {...params} label={t('form.fields.stack')} />}
          />
        )}
      />
      <Controller
        name="salaryRange"
        control={control}
        render={({ field }) => (
          <TextField {...field} label={t('form.fields.salaryRange')} fullWidth />
        )}
      />
      <Controller
        name="notes"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label={t('form.fields.notes')}
            error={fieldState.error !== undefined}
            helperText={fieldState.error?.message ? t(fieldState.error.message) : undefined}
            multiline
            minRows={3}
            fullWidth
          />
        )}
      />
    </>
  )
}
