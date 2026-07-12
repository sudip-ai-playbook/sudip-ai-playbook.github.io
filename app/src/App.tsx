import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './features/auth/AuthContext'
import { useAuth } from './features/auth/useAuth'
import { PasswordGate } from './features/auth/PasswordGate'
import { AppShell } from './features/layout/AppShell'
import { HubView } from './features/hub/HubView'
import { MapView } from './features/map/MapView'
import { CompareView } from './features/compare/CompareView'
import { QuickPicksView } from './features/picks/QuickPicksView'
import { DecideView } from './features/decide/DecideView'
import { FinOpsView } from './features/finops/FinOpsView'
import { CanvasView } from './features/canvas/CanvasView'
import { AiPlatformView } from './features/ai/AiPlatformView'

function ProtectedApp() {
  const { authenticated } = useAuth()
  if (!authenticated) {
    return <PasswordGate />
  }
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HubView />} />
        <Route path="map" element={<MapView />} />
        <Route path="compare" element={<CompareView />} />
        <Route path="picks" element={<QuickPicksView />} />
        <Route path="decide" element={<DecideView />} />
        <Route path="finops" element={<FinOpsView />} />
        <Route path="canvas" element={<CanvasView />} />
        <Route path="ai" element={<AiPlatformView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <ProtectedApp />
      </AuthProvider>
    </HashRouter>
  )
}
