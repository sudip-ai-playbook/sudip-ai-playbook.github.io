import { useContext } from 'react'
import { ProjectContext, type ProjectContextValue } from './projectContext.shared'

export function useProject(): ProjectContextValue {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider')
  }
  return context
}
