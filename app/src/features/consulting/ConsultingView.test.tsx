import { describe, expect, it, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConsultingView } from './ConsultingView'
import * as exportModule from './consulting.export'

describe('ConsultingView', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('filters by lifecycle stage and situation', async () => {
    const user = userEvent.setup()
    render(<ConsultingView />)

    expect(screen.getByTestId('consulting-view')).toBeInTheDocument()
    expect(screen.getByTestId('consulting-result-count')).toHaveTextContent('Showing 20 of 20')

    await user.selectOptions(screen.getByTestId('consulting-stage-filter'), 'stage-6')
    expect(screen.getByTestId('consulting-result-count')).toHaveTextContent('Showing 1 of 20')
    expect(screen.getByTestId('consulting-stage-stage-6')).toBeInTheDocument()

    await user.selectOptions(screen.getByTestId('consulting-situation'), 'ai-maturity')
    expect(screen.getByTestId('consulting-result-count')).toHaveTextContent('Showing 0 of 20')

    await user.click(screen.getByTestId('consulting-clear-filters'))
    expect(screen.getByTestId('consulting-result-count')).toHaveTextContent('Showing 20 of 20')
  })

  it('searches frameworks and downloads filtered exports', async () => {
    const user = userEvent.setup()
    const downloadSpy = vi.spyOn(exportModule, 'downloadTextFile').mockImplementation(() => undefined)
    render(<ConsultingView />)

    await user.type(screen.getByTestId('consulting-search'), 'ADKAR')
    expect(screen.getByTestId('consulting-stage-stage-13')).toBeInTheDocument()

    await user.click(screen.getByTestId('consulting-download-html'))
    await user.click(screen.getByTestId('consulting-download-excel'))

    expect(downloadSpy).toHaveBeenCalledTimes(2)
    expect(downloadSpy.mock.calls[0]?.[0]).toContain('.html')
    expect(downloadSpy.mock.calls[1]?.[0]).toContain('.xls')
  })

  it('selects a stage from the journey rail', async () => {
    const user = userEvent.setup()
    render(<ConsultingView />)
    await user.click(screen.getByTestId('consulting-rail-stage-0'))
    expect(screen.getByTestId('consulting-stage-filter')).toHaveValue('stage-0')
    expect(screen.getByTestId('consulting-stage-stage-0')).toBeInTheDocument()
  })
})
