import { CircularProgress, Stack } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { lazy, Suspense } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { BoardScreen } from './screens/Board/BoardScreen'
import { AppThemeProvider } from './theme/AppThemeProvider'

const InsightsScreen = lazy(() =>
  import('./screens/Insights/InsightsScreen').then((module) => ({
    default: module.InsightsScreen,
  })),
)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <HashRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/board" replace />} />
              <Route path="/board" element={<BoardScreen />} />
              <Route
                path="/insights"
                element={
                  <Suspense
                    fallback={
                      <Stack alignItems="center" py={8}>
                        <CircularProgress />
                      </Stack>
                    }
                  >
                    <InsightsScreen />
                  </Suspense>
                }
              />
            </Route>
          </Routes>
        </HashRouter>
      </AppThemeProvider>
    </QueryClientProvider>
  )
}

export default App
