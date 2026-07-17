import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { Box, Button, Drawer, IconButton, Stack, Typography } from '@mui/material'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  useDeleteApplication,
  useUpdateApplication,
} from '../../api/applications/applications.queries'
import type { Application } from '../../api/applications/applications.types'
import { ApplicationFormFields } from '../../components/applicationForm/ApplicationFormFields'
import {
  applicationFormSchema,
  emptyApplicationForm,
} from '../../components/applicationForm/applicationForm.schema'
import type { ApplicationFormValues } from '../../components/applicationForm/applicationForm.schema'

interface ApplicationDetailsDrawerProps {
  application: Application | null
  onClose: () => void
}

export function ApplicationDetailsDrawer({ application, onClose }: ApplicationDetailsDrawerProps) {
  const { t } = useTranslation()
  const updateApplication = useUpdateApplication()
  const deleteApplication = useDeleteApplication()

  const { control, handleSubmit, reset } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: emptyApplicationForm,
  })

  useEffect(() => {
    if (application) {
      reset({
        company: application.company,
        role: application.role,
        location: application.location,
        stage: application.stage,
        stack: [...application.stack],
        salaryRange: application.salaryRange,
        notes: application.notes,
      })
    }
  }, [application, reset])

  const onSubmit = handleSubmit((values) => {
    if (!application) return
    updateApplication.mutate({ id: application.id, patch: values }, { onSuccess: onClose })
  })

  function handleDelete() {
    if (!application) return
    deleteApplication.mutate(application.id, { onSuccess: onClose })
  }

  return (
    <Drawer anchor="right" open={application !== null} onClose={onClose}>
      <Box component="form" onSubmit={onSubmit} sx={{ width: { xs: '100vw', sm: 400 }, p: 3 }}>
        <Stack gap={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">{t('details.title')}</Typography>
            <IconButton onClick={onClose} aria-label={t('details.cancel')}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <ApplicationFormFields control={control} />
          <Stack direction="row" justifyContent="space-between">
            <Button
              color="error"
              startIcon={<DeleteOutlineIcon />}
              onClick={handleDelete}
              loading={deleteApplication.isPending}
            >
              {t('details.delete')}
            </Button>
            <Button type="submit" variant="contained" loading={updateApplication.isPending}>
              {t('details.save')}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Drawer>
  )
}
