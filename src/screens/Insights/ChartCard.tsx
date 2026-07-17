import { Paper, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { tokens } from '../../theme/tokens'

interface ChartCardProps {
  title: string
  children: ReactNode
}

export function ChartCard({ title, children }: ChartCardProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: `${tokens.radius.md}px` }}>
      <Typography variant="subtitle2" mb={1}>
        {title}
      </Typography>
      {children}
    </Paper>
  )
}
