import { createTheme } from '@mui/material'
import type { Direction } from '@mui/material'
import { tokens } from './tokens'

export function buildTheme(direction: Direction) {
  return createTheme({
    direction,
    palette: {
      primary: { main: tokens.color.primary, dark: tokens.color.primaryDark },
      background: { default: tokens.color.background, paper: tokens.color.surface },
      text: { primary: tokens.color.textPrimary, secondary: tokens.color.textSecondary },
      divider: tokens.color.border,
    },
    shape: { borderRadius: tokens.radius.sm },
    spacing: tokens.spacingUnit,
    typography: {
      fontFamily: tokens.fontFamily,
      h6: { fontWeight: 700 },
      subtitle2: { fontWeight: 600 },
    },
  })
}
