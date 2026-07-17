import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import type { Application } from '../../api/applications/applications.types'
import { tokens } from '../../theme/tokens'

const VISIBLE_STACK_COUNT = 3

interface ApplicationCardProps {
  application: Application
  onSelect: (id: string) => void
}

export function ApplicationCard({ application, onSelect }: ApplicationCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: application.id,
  })

  const hiddenStackCount = application.stack.length - VISIBLE_STACK_COUNT

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => onSelect(application.id)}
      variant="outlined"
      sx={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        borderRadius: `${tokens.radius.md}px`,
        touchAction: 'none',
        '&:hover': { borderColor: 'primary.main' },
      }}
    >
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography variant="subtitle2">{application.role}</Typography>
        <Typography variant="body2" color="text.secondary">
          {application.company}
        </Typography>
        {application.location && (
          <Typography variant="caption" color="text.secondary">
            {application.location}
          </Typography>
        )}
        {application.stack.length > 0 && (
          <Stack direction="row" gap={0.5} flexWrap="wrap" mt={1}>
            {application.stack.slice(0, VISIBLE_STACK_COUNT).map((technology) => (
              <Chip key={technology} label={technology} size="small" />
            ))}
            {hiddenStackCount > 0 && (
              <Chip label={`+${hiddenStackCount}`} size="small" variant="outlined" />
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  )
}
