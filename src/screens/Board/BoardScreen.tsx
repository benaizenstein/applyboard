import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AddFromPostingDialog } from '../AddFromPosting/AddFromPostingDialog'
import { ApplicationDetailsDrawer } from './ApplicationDetailsDrawer'
import { StageColumn } from './StageColumn'
import { orderedStages } from './stageConfig'
import { useBoardViewModel } from './useBoardViewModel'

export function BoardScreen() {
  const { t } = useTranslation()
  const { columns, isLoading, selected, selectApplication, closeDetails, handleDragEnd } =
    useBoardViewModel()
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  return (
    <Stack gap={2}>
      <Stack direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          startIcon={<AutoAwesomeIcon />}
          onClick={() => setAddDialogOpen(true)}
        >
          {t('board.addFromPosting')}
        </Button>
      </Stack>
      {isLoading ? (
        <Stack alignItems="center" gap={2} py={8}>
          <CircularProgress />
          <Typography color="text.secondary">{t('board.loading')}</Typography>
        </Stack>
      ) : (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' },
              gap: 2,
              alignItems: 'start',
            }}
          >
            {orderedStages.map((stage) => (
              <StageColumn
                key={stage}
                stage={stage}
                applications={columns[stage]}
                onSelect={selectApplication}
              />
            ))}
          </Box>
        </DndContext>
      )}
      <AddFromPostingDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} />
      <ApplicationDetailsDrawer application={selected} onClose={closeDetails} />
    </Stack>
  )
}
