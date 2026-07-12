import { useEffect, useState, type ChangeEvent } from 'react'
import { Download, Play, Plus, Trash2 } from 'lucide-react'
import { CONSULTING_STAGES } from '../../data/consultingOs'
import type { MvpFramework } from '../../data/frameworkLibrary'
import { downloadTextFile } from './consulting.export'
import {
  isSpecializedCanvas,
  resolveFrameworkForWork,
  resolveStageFrameworkNames,
} from './framework.logic'
import { FrameworkCanvas } from './FrameworkCanvas'
import { FrameworkDetailPanel } from './FrameworkDetailPanel'
import {
  buildWorkshopExcelXml,
  buildWorkshopHtml,
  buildWorkshopMarkdown,
  workshopPackStem,
} from './workshop.export'
import {
  clearWorkshop,
  createRegisterId,
  isUseCaseReady,
  loadWorkshop,
  saveWorkshop,
  startWorkshopForStage,
  addAgendaItem,
  removeAgendaItem,
  addQuestionItem,
  removeQuestionItem,
  setVotingQuestion,
  addVoteOption,
  castVote,
  tallyVotes,
  type FrameworkOutput,
  type UseCaseCard,
  type WorkshopSession,
} from './workshop.logic'

interface WorkshopStudioProps {
  stageId: string | null
  onRequestStage?: (stageId: string) => void
}

const USE_CASE_FIELDS: Array<{ key: keyof UseCaseCard; label: string; multiline?: boolean }> = [
  { key: 'name', label: 'Use case name' },
  { key: 'businessProblem', label: 'Business problem', multiline: true },
  { key: 'targetUsers', label: 'Target users' },
  { key: 'currentProcess', label: 'Current process' },
  { key: 'desiredOutcome', label: 'Desired outcome', multiline: true },
  { key: 'dataAvailable', label: 'Data available', multiline: true },
  { key: 'constraints', label: 'Constraints', multiline: true },
  { key: 'baselineKpi', label: 'Baseline KPI' },
  { key: 'owner', label: 'Business owner' },
]

