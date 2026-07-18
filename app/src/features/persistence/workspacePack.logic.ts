import { PROJECT_STORAGE_KEY } from '../../constants/journey'
import { WORKSPACE_STORAGE_KEY } from '../consulting/workspace/workspace.logic'
import type { PlaybookProject } from '../journey/project.logic'
import { normalizeLoadedProject } from '../journey/project.logic'

export const WORKSPACE_PACK_KIND = 'sudip-ai-playbook-workspace-pack' as const
export const WORKSPACE_PACK_VERSION = 1 as const

export type WorkspacePack = {
  kind: typeof WORKSPACE_PACK_KIND
  version: typeof WORKSPACE_PACK_VERSION
  exportedAt: string
  project: PlaybookProject
  consultingWorkspace: unknown | null
}

export type WorkspacePackParseResult =
  | { ok: true; pack: WorkspacePack }
  | { ok: false; error: string }

export function buildWorkspacePack(input: {
  project: PlaybookProject
  consultingWorkspace: unknown | null
}): WorkspacePack {
  return {
    kind: WORKSPACE_PACK_KIND,
    version: WORKSPACE_PACK_VERSION,
    exportedAt: new Date().toISOString(),
    project: input.project,
    consultingWorkspace: input.consultingWorkspace,
  }
}

export function serializeWorkspacePack(pack: WorkspacePack): string {
  return `${JSON.stringify(pack, null, 2)}\n`
}

export function parseWorkspacePack(raw: string): WorkspacePackParseResult {
  try {
    const parsed = JSON.parse(raw) as Partial<WorkspacePack>
    if (parsed.kind !== WORKSPACE_PACK_KIND) {
      return { ok: false, error: 'This file is not a playbook workspace pack.' }
    }
    if (parsed.version !== WORKSPACE_PACK_VERSION) {
      return { ok: false, error: `Unsupported pack version: ${String(parsed.version)}.` }
    }
    if (!parsed.project || typeof parsed.project !== 'object') {
      return { ok: false, error: 'Pack is missing architecture project data.' }
    }
    return {
      ok: true,
      pack: {
        kind: WORKSPACE_PACK_KIND,
        version: WORKSPACE_PACK_VERSION,
        exportedAt: typeof parsed.exportedAt === 'string' ? parsed.exportedAt : new Date().toISOString(),
        project: normalizeLoadedProject(parsed.project as PlaybookProject),
        consultingWorkspace: parsed.consultingWorkspace ?? null,
      },
    }
  } catch {
    return { ok: false, error: 'Could not read the workspace pack. Use a valid JSON export.' }
  }
}

export function readConsultingWorkspaceRaw(): unknown | null {
  try {
    const raw = localStorage.getItem(WORKSPACE_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as unknown
  } catch {
    return null
  }
}

export function writeConsultingWorkspaceRaw(value: unknown | null): void {
  if (value === null) {
    localStorage.removeItem(WORKSPACE_STORAGE_KEY)
    return
  }
  localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(value))
}

export function downloadWorkspacePack(pack: WorkspacePack): void {
  const blob = new Blob([serializeWorkspacePack(pack)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `playbook-workspace-${pack.exportedAt.slice(0, 10)}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}

export function applyWorkspacePack(pack: WorkspacePack): PlaybookProject {
  localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(pack.project))
  writeConsultingWorkspaceRaw(pack.consultingWorkspace)
  return pack.project
}
