import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConsultingView } from './ConsultingView'
import { WORKSHOP_STORAGE_KEY } from './workshop.logic'
import * as exportModule from './consulting.export'

function renderConsult(initialEntry = '/consult') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <ConsultingView />
    </MemoryRouter>,
  )
}

describe('Consulting workshop flow', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('defines a use case, runs Five Whys, and exports a pack', async () => {
    const user = userEvent.setup()
    const downloadSpy = vi
      .spyOn(exportModule, 'downloadTextFile')
      .mockImplementation(() => undefined)

    renderConsult()

    expect(screen.getByTestId('consulting-view')).toBeInTheDocument()
    await user.click(screen.getByTestId('consulting-run-workshop-stage-5'))
    expect(await screen.findByTestId('workshop-studio')).toBeInTheDocument()

    await user.type(screen.getByTestId('workshop-usecase-name'), 'Claims copilot')
    await user.type(
      screen.getByTestId('workshop-usecase-businessProblem'),
      'Handlers spend too long finding clauses',
    )
    expect(screen.getByTestId('workshop-use-case-status')).toHaveTextContent(
      'Ready for frameworks',
    )

    await user.click(screen.getByTestId('workshop-framework-fiveWhys'))
    expect(await screen.findByTestId('framework-detail')).toBeInTheDocument()
    await user.click(screen.getByTestId('framework-run-canvas'))
    expect(await screen.findByTestId('framework-canvas')).toBeInTheDocument()
    expect(screen.getByTestId('canvas-use-case-banner')).toHaveTextContent('Claims copilot')
    expect(screen.getByTestId('canvas-field-problem')).toHaveValue(
      'Handlers spend too long finding clauses',
    )

    await user.type(screen.getByTestId('canvas-field-why1'), 'Agents rework cases')
    await user.type(screen.getByTestId('canvas-field-rootCause'), 'Incomplete intake data')
    await user.click(screen.getByTestId('canvas-save'))

    expect(await screen.findByTestId('workshop-studio')).toBeInTheDocument()
    expect(localStorage.getItem(WORKSHOP_STORAGE_KEY)).toContain('fiveWhys')
    expect(localStorage.getItem(WORKSHOP_STORAGE_KEY)).toContain('Claims copilot')

    await user.click(screen.getByTestId('workshop-export-pack'))
    expect(downloadSpy).toHaveBeenCalledTimes(3)
  })

  it('opens Framework Lab and blocks empty canvas saves', async () => {
    const user = userEvent.setup()
    renderConsult('/consult?tab=lab')

    expect(await screen.findByTestId('framework-lab')).toBeInTheDocument()
    await user.click(screen.getByTestId('framework-lab-item-mece'))
    expect(await screen.findByTestId('framework-detail')).toBeInTheDocument()
    await user.click(screen.getByTestId('framework-run-canvas'))
    await user.click(screen.getByTestId('canvas-save'))
    expect(screen.getByTestId('canvas-error')).toBeInTheDocument()
  })
})
