import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { UndoToast } from '../guidance'
import { SummaryView } from './SummaryView'
import { ProjectProvider } from './ProjectProvider'
import { PROJECT_STORAGE_KEY } from '../../constants/journey'
import { createEmptyValidationChecks } from './validation.logic'

function seedReadyProject(): void {
  localStorage.setItem(
    PROJECT_STORAGE_KEY,
    JSON.stringify({
      outcome: 'Grounded GenAI assistant for claims handlers',
      users: 'Claims handlers',
      constraints: 'EU residency',
      ecosystem: 'Azure-centric',
      deployment: 'Cloud-native',
      selectedLayer: '07 AI',
      selectedCapability: 'RAG',
      selectedScenario: 'RAG',
      preferredProvider: 'azure',
      decisionNotes: '',
      stack: [
        {
          id: '1',
          layer: '07 AI',
          capability: 'RAG',
          provider: 'azure',
          service: 'Azure AI Search',
          source: 'compare',
        },
      ],
      validationChecks: createEmptyValidationChecks(),
      updatedAt: new Date().toISOString(),
    }),
  )
}

function renderSummary() {
  return render(
    <MemoryRouter initialEntries={['/summary']}>
      <ProjectProvider>
        <SummaryView />
        <UndoToast />
      </ProjectProvider>
    </MemoryRouter>,
  )
}

describe('SummaryView closure', () => {
  it('toggles validation checks and confirms reset with undo', async () => {
    const user = userEvent.setup()
    seedReadyProject()
    renderSummary()

    expect(screen.getByTestId('summary-validation-checklist')).toBeInTheDocument()
    expect(screen.getByTestId('workspace-sync-panel')).toBeInTheDocument()
    await user.click(screen.getByTestId('summary-check-residency'))
    expect(screen.getByTestId('summary-check-residency')).toBeChecked()

    await user.click(screen.getByTestId('summary-reset'))
    expect(screen.getByTestId('summary-reset-confirm')).toBeInTheDocument()
    await user.click(screen.getByTestId('summary-reset-confirm-confirm'))
    expect(screen.getByTestId('undo-toast')).toBeInTheDocument()
    await user.click(screen.getByTestId('undo-toast-action'))
    expect(screen.queryByTestId('undo-toast')).not.toBeInTheDocument()
  })
})
