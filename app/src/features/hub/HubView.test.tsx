import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HubView } from './HubView'
import { ProjectProvider } from '../journey/ProjectProvider'
import { APP_NAME } from '../../constants/playbook'

function renderHub() {
  return render(
    <MemoryRouter>
      <ProjectProvider>
        <HubView />
      </ProjectProvider>
    </MemoryRouter>,
  )
}

describe('HubView orientation', () => {
  it('renders a minimal hero with a single architecture CTA', () => {
    renderHub()

    expect(screen.getByTestId('hub-brand')).toHaveTextContent(APP_NAME)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'From ambiguity to decision.',
    )
    expect(screen.getByTestId('hub-primary-cta')).toHaveAttribute('href', '/frame')
    expect(screen.getByTestId('hub-primary-cta')).toHaveTextContent('Start')

    expect(screen.queryByTestId('hub-progress')).not.toBeInTheDocument()
    expect(screen.queryByTestId('start-consulting')).not.toBeInTheDocument()
    expect(screen.queryByTestId('path-learn')).not.toBeInTheDocument()
    expect(screen.queryByTestId('workspace-sync-panel')).not.toBeInTheDocument()
    expect(screen.queryByTestId('hub-blog-featured')).not.toBeInTheDocument()
    expect(screen.queryByTestId('plane-map')).not.toBeInTheDocument()
    expect(screen.queryByTestId('hub-support')).not.toBeInTheDocument()
  })
})
