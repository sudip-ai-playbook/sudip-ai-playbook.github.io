import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HubView } from './HubView'
import { ProjectProvider } from '../journey/ProjectProvider'
import {
  ARTICLES_PATH,
  BLOG_FEATURED_LINKS,
  GUIDE_OVERVIEW_PATH,
} from '../../constants/playbook'

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
  it('shows three primary paths and featured reading links', () => {
    renderHub()

    expect(screen.getByTestId('hub-primary-cta')).toHaveAttribute('href', '/consult')
    expect(screen.getByTestId('open-blog')).toHaveAttribute('href', GUIDE_OVERVIEW_PATH)
    expect(screen.getByTestId('path-learn')).toHaveAttribute('href', GUIDE_OVERVIEW_PATH)
    expect(screen.getByTestId('start-consulting')).toHaveAttribute('href', '/consult')
    expect(screen.getByTestId('start-journey')).toHaveAttribute('href', '/frame')

    expect(screen.getByTestId('hub-blog-featured')).toBeInTheDocument()
    expect(screen.getByTestId('hub-blog-all')).toHaveAttribute('href', ARTICLES_PATH)

    for (const post of BLOG_FEATURED_LINKS) {
      const slug = post.href.split('/').filter(Boolean).pop()
      expect(screen.getByTestId(`hub-blog-${slug}`)).toHaveAttribute('href', post.href)
    }
  })
})
