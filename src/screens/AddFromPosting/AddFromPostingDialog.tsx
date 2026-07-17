import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useCreateApplication } from '../../api/applications/applications.queries'
import { ApplicationFormFields } from '../../components/applicationForm/ApplicationFormFields'
import {
  applicationFormSchema,
  emptyApplicationForm,
} from '../../components/applicationForm/applicationForm.schema'
import type { ApplicationFormValues } from '../../components/applicationForm/applicationForm.schema'
import type { ExtractionChunk } from '../../services/extraction/extraction.types'
import { ExtractionProgress } from './ExtractionProgress'
import { useExtractionViewModel } from './useExtractionViewModel'

const MIN_POSTING_LENGTH = 30

type DialogStep = 'paste' | 'review'

interface AddFromPostingDialogProps {
  open: boolean
  onClose: () => void
}

export function AddFromPostingDialog({ open, onClose }: AddFromPostingDialogProps) {
  const { t } = useTranslation()
  const [step, setStep] = useState<DialogStep>('paste')
  const [postingText, setPostingText] = useState('')
  const createApplication = useCreateApplication()

  const { control, handleSubmit, reset, setValue } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: emptyApplicationForm,
  })

  function applyChunk(chunk: ExtractionChunk) {
    if (chunk.field === 'stack') {
      setValue('stack', chunk.value, { shouldValidate: true })
    } else {
      setValue(chunk.field, chunk.value, { shouldValidate: true })
    }
  }

  const extraction = useExtractionViewModel(applyChunk)

  function handleClose() {
    extraction.reset()
    reset(emptyApplicationForm)
    setPostingText('')
    setStep('paste')
    onClose()
  }

  function startExtraction() {
    setStep('review')
    void extraction.run(postingText)
  }

  function startManual() {
    setStep('review')
  }

  function backToPaste() {
    extraction.reset()
    reset(emptyApplicationForm)
    setStep('paste')
  }

  const onSubmit = handleSubmit((values) => {
    createApplication.mutate(values, { onSuccess: handleClose })
  })

  const isExtracting = extraction.status === 'running'

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('extraction.dialogTitle')}</DialogTitle>
      {step === 'paste' ? (
        <>
          <DialogContent>
            <TextField
              value={postingText}
              onChange={(event) => setPostingText(event.target.value)}
              label={t('extraction.pasteLabel')}
              placeholder={t('extraction.pastePlaceholder')}
              multiline
              minRows={10}
              fullWidth
              autoFocus
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t('extraction.cancel')}</Button>
            <Button onClick={startManual}>{t('extraction.manual')}</Button>
            <Button
              variant="contained"
              startIcon={<AutoAwesomeIcon />}
              onClick={startExtraction}
              disabled={postingText.trim().length < MIN_POSTING_LENGTH}
            >
              {t('extraction.extract')}
            </Button>
          </DialogActions>
        </>
      ) : (
        <form onSubmit={onSubmit}>
          <DialogContent>
            <Stack gap={2} sx={{ mt: 1 }}>
              <ExtractionProgress
                status={extraction.status}
                completedFields={extraction.completedFields}
              />
              <ApplicationFormFields control={control} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={backToPaste} disabled={isExtracting}>
              {t('extraction.back')}
            </Button>
            <Button onClick={handleClose}>{t('extraction.cancel')}</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isExtracting}
              loading={createApplication.isPending}
            >
              {t('extraction.add')}
            </Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  )
}
