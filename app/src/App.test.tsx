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
    expect(screen.getByTestId('nav-buy-me-a-coffee')).toHaveAttribute(
      'href',
      'https://www.buymeacoffee.com/kandelsudir',
    )
    expect(screen.getByTestId('nav-ko-fi')).toHaveAttribute(
      'href',
      'https://ko-fi.com/sudipkandel123',
    )
  })
})
