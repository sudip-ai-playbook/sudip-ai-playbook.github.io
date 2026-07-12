import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './features/auth/AuthContext'
import { useAuth } from './features/auth/useAuth'
import { PasswordGate } from './features/auth/PasswordGate'
import { ProjectProvider } from './features/journey/ProjectProvider'
import { AppShell } from './features/layout/AppShell'
import { HubView } from './features/hub/HubView'
import { FrameView } from './features/journey/FrameView'
import { SummaryView } from './features/journey/SummaryView'
import { MapView } from './features/map/MapView'
import { CompareView } from './features/compare/CompareView'
import { QuickPicksView } from './features/picks/QuickPicksView'
import { DecideView } from './features/decide/DecideView'
import { FinOpsView } from './features/finops/FinOpsView'
import { CanvasView } from './features/canvas/CanvasView'
import { AiPlatformView } from './features/ai/AiPlatformView'
import { ConsultingView } from './features/consulting'

function ProtectedApp() {
  const { authenticated } = useAuth()
  if (!authenticated) {
    return <PasswordGate />
  }
  return (
    <ProjectProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HubView />} />
          <Route path="consult" element={<ConsultingView />} />
          <Route path="frame" element={<FrameView />} />
          <Route path="map" element={<MapView />} />
          <Route path="compare" element={<CompareView />} />
          <Route path="picks" element={<QuickPicksView />} />
          <Route path="decide" element={<DecideView />} />
          <Route path="finops" element={<FinOpsView />} />
          <Route path="canvas" element={<CanvasView />} />
          <Route path="ai" element={<AiPlatformView />} />
          <Route path="summary" element={<SummaryView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </ProjectProvider>
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
