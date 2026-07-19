import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { PROJECT_STORAGE_KEY } from './constants/journey'
import {
  BUY_ME_A_COFFEE_URL,
  KO_FI_URL,
  LEARNING_MAP_PATH,
} from './constants/playbook'

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
    localStorage.removeItem(PROJECT_STORAGE_KEY)
    window.location.hash = '#/'
  })

  it('guides from hub through frame into the map', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByTestId('hub-view')).toBeInTheDocument()
    await user.click(screen.getByTestId('hub-primary-cta'))
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

  it('walks picks, compare, decide, finops, canvas, and summary via journey rail', async () => {
    const user = userEvent.setup()
    localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(framedProject))
    window.location.hash = '#/picks'
    render(<App />)

    expect(await screen.findByTestId('picks-view')).toBeInTheDocument()
    await user.type(screen.getByTestId('picks-search'), 'RAG')
    const pickButtons = within(screen.getByTestId('picks-view')).getAllByRole('button')
    await user.click(pickButtons[0])
    await user.click(screen.getByTestId('picks-use'))

    await user.click(screen.getByTestId('journey-step-compare'))
    expect(await screen.findByTestId('compare-view')).toBeInTheDocument()
    await user.type(screen.getByTestId('compare-search'), 'foundation')
    await user.click(screen.getByTestId('compare-add-best'))

    await user.click(screen.getByTestId('journey-step-decide'))
    expect(await screen.findByTestId('decide-view')).toBeInTheDocument()
    await user.selectOptions(screen.getByTestId('decide-ecosystem'), 'Azure-centric')
    await user.click(screen.getByTestId('decide-apply'))

    await user.click(screen.getByTestId('journey-step-finops'))
    expect(await screen.findByTestId('finops-view')).toBeInTheDocument()
    await user.click(screen.getByTestId('finops-provider-aws'))

    await user.click(screen.getByTestId('journey-step-canvas'))
    expect(await screen.findByTestId('canvas-view')).toBeInTheDocument()
    expect(within(screen.getByTestId('canvas-stack')).getAllByRole('listitem').length).toBeGreaterThan(0)
    await user.click(screen.getByTestId('canvas-embed-toggle'))
    expect(screen.getByTestId('canvas-embed')).toBeInTheDocument()

    await user.click(screen.getByTestId('journey-step-summary'))
    expect(await screen.findByTestId('summary-view')).toBeInTheDocument()
    expect(screen.getByTestId('summary-stack')).toBeInTheDocument()
    await user.type(screen.getByTestId('summary-notes'), 'Validate residency before go-live')
    await user.click(screen.getByTestId('summary-export'))
  })

  it('opens engagement workspace from the nav', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-consult'))
    expect(await screen.findByTestId('consulting-view')).toBeInTheDocument()
    expect(screen.getByTestId('consulting-home-view')).toBeInTheDocument()
    await user.click(screen.getByTestId('consult-tab-playbook'))
    expect(screen.getByTestId('consulting-result-count')).toHaveTextContent('Showing 20 of 20')
  })

  it('continues a framed journey from hub and links to learning content', async () => {
    const user = userEvent.setup()
    localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(framedProject))
    render(<App />)
    expect(screen.getByTestId('hub-primary-cta')).toHaveTextContent('Continue')
    expect(screen.queryByTestId('hub-progress')).not.toBeInTheDocument()
    expect(screen.getByTestId('nav-blog')).toHaveAttribute('href', LEARNING_MAP_PATH)
    expect(screen.getByTestId('nav-buy-me-a-coffee')).toHaveAttribute(
      'href',
      BUY_ME_A_COFFEE_URL,
    )
    expect(screen.getByTestId('nav-ko-fi')).toHaveAttribute('href', KO_FI_URL)
    expect(screen.getByTestId('brand-home')).toHaveAttribute('href', '#/')
    expect(screen.queryByTestId('shell-outcome')).not.toBeInTheDocument()
    expect(screen.queryByTestId('hub-blog-featured')).not.toBeInTheDocument()
    expect(screen.queryByTestId('workspace-sync-panel')).not.toBeInTheDocument()

    await user.click(screen.getByTestId('hub-primary-cta'))
    expect(await screen.findByTestId('picks-view')).toBeInTheDocument()
    await user.click(screen.getByTestId('brand-home'))
    expect(await screen.findByTestId('hub-view')).toBeInTheDocument()
  })
})
