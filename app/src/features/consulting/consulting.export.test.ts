import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { CONSULTING_STAGES } from '../../data/consultingOs'
import {
  buildConsultingExcelXml,
  buildConsultingHtml,
  downloadTextFile,
} from './consulting.export'

describe('consulting.export', () => {
  beforeEach(() => {
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:mock'),
      revokeObjectURL: vi.fn(),
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('builds shareable HTML with stage content', () => {
    const html = buildConsultingHtml(CONSULTING_STAGES.slice(0, 1))
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('Account and Opportunity Qualification')
    expect(html).toContain('Pursuit Gate')
    expect(html).not.toContain('<script>')
  })

  it('escapes HTML in stage content', () => {
    const html = buildConsultingHtml([
      {
        ...CONSULTING_STAGES[0],
        title: 'A <script>alert(1)</script> Stage',
        purpose: 'Use & verify "quotes"',
      },
    ])
    expect(html).toContain('A &lt;script&gt;alert(1)&lt;/script&gt; Stage')
    expect(html).toContain('Use &amp; verify &quot;quotes&quot;')
  })

  it('builds Excel XML with headers and stage rows', () => {
    const xml = buildConsultingExcelXml(CONSULTING_STAGES.slice(0, 2))
    expect(xml).toContain('Excel.Sheet')
    expect(xml).toContain('Stage Number')
    expect(xml).toContain('First Client Meeting and Executive Introduction')
  })

  it('downloads a text file via blob URL', () => {
    const click = vi.fn()
    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      click,
    } as unknown as HTMLAnchorElement)

    downloadTextFile('playbook.html', '<html></html>', 'text/html;charset=utf-8')

    expect(URL.createObjectURL).toHaveBeenCalled()
    expect(click).toHaveBeenCalled()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock')
    createElementSpy.mockRestore()
  })
})
