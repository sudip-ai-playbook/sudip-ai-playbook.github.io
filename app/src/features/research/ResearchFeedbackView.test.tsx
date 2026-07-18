import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ResearchFeedbackView } from './ResearchFeedbackView'
import { FEEDBACK_STORAGE_KEY } from './feedback.logic'

describe('ResearchFeedbackView', () => {
  it('captures a session note and lists it', async () => {
    const user = userEvent.setup()
    localStorage.removeItem(FEEDBACK_STORAGE_KEY)
    render(
      <MemoryRouter>
        <ResearchFeedbackView />
      </MemoryRouter>,
    )

    await user.type(screen.getByTestId('feedback-blockers'), 'Unclear next step after Map')
    await user.click(screen.getByTestId('feedback-submit'))
    expect(screen.getByTestId('feedback-list')).toHaveTextContent('Unclear next step after Map')
  })

  it('shows validation error when blockers are too short', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <ResearchFeedbackView />
      </MemoryRouter>,
    )
    await user.type(screen.getByTestId('feedback-blockers'), 'no')
    await user.click(screen.getByTestId('feedback-submit'))
    expect(screen.getByTestId('feedback-error')).toBeInTheDocument()
  })
})
