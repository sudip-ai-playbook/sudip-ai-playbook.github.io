import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HubView } from './HubView'
import { ProjectProvider } from '../journey/ProjectProvider'
import { LEARNING_MAP_PATH } from '../../constants/playbook'

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
  it('shows three primary paths without featured reading or tool grids', () => {
    renderHub()

    expect(screen.getByTestId('hub-primary-cta')).toHaveAttribute('href', '/consult')
    expect(screen.getByTestId('open-blog')).toHaveAttribute('href', LEARNING_MAP_PATH)
    expect(screen.getByTestId('path-learn')).toHaveAttribute('href', LEARNING_MAP_PATH)
    expect(screen.getByTestId('start-consulting')).toHaveAttribute('href', '/consult')
    expect(screen.getByTestId('start-journey')).toHaveAttribute('href', '/frame')

    expect(screen.queryByTestId('hub-blog-featured')).not.toBeInTheDocument()
    expect(screen.queryByTestId('plane-map')).not.toBeInTheDocument()
  })
})
