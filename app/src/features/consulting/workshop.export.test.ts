import { describe, expect, it } from 'vitest'
import { createEmptyWorkshop } from './workshop.logic'
import {
  buildWorkshopExcelXml,
  buildWorkshopHtml,
  buildWorkshopMarkdown,
  workshopPackStem,
} from './workshop.export'

describe('workshop.export', () => {
  it('builds markdown, html and excel pack content', () => {
    const session = createEmptyWorkshop('stage-5')
    session.participants = 'Alex, Sam'
    session.notes = 'Focus on root causes'
    session.frameworkOutputs = {
      fiveWhys: {
        frameworkId: 'fiveWhys',
        canvasType: 'fiveWhys',
        title: 'Five Whys',
        fields: { problem: 'High AHT', why1: 'Rework', rootCause: 'Missing data' },
        savedAt: '2026-07-12T10:00:00.000Z',
      },
    }
    session.decisions = [
      { id: 'd1', text: 'Proceed to SIPOC', owner: 'Alex', date: '2026-07-12' },
    ]
    session.actions = [
      { id: 'a1', text: 'Collect baseline AHT', owner: 'Sam', due: '2026-07-15' },
    ]

    const markdown = buildWorkshopMarkdown(session)
    expect(markdown).toContain('Five Whys')
    expect(markdown).toContain('Proceed to SIPOC')
    expect(markdown).toContain('## Use case')

    const html = buildWorkshopHtml(session)
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('High AHT')
    expect(html).toContain('Use case')
    expect(html).not.toContain('<script>')

    const excel = buildWorkshopExcelXml(session)
    expect(excel).toContain('FrameworkOutputs')
    expect(excel).toContain('UseCase')
    expect(excel).toContain('Decisions')

    expect(workshopPackStem(session)).toContain('workshop-stage-5-')
  })
})
