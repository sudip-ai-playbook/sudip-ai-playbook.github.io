import { describe, expect, it } from 'vitest'
import {
  buildDecisionBrief,
  createStackItem,
  isFrameComplete,
  loadProject,
  saveProject,
  clearProjectStorage,
  EMPTY_PROJECT,
} from './project.logic'

describe('project.logic', () => {
  it('requires a meaningful outcome before frame is complete', () => {
    expect(isFrameComplete(EMPTY_PROJECT)).toBe(false)
    expect(isFrameComplete({ ...EMPTY_PROJECT, outcome: 'short' })).toBe(false)
    expect(
      isFrameComplete({
        ...EMPTY_PROJECT,
        outcome: 'Grounded GenAI assistant for claims',
      }),
    ).toBe(true)
  })

  it('persists and loads project state', () => {
    clearProjectStorage()
    const project = {
      ...EMPTY_PROJECT,
      outcome: 'Enterprise RAG assistant',
      stack: [
        createStackItem({
          layer: '07 AI',
          capability: 'RAG',
          provider: 'azure',
          service: 'Azure AI Search',
          source: 'compare',
        }),
      ],
    }
    saveProject(project)
    const loaded = loadProject()
    expect(loaded.outcome).toBe('Enterprise RAG assistant')
    expect(loaded.stack).toHaveLength(1)
  })

  it('builds a markdown decision brief', () => {
    const brief = buildDecisionBrief({
      ...EMPTY_PROJECT,
      outcome: 'Claims copilot',
      ecosystem: 'Azure-centric',
      preferredProvider: 'azure',
      stack: [
        createStackItem({
          layer: '07 AI',
          capability: 'Managed knowledge bases for RAG',
          provider: 'azure',
          service: 'Azure AI Search',
          source: 'decide',
        }),
      ],
    })
    expect(brief).toContain('# Architecture decision brief')
    expect(brief).toContain('Claims copilot')
    expect(brief).toContain('Azure AI Search')
  })
})
