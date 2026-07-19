import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('opens the hub without a password gate and keeps support in the footer', () => {
    window.location.hash = '#/'
    render(<App />)
    expect(screen.getByTestId('hub-view')).toBeInTheDocument()
    expect(screen.queryByTestId('password-gate')).not.toBeInTheDocument()
    expect(screen.getByTestId('nav-blog')).toHaveAttribute(
      'href',
      '/blog/learning-map/overview/',
    )
    expect(screen.getByTestId('nav-notes')).toHaveAttribute('href', '/blog/notes/')
    expect(screen.getByTestId('nav-notes')).toHaveAttribute('aria-label', 'Daily Notes')
    expect(screen.getByTestId('app-footer')).toBeInTheDocument()
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
