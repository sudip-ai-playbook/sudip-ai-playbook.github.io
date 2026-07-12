import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { PLAYBOOK_PASSWORD } from './constants/playbook'

describe('App gate', () => {
  it('shows password gate until unlocked', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByTestId('password-gate')).toBeInTheDocument()
    await user.type(screen.getByTestId('password-input'), 'wrong')
    await user.click(screen.getByTestId('password-submit'))
    expect(screen.getByTestId('password-error')).toHaveTextContent('Incorrect password')

    await user.clear(screen.getByTestId('password-input'))
    await user.type(screen.getByTestId('password-input'), PLAYBOOK_PASSWORD)
    await user.click(screen.getByTestId('password-submit'))
    expect(await screen.findByTestId('hub-view')).toBeInTheDocument()
  })
})
