import { useState } from 'react'
import { Shield } from 'lucide-react'
import { createRegisterId, type EngagementState } from '../engagement.logic'
import { canEditEngagement, type ConsultPersona } from '../roles/roles.logic'

interface GovernanceRiskCentreViewProps {
  engagement: EngagementState
  persona: ConsultPersona
  onEngagementChange: (engagement: EngagementState) => void
}

export function GovernanceRiskCentreView({
  engagement,
  persona,
  onEngagementChange,
}: GovernanceRiskCentreViewProps) {
  const editable = canEditEngagement(persona)
  const [inventoryName, setInventoryName] = useState('')
  const [inventoryOwner, setInventoryOwner] = useState('')
  const [riskClass, setRiskClass] = useState('medium')
  const [assessmentTitle, setAssessmentTitle] = useState('')
  const [exceptionText, setExceptionText] = useState('')

  function handleAddInventory(): void {
    if (!editable || !inventoryName.trim()) return
    onEngagementChange({
      ...engagement,
      governance: {
        ...engagement.governance,
        aiInventory: [
          ...engagement.governance.aiInventory,
          {
            id: createRegisterId('ai'),
            name: inventoryName,
            owner: inventoryOwner,
            riskClass,
          },
        ],
      },
    })
    setInventoryName('')
    setInventoryOwner('')
  }

  function handleAddAssessment(): void {
    if (!editable || !assessmentTitle.trim()) return
    onEngagementChange({
      ...engagement,
      governance: {
        ...engagement.governance,
        assessments: [
          ...engagement.governance.assessments,
          { id: createRegisterId('assess'), title: assessmentTitle, status: 'draft' },
        ],
      },
    })
    setAssessmentTitle('')
  }

  function handleAddException(): void {
    if (!editable || !exceptionText.trim()) return
    onEngagementChange({
      ...engagement,
      governance: {
        ...engagement.governance,
        exceptions: [
          ...engagement.governance.exceptions,
          {
            id: createRegisterId('exc'),
            text: exceptionText,
            owner: inventoryOwner || 'TBD',
            status: 'open',
          },
        ],
      },
    })
    setExceptionText('')
  }

  return (
    <div className="space-y-6" data-testid="governance-centre-view">
      <header className="space-y-2">
        <h2 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-2xl font-700">
          <Shield className="h-5 w-5 text-slate-blue" />
          Governance and risk centre
        </h2>
        <p className="text-sm text-ink-secondary">
          AI inventory, policies, controls, assessments and exceptions. Risks sync from Control.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="glass-panel space-y-3 p-5" data-testid="governance-inventory">
          <h3 className="font-bold">AI inventory</h3>
          <ul className="space-y-1 text-sm">
            {engagement.governance.aiInventory.map((item) => (
              <li key={item.id}>
                {item.name} · {item.owner} · risk {item.riskClass}
              </li>
            ))}
          </ul>
          {editable ? (
            <div className="space-y-2">
              <input className="field-input" data-testid="governance-inventory-name" placeholder="System / use case" value={inventoryName} onChange={(event) => setInventoryName(event.target.value)} />
              <input className="field-input" data-testid="governance-inventory-owner" placeholder="Owner" value={inventoryOwner} onChange={(event) => setInventoryOwner(event.target.value)} />
              <select className="field-input" data-testid="governance-inventory-risk" value={riskClass} onChange={(event) => setRiskClass(event.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button type="button" className="btn btn-accent" data-testid="governance-add-inventory" onClick={handleAddInventory}>
                Add inventory item
              </button>
            </div>
          ) : null}
        </div>

        <div className="glass-panel space-y-3 p-5" data-testid="governance-policies">
          <h3 className="font-bold">Policy and control library</h3>
          <ul className="space-y-1 text-sm">
            {engagement.governance.policies.map((item) => (
              <li key={item.id}>Policy: {item.title} ({item.status})</li>
            ))}
            {engagement.governance.controls.map((item) => (
              <li key={item.id}>Control: {item.title} ({item.status})</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="glass-panel space-y-3 p-5" data-testid="governance-assessments">
          <h3 className="font-bold">Impact assessments</h3>
          <ul className="space-y-1 text-sm">
            {engagement.governance.assessments.map((item) => (
              <li key={item.id}>{item.title} · {item.status}</li>
            ))}
          </ul>
          {editable ? (
            <div className="flex gap-2">
              <input className="field-input" data-testid="governance-assessment-title" placeholder="Assessment title" value={assessmentTitle} onChange={(event) => setAssessmentTitle(event.target.value)} />
              <button type="button" className="btn btn-ghost" data-testid="governance-add-assessment" onClick={handleAddAssessment}>
                Add
              </button>
            </div>
          ) : null}
        </div>

        <div className="glass-panel space-y-3 p-5" data-testid="governance-risks">
          <h3 className="font-bold">Risk register</h3>
          <ul className="space-y-1 text-sm">
            {engagement.registers.risks.length === 0 ? (
              <li className="text-ink-muted">No risks — add in Control.</li>
            ) : (
              engagement.registers.risks.map((risk) => (
                <li key={risk.id}>
                  [{risk.severity}] {risk.text} · {risk.owner || 'No owner'}
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      <section className="glass-panel space-y-3 p-5" data-testid="governance-exceptions">
        <h3 className="font-bold">Exceptions</h3>
        <ul className="space-y-1 text-sm">
          {engagement.governance.exceptions.map((item) => (
            <li key={item.id}>{item.text} · {item.owner} · {item.status}</li>
          ))}
        </ul>
        {editable ? (
          <div className="flex gap-2">
            <input className="field-input" data-testid="governance-exception-text" placeholder="Exception" value={exceptionText} onChange={(event) => setExceptionText(event.target.value)} />
            <button type="button" className="btn btn-ghost" data-testid="governance-add-exception" onClick={handleAddException}>
              Add exception
            </button>
          </div>
        ) : null}
      </section>
    </div>
  )
}
