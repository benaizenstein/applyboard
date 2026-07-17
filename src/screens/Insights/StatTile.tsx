import { Paper, Typography } from '@mui/material'
import { tokens } from '../../theme/tokens'

interface StatTileProps {
  label: string
  value: number
  accentColor?: string
}

export function StatTile({ label, value, accentColor }: StatTileProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: `${tokens.radius.md}px`,
        borderInlineStart: `3px solid ${accentColor ?? tokens.color.primary}`,
      }}
    >
      <Typography variant="h4" fontWeight={700}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Paper>
  )
}