export function WorkshopStudio({ stageId, onRequestStage }: WorkshopStudioProps) {
  const [session, setSession] = useState<WorkshopSession | null>(() => loadWorkshop())
  const [detailId, setDetailId] = useState<string | null>(null)
  const [runningId, setRunningId] = useState<string | null>(null)
  const [decisionText, setDecisionText] = useState('')
  const [decisionOwner, setDecisionOwner] = useState('')
  const [actionText, setActionText] = useState('')
  const [actionOwner, setActionOwner] = useState('')
  const [actionDue, setActionDue] = useState('')
  const [agendaDraft, setAgendaDraft] = useState('')
  const [questionDraft, setQuestionDraft] = useState('')
  const [voteOptionDraft, setVoteOptionDraft] = useState('')
  const [voterName, setVoterName] = useState('')

  useEffect(() => {
    if (!stageId) return
    setSession(startWorkshopForStage(stageId))
    setDetailId(null)
    setRunningId(null)
  }, [stageId])

  const stage = session
    ? CONSULTING_STAGES.find((item) => item.id === session.stageId)
    : undefined
  const stageFrameworks = stage ? resolveStageFrameworkNames(stage.frameworks) : []
  const detail = detailId ? resolveFrameworkForWork(detailId) : undefined
  const running = runningId ? resolveFrameworkForWork(runningId) : undefined
  const useCaseReady = session ? isUseCaseReady(session.useCase) : false

  function persist(next: WorkshopSession): void {
    setSession(saveWorkshop(next))
  }

  function handleStartFromSelect(event: ChangeEvent<HTMLSelectElement>): void {
    const value = event.target.value
    if (!value) return
    onRequestStage?.(value)
    setSession(startWorkshopForStage(value))
  }

  function handleParticipants(event: ChangeEvent<HTMLTextAreaElement>): void {
    if (!session) return
    persist({ ...session, participants: event.target.value })
  }

  function handleNotes(event: ChangeEvent<HTMLTextAreaElement>): void {
    if (!session) return
    persist({ ...session, notes: event.target.value })
  }

  function handleUseCaseField(key: keyof UseCaseCard) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!session) return
      persist({
        ...session,
        useCase: { ...session.useCase, [key]: event.target.value },
      })
    }
  }

  function handleOpenFramework(nameOrId: string): void {
    const entry = resolveFrameworkForWork(nameOrId)
    setDetailId(entry.id)
    setRunningId(null)
  }

  function handleRunCanvas(): void {
    if (detail) {
      setRunningId(detail.id)
    }
  }

  function handleSaveOutput(output: Omit<FrameworkOutput, 'savedAt'>): void {
    if (!session) return
    const saved: FrameworkOutput = { ...output, savedAt: new Date().toISOString() }
    persist({
      ...session,
      frameworkOutputs: {
        ...session.frameworkOutputs,
        [output.frameworkId]: saved,
      },
    })
    setRunningId(null)
    setDetailId(null)
  }

  function handleAddDecision(): void {
    if (!session || !decisionText.trim()) return
    persist({
      ...session,
      decisions: [
        ...session.decisions,
        {
          id: createRegisterId('decision'),
          text: decisionText.trim(),
          owner: decisionOwner.trim(),
          date: new Date().toISOString().slice(0, 10),
        },
      ],
    })
    setDecisionText('')
    setDecisionOwner('')
  }

  function handleAddAction(): void {
    if (!session || !actionText.trim()) return
    persist({
      ...session,
      actions: [
        ...session.actions,
        {
          id: createRegisterId('action'),
          text: actionText.trim(),
          owner: actionOwner.trim(),
          due: actionDue.trim(),
        },
      ],
    })
    setActionText('')
    setActionOwner('')
    setActionDue('')
  }

  function handleClear(): void {
    clearWorkshop()
    setSession(null)
    setDetailId(null)
    setRunningId(null)
  }

  function handleExportPack(): void {
    if (!session) return
    const stem = workshopPackStem(session)
    downloadTextFile(`${stem}.html`, buildWorkshopHtml(session), 'text/html;charset=utf-8')
    downloadTextFile(
      `${stem}.xls`,
      buildWorkshopExcelXml(session),
      'application/vnd.ms-excel;charset=utf-8',
    )
    downloadTextFile(
      `${stem}.md`,
      buildWorkshopMarkdown(session),
      'text/markdown;charset=utf-8',
    )
  }

  if (!session) {
    return (
      <div className="glass-panel space-y-4 p-6" data-testid="workshop-studio-empty">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-700">
          Workshop Studio
        </h2>
        <p className="text-sm text-ink-secondary">
          Pick a consulting stage, define your use case, then run frameworks against it.
        </p>
        <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Start workshop for stage
          <select
            data-testid="workshop-start-stage"
            className="field-input mt-2"
            defaultValue=""
            onChange={handleStartFromSelect}
          >
            <option value="" disabled>
              Select stage…
            </option>
            {CONSULTING_STAGES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.number}. {item.shortLabel} — {item.title}
              </option>
            ))}
          </select>
        </label>
      </div>
    )
  }

  if (running) {
    return (
      <FrameworkCanvas
        framework={running as MvpFramework}
        useCase={session.useCase}
        initialFields={session.frameworkOutputs[running.id]?.fields}
        onSave={handleSaveOutput}
        onCancel={() => setRunningId(null)}
      />
    )
  }

  return (
    <div className="space-y-4" data-testid="workshop-studio">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-blue">
            Workshop Studio
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-700">
            {session.title}
          </h2>
          {stage ? (
            <p className="mt-1 text-sm text-ink-secondary">
              Gate: {stage.gate} · {Object.keys(session.frameworkOutputs).length} framework
              outputs saved
              {useCaseReady ? ` · Use case: ${session.useCase.name}` : ' · Define use case below'}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-accent"
            data-testid="workshop-export-pack"
            onClick={handleExportPack}
          >
            <Download className="h-4 w-4" />
            Export workshop pack
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            data-testid="workshop-clear"
            onClick={handleClear}
          >
            <Trash2 className="h-4 w-4" />
            Clear session
          </button>
        </div>
      </header>

      <section className="glass-panel space-y-3 p-5" data-testid="workshop-use-case">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold">Your use case</h3>
          <span
            className={[
              'rounded-full px-3 py-1 text-xs font-bold',
              useCaseReady
                ? 'bg-slate-blue/15 text-indigo-velvet'
                : 'bg-amber-flame/15 text-tiger-orange',
            ].join(' ')}
            data-testid="workshop-use-case-status"
          >
            {useCaseReady ? 'Ready for frameworks' : 'Required before canvases pre-fill'}
          </span>
        </div>
        <p className="text-sm text-ink-secondary">
          Enter the use case once. Every framework canvas will pre-fill from this card so you can
          work the same opportunity end to end.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {USE_CASE_FIELDS.map((field) => (
            <label
              key={field.key}
              className={`block text-xs font-semibold uppercase tracking-wider text-ink-muted ${field.multiline ? 'md:col-span-2' : ''}`}
            >
              {field.label}
              {field.multiline ? (
                <textarea
                  data-testid={`workshop-usecase-${field.key}`}
                  className="field-input mt-2 min-h-20"
                  value={session.useCase[field.key]}
                  onChange={handleUseCaseField(field.key)}
                />
              ) : (
                <input
                  data-testid={`workshop-usecase-${field.key}`}
                  className="field-input mt-2"
                  value={session.useCase[field.key]}
                  onChange={handleUseCaseField(field.key)}
                />
              )}
            </label>
          ))}
        </div>
      </section>

      {detail ? (
        <FrameworkDetailPanel
          framework={detail}
          onClose={() => setDetailId(null)}
          onRunCanvas={handleRunCanvas}
        />
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="glass-panel space-y-3 p-5">
          <h3 className="font-bold">Agenda</h3>
          <ul className="space-y-1 text-sm text-ink-secondary" data-testid="workshop-agenda-list">
            {session.agenda.map((item, index) => (
              <li key={`${item}-${index}`} className="flex items-start justify-between gap-2">
                <span>{item}</span>
                <button
                  type="button"
                  data-testid={`workshop-remove-agenda-${index}`}
                  onClick={() => persist(removeAgendaItem(session, index))}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <input
              className="field-input"
              data-testid="workshop-agenda-draft"
              value={agendaDraft}
              onChange={(event) => setAgendaDraft(event.target.value)}
              placeholder="Add agenda item"
            />
            <button
              type="button"
              className="btn btn-ghost"
              data-testid="workshop-add-agenda"
              onClick={() => {
                persist(addAgendaItem(session, agendaDraft))
                setAgendaDraft('')
              }}
            >
              Add
            </button>
          </div>

          <h3 className="font-bold">Question bank</h3>
          <ul className="space-y-1 text-sm" data-testid="workshop-questions-list">
            {session.questions.map((item, index) => (
              <li key={`${item}-${index}`} className="flex justify-between gap-2">
                <span>{item}</span>
                <button
                  type="button"
                  data-testid={`workshop-remove-question-${index}`}
                  onClick={() => persist(removeQuestionItem(session, index))}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <input
              className="field-input"
              data-testid="workshop-question-draft"
              value={questionDraft}
              onChange={(event) => setQuestionDraft(event.target.value)}
              placeholder="Add question"
            />
            <button
              type="button"
              className="btn btn-ghost"
              data-testid="workshop-add-question"
              onClick={() => {
                persist(addQuestionItem(session, questionDraft))
                setQuestionDraft('')
              }}
            >
              Add
            </button>
          </div>

          <label className="block text-xs font-semibold uppercase text-ink-muted">
            Participants
            <textarea
              data-testid="workshop-participants"
              className="field-input mt-2 min-h-20"
              value={session.participants}
              onChange={handleParticipants}
              placeholder="Names, roles, decision rights"
            />
          </label>
          <label className="block text-xs font-semibold uppercase text-ink-muted">
            Workshop notes
            <textarea
              data-testid="workshop-notes"
              className="field-input mt-2 min-h-28"
              value={session.notes}
              onChange={handleNotes}
              placeholder="Live capture, parking lot, contradictions…"
            />
          </label>
        </section>

        <section className="glass-panel space-y-3 p-5">
          <h3 className="font-bold">Frameworks for this stage</h3>
          <p className="text-xs text-ink-muted">
            Every chip opens a workable canvas. Specialized canvases for MVP frameworks;
            use-case workbooks for all others.
          </p>
          <div className="flex flex-wrap gap-2">
            {stageFrameworks.map((framework) => {
              const saved = Boolean(session.frameworkOutputs[framework.id])
              return (
                <button
                  key={framework.id}
                  type="button"
                  data-testid={`workshop-framework-${framework.id}`}
                  onClick={() => handleOpenFramework(framework.id)}
                  className={[
                    'rounded-lg px-2.5 py-1.5 text-xs font-semibold',
                    saved
                      ? 'bg-amber-flame/20 text-ink'
                      : 'bg-slate-blue/15 text-indigo-velvet',
                  ].join(' ')}
                >
                  <Play className="mr-1 inline h-3 w-3" />
                  {framework.name}
                  {isSpecializedCanvas(framework) ? '' : ' · workbook'}
                  {saved ? ' · saved' : ''}
                </button>
              )
            })}
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-ink-muted">Saved outputs</p>
            {Object.values(session.frameworkOutputs).length === 0 ? (
              <p className="text-sm text-ink-muted">Run a canvas to capture outputs.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {Object.values(session.frameworkOutputs).map((output) => (
                  <li key={output.frameworkId} className="rounded-xl bg-white/70 px-3 py-2">
                    <p className="font-semibold">{output.title}</p>
                    <p className="text-xs text-ink-muted">
                      {output.fields.linkedUseCase
                        ? `Use case: ${output.fields.linkedUseCase} · `
                        : ''}
                      {output.savedAt}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      <section className="glass-panel space-y-3 p-5" data-testid="workshop-voting">
        <h3 className="font-bold">Voting</h3>
        <label className="block text-xs font-semibold uppercase text-ink-muted">
          Vote question
          <input
            className="field-input mt-2"
            data-testid="workshop-vote-question"
            value={session.voting.question}
            onChange={(event) => persist(setVotingQuestion(session, event.target.value))}
            placeholder="What should we prioritise?"
          />
        </label>
        <ul className="space-y-2 text-sm">
          {tallyVotes(session).map((option) => (
            <li key={option.optionId} className="flex flex-wrap items-center gap-2">
              <span>
                {option.label} · {option.count} vote(s)
              </span>
              <button
                type="button"
                className="btn btn-ghost"
                data-testid={`workshop-cast-vote-${option.optionId}`}
                onClick={() => persist(castVote(session, option.optionId, voterName))}
              >
                Vote
              </button>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          <input
            className="field-input"
            data-testid="workshop-vote-option"
            value={voteOptionDraft}
            onChange={(event) => setVoteOptionDraft(event.target.value)}
            placeholder="Option label"
          />
          <input
            className="field-input w-40"
            data-testid="workshop-voter-name"
            value={voterName}
            onChange={(event) => setVoterName(event.target.value)}
            placeholder="Voter name"
          />
          <button
            type="button"
            className="btn btn-ghost"
            data-testid="workshop-add-vote-option"
            onClick={() => {
              persist(addVoteOption(session, voteOptionDraft))
              setVoteOptionDraft('')
            }}
          >
            Add option
          </button>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="glass-panel space-y-3 p-5">
          <h3 className="font-bold">Decisions</h3>
          <ul className="space-y-2 text-sm">
            {session.decisions.map((decision) => (
              <li key={decision.id} className="rounded-xl bg-white/70 px-3 py-2">
                {decision.text}
                <span className="mt-1 block text-xs text-ink-muted">
                  {decision.owner || 'Owner TBD'} · {decision.date}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <input
              data-testid="workshop-decision-text"
              className="field-input flex-1"
              value={decisionText}
              onChange={(event) => setDecisionText(event.target.value)}
              placeholder="Decision required / taken"
            />
            <input
              data-testid="workshop-decision-owner"
              className="field-input w-40"
              value={decisionOwner}
              onChange={(event) => setDecisionOwner(event.target.value)}
              placeholder="Owner"
            />
            <button
              type="button"
              className="btn btn-ghost"
              data-testid="workshop-add-decision"
              onClick={handleAddDecision}
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </section>

        <section className="glass-panel space-y-3 p-5">
          <h3 className="font-bold">Actions</h3>
          <ul className="space-y-2 text-sm">
            {session.actions.map((action) => (
              <li key={action.id} className="rounded-xl bg-white/70 px-3 py-2">
                {action.text}
                <span className="mt-1 block text-xs text-ink-muted">
                  {action.owner || 'Owner TBD'} · due {action.due || 'TBD'}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <input
              data-testid="workshop-action-text"
              className="field-input flex-1"
              value={actionText}
              onChange={(event) => setActionText(event.target.value)}
              placeholder="Action"
            />
            <input
              data-testid="workshop-action-owner"
              className="field-input w-32"
              value={actionOwner}
              onChange={(event) => setActionOwner(event.target.value)}
              placeholder="Owner"
            />
            <input
              data-testid="workshop-action-due"
              className="field-input w-32"
              value={actionDue}
              onChange={(event) => setActionDue(event.target.value)}
              placeholder="Due"
            />
            <button
              type="button"
              className="btn btn-ghost"
              data-testid="workshop-add-action"
              onClick={handleAddAction}
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

