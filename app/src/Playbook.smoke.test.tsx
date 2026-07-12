import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { PLAYBOOK_PASSWORD, AUTH_STORAGE_KEY, AUTH_TOKEN } from './constants/playbook'

describe('Playbook navigation smoke', () => {
  beforeEach(() => {
    sessionStorage.setItem(AUTH_STORAGE_KEY, AUTH_TOKEN)
    window.location.hash = '#/'
  })

  it('opens map, compare, picks, decide, finops, canvas, and ai planes', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByTestId('nav-map'))
    expect(await screen.findByTestId('map-view')).toBeInTheDocument()
    await user.click(screen.getByTestId('layer-02'))
    expect(screen.getByTestId('layer-detail')).toBeInTheDocument()

    await user.click(screen.getByTestId('nav-compare'))
    expect(await screen.findByTestId('compare-view')).toBeInTheDocument()
    await user.type(screen.getByTestId('compare-search'), 'foundation')
    await user.selectOptions(screen.getByTestId('compare-layer'), screen.getByRole('option', { name: /07 AI/i }))
    const compareList = screen.getByTestId('compare-list')
    const firstResult = within(compareList).getAllByRole('button')[0]
    await user.click(firstResult)
    expect(screen.getByTestId('compare-detail')).toBeInTheDocument()

    await user.click(screen.getByTestId('nav-picks'))
    expect(await screen.findByTestId('picks-view')).toBeInTheDocument()
    await user.type(screen.getByTestId('picks-search'), 'RAG')
    const picksButtons = within(screen.getByTestId('picks-view')).getAllByRole('button')
    await user.click(picksButtons[0])
    expect(screen.getByTestId('picks-detail')).toBeInTheDocument()

    await user.click(screen.getByTestId('nav-decide'))
    expect(await screen.findByTestId('decide-view')).toBeInTheDocument()
    await user.selectOptions(screen.getByTestId('decide-ecosystem'), 'Azure-centric')
    await user.selectOptions(screen.getByTestId('decide-deployment'), 'Hybrid')
    await user.click(screen.getByTestId('weight-capabilityDepth'))
    expect(screen.getByTestId('decide-winner')).toBeInTheDocument()

    await user.click(screen.getByTestId('nav-finops'))
    expect(await screen.findByTestId('finops-view')).toBeInTheDocument()
    await user.click(screen.getByTestId('finops-provider-aws'))
    await user.selectOptions(screen.getByTestId('finops-tier'), 'efficient')
    await user.clear(screen.getByTestId('finops-input-tokens'))
    await user.type(screen.getByTestId('finops-input-tokens'), '4000')
    await user.clear(screen.getByTestId('finops-output-tokens'))
    await user.type(screen.getByTestId('finops-output-tokens'), '800')
    await user.clear(screen.getByTestId('finops-daily'))
    await user.type(screen.getByTestId('finops-daily'), '5000')
    expect(screen.getByTestId('finops-monthly')).toBeInTheDocument()
    const altButton = within(screen.getByTestId('finops-detail')).queryAllByRole('button')[0]
    if (altButton) {
      await user.click(altButton)
    }

    await user.click(screen.getByTestId('nav-canvas'))
    expect(await screen.findByTestId('canvas-view')).toBeInTheDocument()
    await user.selectOptions(screen.getByTestId('canvas-provider'), 'aws')
    await user.type(screen.getByTestId('canvas-search'), 'vector')
    const aside = screen.getByTestId('canvas-view').querySelector('aside')
    expect(aside).toBeTruthy()
    const addButtons = within(aside as HTMLElement).getAllByRole('button')
    await user.click(addButtons[0])
    await user.click(screen.getByTestId('canvas-embed-toggle'))
    expect(screen.getByTestId('canvas-embed')).toBeInTheDocument()
    await user.click(screen.getByTestId('canvas-clear'))

    await user.click(screen.getByTestId('nav-ai'))
    expect(await screen.findByTestId('ai-view')).toBeInTheDocument()
    await user.click(screen.getByTestId('ai-tab-governance'))
    expect(screen.getByTestId('ai-governance-list')).toBeInTheDocument()
    await user.click(screen.getByTestId('ai-tab-strengths'))
    expect(screen.getByTestId('ai-strengths-list')).toBeInTheDocument()
    await user.click(screen.getByTestId('ai-tab-platform'))
    await user.selectOptions(screen.getByTestId('ai-domain'), screen.getAllByRole('option')[1])
  })

  it('locks the playbook from the shell', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('hub-view')).toBeInTheDocument()
    await user.click(screen.getByTestId('lock-button'))
    expect(await screen.findByTestId('password-gate')).toBeInTheDocument()
  })

  it('can unlock from password gate after lock', async () => {
    const user = userEvent.setup()
    sessionStorage.clear()
    window.location.hash = '#/'
    render(<App />)
    await user.type(screen.getByTestId('password-input'), PLAYBOOK_PASSWORD)
    await user.click(screen.getByTestId('password-submit'))
    expect(await screen.findByTestId('hub-view')).toBeInTheDocument()
    expect(screen.getByTestId('plane-map')).toBeInTheDocument()
  })
})
