import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HubView } from './HubView'
import { ProjectProvider } from '../journey/ProjectProvider'
import { BLOG_BASE_PATH } from '../../constants/playbook'

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
  it('links to the playbook blog path', () => {
    renderHub()

    const openBlog = screen.getByTestId('open-blog')
    expect(openBlog).toHaveAttribute('href', BLOG_BASE_PATH)

    const planeBlog = screen.getByTestId('plane-blog')
    expect(planeBlog).toHaveAttribute('href', BLOG_BASE_PATH)
    expect(planeBlog).toHaveTextContent('Playbook Blog')
  })
})
