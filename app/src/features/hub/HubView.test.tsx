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
  it('makes architecture the primary path and demotes secondary paths', () => {
    renderHub()

    expect(screen.getByTestId('hub-primary-cta')).toHaveAttribute('href', '/frame')
    expect(screen.getByTestId('start-journey')).toHaveAttribute('href', '/frame')
    expect(screen.getByTestId('start-consulting')).toHaveAttribute('href', '/consult')
    expect(screen.getByTestId('path-learn')).toHaveAttribute('href', LEARNING_MAP_PATH)

    expect(screen.queryByTestId('hub-blog-featured')).not.toBeInTheDocument()
    expect(screen.queryByTestId('plane-map')).not.toBeInTheDocument()
    expect(screen.queryByTestId('hub-support')).not.toBeInTheDocument()
  })
})
