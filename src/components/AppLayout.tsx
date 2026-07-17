import TranslateIcon from '@mui/icons-material/Translate'
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NAV_ITEMS = [
  { to: '/board', labelKey: 'app.nav.board', icon: <ViewKanbanOutlinedIcon /> },
  { to: '/insights', labelKey: 'app.nav.insights', icon: <InsightsOutlinedIcon /> },
]

export function AppLayout() {
  const { t, i18n } = useTranslation()
  const location = useLocation()

  function toggleLanguage() {
    void i18n.changeLanguage(i18n.language === 'he' ? 'en' : 'he')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6">{t('app.title')}</Typography>
          <Stack direction="row" gap={1} sx={{ mx: 2 }}>
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.to}
                component={NavLink}
                to={item.to}
                color="inherit"
                startIcon={item.icon}
                sx={{
                  opacity: location.pathname.startsWith(item.to) ? 1 : 0.7,
                  fontWeight: location.pathname.startsWith(item.to) ? 700 : 400,
                }}
              >
                {t(item.labelKey)}
              </Button>
            ))}
          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit" startIcon={<TranslateIcon />} onClick={toggleLanguage}>
            {t('app.languageToggle')}
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  )
}
