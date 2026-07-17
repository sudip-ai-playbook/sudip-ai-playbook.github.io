import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('opens the hub without a password gate', () => {
    window.location.hash = '#/'
    render(<App />)
    expect(screen.getByTestId('hub-view')).toBeInTheDocument()
    expect(screen.queryByTestId('password-gate')).not.toBeInTheDocument()
    expect(screen.getByTestId('nav-blog')).toHaveAttribute('href', '/blog/')
  })
})
