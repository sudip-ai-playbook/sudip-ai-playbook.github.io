import type { ReactElement } from 'react'
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import axe from 'axe-core'
import { AppShell } from '../features/layout/AppShell'
import { HubView } from '../features/hub/HubView'
import { FrameView } from '../features/journey/FrameView'
import { SummaryView } from '../features/journey/SummaryView'
import { ProjectProvider } from '../features/journey/ProjectProvider'

async function seriousViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: {
      'color-contrast': { enabled: false },
    },
  })
  return results.violations.filter(
    (violation) => violation.impact === 'critical' || violation.impact === 'serious',
  )
}

function renderShell(path: string, element: ReactElement) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ProjectProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={element} />
            <Route path="/frame" element={element} />
            <Route path="/summary" element={element} />
          </Route>
        </Routes>
      </ProjectProvider>
    </MemoryRouter>,
  )
}

describe('WCAG smoke — key routes', () => {
  it('hub has no serious axe violations', async () => {
    const { container } = renderShell('/', <HubView />)
    expect(await seriousViolations(container)).toEqual([])
  })

  it('frame has no serious axe violations', async () => {
    const { container } = renderShell('/frame', <FrameView />)
    expect(await seriousViolations(container)).toEqual([])
  })

  it('summary has no serious axe violations', async () => {
    const { container } = renderShell('/summary', <SummaryView />)
    expect(await seriousViolations(container)).toEqual([])
  })
})
