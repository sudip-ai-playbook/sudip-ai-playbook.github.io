import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HubView } from './HubView'
import { ProjectProvider } from '../journey/ProjectProvider'
import { BLOG_BASE_PATH, BLOG_FEATURED_LINKS } from '../../constants/playbook'

function renderHub() {
  return render(
    <MemoryRouter>
      <ProjectProvider>
        <HubView />
      </ProjectProvider>
    </MemoryRouter>,
  )
}

describe('HubView blog entry points', () => {
  it('links to the playbook blog path and featured posts', () => {
    renderHub()

    const openBlog = screen.getByTestId('open-blog')
    expect(openBlog).toHaveAttribute('href', BLOG_BASE_PATH)

    const planeBlog = screen.getByTestId('plane-blog')
    expect(planeBlog).toHaveAttribute('href', BLOG_BASE_PATH)
    expect(planeBlog).toHaveTextContent('Playbook Blog')

    expect(screen.getByTestId('hub-blog-featured')).toBeInTheDocument()
    expect(screen.getByTestId('hub-blog-all')).toHaveAttribute('href', BLOG_BASE_PATH)

    for (const post of BLOG_FEATURED_LINKS) {
      const slug = post.href.split('/').filter(Boolean).pop()
      expect(screen.getByTestId(`hub-blog-${slug}`)).toHaveAttribute('href', post.href)
    }
  })
})
