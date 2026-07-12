import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { PLAYBOOK_PASSWORD, AUTH_STORAGE_KEY, AUTH_TOKEN } from './constants/playbook'
import { PROJECT_STORAGE_KEY } from './constants/journey'

const framedProject = {
  outcome: 'Grounded GenAI assistant for claims handlers',
  users: 'Claims handlers',
  constraints: 'EU residency',
  ecosystem: 'Azure-centric',
  deployment: 'Cloud-native',
  selectedLayer: '07 AI & Intelligent Systems',
  selectedCapability: '',
  selectedScenario: '',
  preferredProvider: 'undecided',
  decisionNotes: '',
  stack: [],
  updatedAt: new Date().toISOString(),
}

describe('End-to-end journey smoke', () => {
  beforeEach(() => {
    sessionStorage.setItem(AUTH_STORAGE_KEY, AUTH_TOKEN)
    localStorage.removeItem(PROJECT_STORAGE_KEY)
    window.location.hash = '#/'
  })

  it('guides from hub through frame into the map', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByTestId('hub-view')).toBeInTheDocument()
    await user.click(screen.getByTestId('start-journey'))
    expect(await screen.findByTestId('frame-view')).toBeInTheDocument()

    await user.type(
      screen.getByTestId('frame-outcome'),
      'Grounded GenAI assistant for claims handlers',
    )
    await user.selectOptions(screen.getByTestId('frame-ecosystem'), 'Azure-centric')
    await user.click(screen.getByTestId('frame-continue'))
    expect(await screen.findByTestId('map-view')).toBeInTheDocument()
    await user.click(screen.getByTestId('layer-07'))
    expect(screen.getByTestId('journey-rail')).toBeInTheDocument()
    expect(screen.getByTestId('step-nav')).toBeInTheDocument()
  })

  it('walks picks, compare, decide, finops, canvas, ai, and summary', async () => {
    const user = userEvent.setup()
    localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(framedProject))
    window.location.hash = '#/picks'
    render(<App />)

    expect(await screen.findByTestId('picks-view')).toBeInTheDocument()
    await user.type(screen.getByTestId('picks-search'), 'RAG')
    const pickButtons = within(screen.getByTestId('picks-view')).getAllByRole('button')
    await user.click(pickButtons[0])
    await user.click(screen.getByTestId('picks-use'))

    await user.click(screen.getByTestId('nav-compare'))
    expect(await screen.findByTestId('compare-view')).toBeInTheDocument()
    await user.type(screen.getByTestId('compare-search'), 'foundation')
    await user.click(screen.getByTestId('compare-add-best'))

    await user.click(screen.getByTestId('nav-decide'))
    expect(await screen.findByTestId('decide-view')).toBeInTheDocument()
    await user.selectOptions(screen.getByTestId('decide-ecosystem'), 'Azure-centric')
    await user.click(screen.getByTestId('decide-apply'))

    await user.click(screen.getByTestId('nav-finops'))
    expect(await screen.findByTestId('finops-view')).toBeInTheDocument()
    await user.click(screen.getByTestId('finops-provider-aws'))

    await user.click(screen.getByTestId('nav-canvas'))
    expect(await screen.findByTestId('canvas-view')).toBeInTheDocument()
    expect(within(screen.getByTestId('canvas-stack')).getAllByRole('listitem').length).toBeGreaterThan(0)
    await user.click(screen.getByTestId('canvas-embed-toggle'))
    expect(screen.getByTestId('canvas-embed')).toBeInTheDocument()

    await user.click(screen.getByTestId('nav-ai'))
    expect(await screen.findByTestId('ai-view')).toBeInTheDocument()
    await user.click(screen.getByTestId('ai-tab-governance'))

    await user.click(screen.getByTestId('nav-summary'))
    expect(await screen.findByTestId('summary-view')).toBeInTheDocument()
    expect(screen.getByTestId('summary-stack')).toBeInTheDocument()
    await user.type(screen.getByTestId('summary-notes'), 'Validate residency before go-live')
    await user.click(screen.getByTestId('summary-export'))
  })

  it('opens ConsultAI OS from the hub', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('start-consulting'))
    expect(await screen.findByTestId('consulting-view')).toBeInTheDocument()
    expect(screen.getByTestId('consulting-result-count')).toHaveTextContent('Showing 20 of 20')
  })

  it('locks the shell and continues a framed journey from hub', async () => {
    const user = userEvent.setup()
    localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(framedProject))
    render(<App />)
    expect(screen.getByTestId('start-journey')).toHaveTextContent('Continue architecture journey')
    await user.click(screen.getByTestId('lock-button'))
    expect(await screen.findByTestId('password-gate')).toBeInTheDocument()
  })

  it('still unlocks with password', async () => {
    const user = userEvent.setup()
    sessionStorage.clear()
    window.location.hash = '#/'
    render(<App />)
    await user.type(screen.getByTestId('password-input'), PLAYBOOK_PASSWORD)
    await user.click(screen.getByTestId('password-submit'))
    expect(await screen.findByTestId('hub-view')).toBeInTheDocument()
  })
})
