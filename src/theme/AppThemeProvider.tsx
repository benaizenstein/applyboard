import { CacheProvider } from '@emotion/react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ltrCache, rtlCache } from './emotionCache'
import { buildTheme } from './theme'

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  const direction = i18n.dir()

  useEffect(() => {
    document.documentElement.dir = direction
    document.documentElement.lang = i18n.language
  }, [direction, i18n.language])

  const theme = useMemo(() => buildTheme(direction), [direction])

  return (
    <CacheProvider value={direction === 'rtl' ? rtlCache : ltrCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  )
}
