import { describe, expect, it, beforeEach, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { CanvasView } from './CanvasView'
import { EXCALIDRAW_LABELS } from './excalidraw.constants'
import { ProjectProvider } from '../journey/ProjectProvider'
import { PROJECT_STORAGE_KEY } from '../../constants/journey'
import { AUTH_STORAGE_KEY, AUTH_TOKEN } from '../../constants/playbook'

vi.mock('./ExcalidrawBoard', () => ({
  ExcalidrawBoard: function ExcalidrawBoardMock() {
    return <div data-testid="excalidraw-board">Excalidraw board</div>
  },
}))

const seededProject = {
  outcome: 'Grounded GenAI assistant',
  users: 'Claims handlers',
  constraints: 'EU residency',
  ecosystem: 'Azure-centric',
  deployment: 'Cloud-native',
  selectedLayer: '07 AI & Intelligent Systems',
  selectedCapability: '',
  selectedScenario: '',
  preferredProvider: 'azure' as const,
  decisionNotes: '',
  stack: [
    {
      id: 'stack-1',
      layer: '07 AI & Intelligent Systems',
      capability: 'Foundation Models',
      provider: 'azure' as const,
      service: 'Azure OpenAI',
      source: 'canvas' as const,
    },
  ],
  updatedAt: new Date().toISOString(),
}

function renderCanvas(): void {
  render(
    <MemoryRouter>
      <ProjectProvider>
        <CanvasView />
      </ProjectProvider>
    </MemoryRouter>,
  )
}

describe('CanvasView', () => {
  beforeEach(() => {
    sessionStorage.setItem(AUTH_STORAGE_KEY, AUTH_TOKEN)
    localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(seededProject))
  })

  it('renders the stack and opens Excalidraw on demand', async () => {
    const user = userEvent.setup()
    renderCanvas()

    expect(screen.getByTestId('canvas-view')).toBeInTheDocument()
    expect(screen.getByText(EXCALIDRAW_LABELS.subtitle)).toBeInTheDocument()
    expect(within(screen.getByTestId('canvas-stack')).getAllByRole('listitem')).toHaveLength(1)
    expect(screen.queryByTestId('canvas-embed')).not.toBeInTheDocument()

    await user.click(screen.getByTestId('canvas-embed-toggle'))
    expect(screen.getByTestId('canvas-embed')).toBeInTheDocument()
    expect(await screen.findByTestId('excalidraw-board')).toBeInTheDocument()
    expect(screen.getByTestId('canvas-embed-toggle')).toHaveTextContent(EXCALIDRAW_LABELS.hide)

    await user.click(screen.getByTestId('canvas-embed-toggle'))
    expect(screen.queryByTestId('canvas-embed')).not.toBeInTheDocument()
  })

  it('adds a capability from search and clears the stack', async () => {
    const user = userEvent.setup()
    renderCanvas()

    await user.type(screen.getByTestId('canvas-search'), 'Foundation')
    const addButtons = within(screen.getByTestId('canvas-view')).getAllByRole('button')
    const foundationButton = addButtons.find((button) =>
      button.textContent?.toLowerCase().includes('foundation'),
    )
    expect(foundationButton).toBeDefined()
    if (!foundationButton) {
      throw new Error('Expected a foundation capability button')
    }
    await user.click(foundationButton)
    expect(within(screen.getByTestId('canvas-stack')).getAllByRole('listitem').length).toBeGreaterThan(1)

    await user.click(screen.getByTestId('canvas-clear'))
    expect(screen.getByText(/Add from Compare/i)).toBeInTheDocument()
  })

  it('exports the decision brief as markdown', async () => {
    const user = userEvent.setup()
    const clickSpy = vi.fn()
    const originalCreateElement = document.createElement.bind(document)
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const element = originalCreateElement(tagName)
      if (tagName === 'a') {
        Object.defineProperty(element, 'click', { value: clickSpy })
      }
      return element
    })

    renderCanvas()
    await user.click(screen.getByTestId('canvas-export'))
    expect(clickSpy).toHaveBeenCalled()
  })
})
