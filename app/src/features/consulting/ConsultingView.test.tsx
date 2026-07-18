import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConsultingView } from './ConsultingView'
import { WORKSPACE_STORAGE_KEY } from './workspace/workspace.logic'
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
    await user.click(screen.getByTestId('consult-tab-playbook'))
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
    expect(localStorage.getItem(WORKSPACE_STORAGE_KEY)).toContain('fiveWhys')
    expect(localStorage.getItem(WORKSPACE_STORAGE_KEY)).toContain('Claims copilot')

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

  it('tracks engagement gates and generates a deliverable draft', async () => {
    const user = userEvent.setup()
    const downloadSpy = vi
      .spyOn(exportModule, 'downloadTextFile')
      .mockImplementation(() => undefined)

    renderConsult('/consult?tab=control')

    expect(await screen.findByTestId('engagement-control-view')).toBeInTheDocument()
    await user.type(screen.getByTestId('engagement-client-name'), 'Contoso')
    await user.type(screen.getByTestId('engagement-name'), 'Support Copilot')

    await user.click(screen.getByTestId('engagement-gate-criterion-0'))
    await user.click(screen.getByTestId('engagement-gate-criterion-1'))
    await user.click(screen.getByTestId('engagement-gate-criterion-2'))
    await user.click(screen.getByTestId('engagement-gate-criterion-3'))

    expect(screen.getByTestId('guidance-next')).toHaveTextContent('Advance to')

    await user.type(screen.getByTestId('engagement-risk-text'), 'No executive sponsor')
    await user.selectOptions(screen.getByTestId('engagement-risk-severity'), 'high')
    await user.click(screen.getByTestId('engagement-add-risk'))
    expect(screen.getByTestId('engagement-rag')).toHaveTextContent('Amber')

    await user.click(screen.getByTestId('consult-tab-deliverables'))
    expect(await screen.findByTestId('deliverable-builder-view')).toBeInTheDocument()
    await user.click(screen.getByTestId('deliverable-generate'))
    expect(await screen.findByTestId('deliverable-preview')).toBeInTheDocument()
    expect(screen.getByTestId('deliverable-markdown')).toHaveTextContent('Contoso')
    await user.click(screen.getByTestId('deliverable-writeback'))
    expect(await screen.findByTestId('deliverable-writeback-message')).toBeInTheDocument()
    await user.click(screen.getByTestId('deliverable-download-md'))
    expect(downloadSpy).toHaveBeenCalled()
  })

  it('opens full-feature centres and workspace setup', async () => {
    const user = userEvent.setup()
    const downloadSpy = vi
      .spyOn(exportModule, 'downloadTextFile')
      .mockImplementation(() => undefined)

    renderConsult('/consult?tab=home')

    expect(await screen.findByTestId('consulting-home-view')).toBeInTheDocument()
    await user.click(screen.getByTestId('home-open-control'))
    expect(await screen.findByTestId('engagement-control-view')).toBeInTheDocument()
    await user.click(screen.getByTestId('consult-tab-home'))
    await user.click(screen.getByTestId('home-open-journey'))
    expect(await screen.findByTestId('consulting-journey-view')).toBeInTheDocument()
    await user.click(screen.getByTestId('consult-tab-home'))
    await user.click(screen.getByTestId('home-open-workspaces'))
    expect(await screen.findByTestId('client-workspaces-view')).toBeInTheDocument()

    await user.type(screen.getByTestId('workspace-new-client-name'), 'Fabrikam')
    await user.type(screen.getByTestId('workspace-new-client-industry'), 'Retail')
    await user.click(screen.getByTestId('workspace-add-client'))
    await user.type(screen.getByTestId('workspace-new-engagement-name'), 'GenAI wave 2')
    await user.click(screen.getByTestId('workspace-add-engagement'))

    await user.type(screen.getByTestId('workspace-scope-in'), 'Customer service AI')
    await user.type(screen.getByTestId('workspace-scope-out'), 'HR systems')
    await user.type(screen.getByTestId('workspace-stakeholder-name'), 'Alex')
    await user.type(screen.getByTestId('workspace-stakeholder-role'), 'Sponsor')
    await user.click(screen.getByTestId('workspace-add-stakeholder'))
    await user.type(screen.getByTestId('workspace-raci-activity'), 'Governance')
    await user.type(screen.getByTestId('workspace-raci-responsible'), 'Risk')
    await user.type(screen.getByTestId('workspace-raci-accountable'), 'CISO')
    await user.click(screen.getByTestId('workspace-add-raci'))

    await user.click(screen.getByTestId('consult-tab-journey'))
    expect(await screen.findByTestId('consulting-journey-view')).toBeInTheDocument()
    await user.click(screen.getByTestId('journey-select-stage-2'))
    expect(await screen.findByTestId('journey-override-panel')).toBeInTheDocument()
    await user.type(screen.getByTestId('journey-override-reason'), 'Client urgency')
    await user.click(screen.getByTestId('journey-confirm-override'))
    await user.click(screen.getByTestId('journey-select-stage-0'))

    const moreToolsButton = screen.getByTestId('consult-more-tools')
    if (moreToolsButton.getAttribute('aria-expanded') !== 'true') {
      await user.click(moreToolsButton)
    }
    await user.click(screen.getByTestId('consult-tab-decisions'))
    expect(await screen.findByTestId('decision-centre-view')).toBeInTheDocument()
    await user.type(screen.getByTestId('decision-text'), 'Approve prototype')
    await user.type(screen.getByTestId('decision-owner'), 'Pat')
    await user.click(screen.getByTestId('decision-add'))

    await user.click(screen.getByTestId('consult-tab-governance'))
    expect(await screen.findByTestId('governance-centre-view')).toBeInTheDocument()
    await user.type(screen.getByTestId('governance-inventory-name'), 'Support bot')
    await user.type(screen.getByTestId('governance-inventory-owner'), 'Risk')
    await user.click(screen.getByTestId('governance-add-inventory'))
    await user.type(screen.getByTestId('governance-assessment-title'), 'DPIA screening')
    await user.click(screen.getByTestId('governance-add-assessment'))
    await user.type(screen.getByTestId('governance-exception-text'), 'Legacy model exception')
    await user.click(screen.getByTestId('governance-add-exception'))

    await user.click(screen.getByTestId('consult-tab-architecture'))
    expect(await screen.findByTestId('architecture-studio-view')).toBeInTheDocument()
    await user.type(screen.getByTestId('architecture-capability'), 'Service capability map')
    await user.type(screen.getByTestId('architecture-adr-title'), 'Use managed RAG')
    await user.type(screen.getByTestId('architecture-adr-decision'), 'Azure AI Search')
    await user.click(screen.getByTestId('architecture-add-adr'))

    await user.click(screen.getByTestId('consult-tab-service'))
    expect(await screen.findByTestId('service-centre-view')).toBeInTheDocument()
    await user.type(screen.getByTestId('service-catalogue'), 'Support copilot service')
    await user.type(screen.getByTestId('service-incident-title'), 'Timeout')
    await user.click(screen.getByTestId('service-add-incident'))
    await user.click(screen.getByTestId('service-download-report'))
    expect(downloadSpy).toHaveBeenCalled()

    await user.click(screen.getByTestId('consult-tab-copilot'))
    expect(await screen.findByTestId('copilot-panel')).toBeInTheDocument()
    expect(screen.getByTestId('copilot-disclaimer')).toBeInTheDocument()
    await user.click(screen.getByTestId('copilot-open-deliverable'))
    expect(await screen.findByTestId('deliverable-builder-view')).toBeInTheDocument()

    await user.selectOptions(screen.getByTestId('consult-persona'), 'read_only')
    expect(screen.getByTestId('consult-persona')).toHaveValue('read_only')
  })
})
