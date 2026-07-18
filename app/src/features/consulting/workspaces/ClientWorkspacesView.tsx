import { useState, type ChangeEvent } from 'react'
import { Building2, Plus, Trash2 } from 'lucide-react'
import {
  addClient,
  addEngagementToClient,
  removeClient,
  removeEngagement,
  renameClient,
  setActiveEngagement,
  type WorkspaceStore,
} from '../workspace/workspace.logic'
import {
  addRaciRow,
  addStakeholder,
  removeRaciRow,
  removeStakeholder,
  type EngagementState,
} from '../engagement.logic'
import { canEditEngagement, type ConsultPersona } from '../roles/roles.logic'

interface ClientWorkspacesViewProps {
  store: WorkspaceStore
  engagement: EngagementState
  persona: ConsultPersona
  onStoreChange: (store: WorkspaceStore) => void
  onEngagementChange: (engagement: EngagementState) => void
}

export function ClientWorkspacesView({
  store,
  engagement,
  persona,
  onStoreChange,
  onEngagementChange,
}: ClientWorkspacesViewProps) {
  const editable = canEditEngagement(persona)
  const [clientName, setClientName] = useState('')
  const [industry, setIndustry] = useState('')
  const [geography, setGeography] = useState('')
  const [engagementName, setEngagementName] = useState('')
  const [stakeholderName, setStakeholderName] = useState('')
  const [stakeholderRole, setStakeholderRole] = useState('')
  const [raciActivity, setRaciActivity] = useState('')
  const [raciResponsible, setRaciResponsible] = useState('')
  const [raciAccountable, setRaciAccountable] = useState('')

  const activeClient = store.clients.find((client) => client.id === store.activeClientId)

  function handleAddClient(): void {
    if (!editable || !clientName.trim()) return
    onStoreChange(addClient(store, clientName, industry, geography))
    setClientName('')
    setIndustry('')
    setGeography('')
  }

  function handleAddEngagement(): void {
    if (!editable || !store.activeClientId || !engagementName.trim()) return
    onStoreChange(addEngagementToClient(store, store.activeClientId, engagementName))
    setEngagementName('')
  }

  function handleSelectEngagement(clientId: string, engagementId: string): void {
    onStoreChange(setActiveEngagement(store, clientId, engagementId))
  }

  function handleRemoveClient(clientId: string): void {
    if (!editable) return
    onStoreChange(removeClient(store, clientId))
  }

  function handleRemoveEngagement(clientId: string, engagementId: string): void {
    if (!editable) return
    onStoreChange(removeEngagement(store, clientId, engagementId))
  }

  function handleRenameActiveClient(event: ChangeEvent<HTMLInputElement>): void {
    if (!editable || !activeClient) return
    onStoreChange(
      renameClient(store, activeClient.id, event.target.value, activeClient.industry, activeClient.geography),
    )
  }

  function handleScopeIn(event: ChangeEvent<HTMLTextAreaElement>): void {
    if (!editable) return
    onEngagementChange({ ...engagement, scopeIn: event.target.value })
  }

  function handleScopeOut(event: ChangeEvent<HTMLTextAreaElement>): void {
    if (!editable) return
    onEngagementChange({ ...engagement, scopeOut: event.target.value })
  }

  function handleAddStakeholder(): void {
    if (!editable || !stakeholderName.trim()) return
    onEngagementChange(
      addStakeholder(engagement, {
        name: stakeholderName,
        role: stakeholderRole,
        interest: '',
        influence: '',
      }),
    )
    setStakeholderName('')
    setStakeholderRole('')
  }

  function handleAddRaci(): void {
    if (!editable || !raciActivity.trim()) return
    onEngagementChange(
      addRaciRow(engagement, {
        activity: raciActivity,
        responsible: raciResponsible,
        accountable: raciAccountable,
        consulted: '',
        informed: '',
      }),
    )
    setRaciActivity('')
    setRaciResponsible('')
    setRaciAccountable('')
  }

  return (
    <div className="space-y-6" data-testid="client-workspaces-view">
      <header className="space-y-2">
        <h2 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-2xl font-700">
          <Building2 className="h-5 w-5 text-slate-blue" />
          Client workspaces
        </h2>
        <p className="text-sm text-ink-secondary">
          Manage clients, engagements, scope, stakeholders and RACI for the active engagement.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="glass-panel space-y-3 p-5" data-testid="workspace-client-list">
          <h3 className="font-bold">Clients</h3>
          <ul className="space-y-2">
            {store.clients.map((client) => (
              <li key={client.id} className="rounded-xl bg-white/60 p-3" data-testid={`workspace-client-${client.id}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{client.name}</p>
                    <p className="text-xs text-ink-muted">
                      {client.industry || 'Industry TBD'} · {client.geography || 'Geography TBD'}
                    </p>
                  </div>
                  {editable ? (
                    <button
                      type="button"
                      className="btn btn-ghost"
                      data-testid={`workspace-remove-client-${client.id}`}
                      onClick={() => handleRemoveClient(client.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
                <ul className="mt-2 space-y-1">
                  {client.engagements.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        data-testid={`workspace-select-engagement-${item.id}`}
                        className={[
                          'w-full rounded-lg px-2 py-1 text-left text-sm',
                          store.activeEngagementId === item.id
                            ? 'bg-ink text-surface-soft'
                            : 'hover:bg-white',
                        ].join(' ')}
                        onClick={() => handleSelectEngagement(client.id, item.id)}
                      >
                        {item.engagementName || 'Untitled engagement'}
                      </button>
                      {editable && client.engagements.length > 1 ? (
                        <button
                          type="button"
                          className="ml-2 text-xs text-ink-muted"
                          data-testid={`workspace-remove-engagement-${item.id}`}
                          onClick={() => handleRemoveEngagement(client.id, item.id)}
                        >
                          Remove
                        </button>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          {editable ? (
            <div className="space-y-2 border-t border-white/40 pt-3">
              <input
                className="field-input"
                data-testid="workspace-new-client-name"
                placeholder="Client name"
                value={clientName}
                onChange={(event) => setClientName(event.target.value)}
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  className="field-input"
                  data-testid="workspace-new-client-industry"
                  placeholder="Industry"
                  value={industry}
                  onChange={(event) => setIndustry(event.target.value)}
                />
                <input
                  className="field-input"
                  data-testid="workspace-new-client-geography"
                  placeholder="Geography"
                  value={geography}
                  onChange={(event) => setGeography(event.target.value)}
                />
              </div>
              <button type="button" className="btn btn-accent" data-testid="workspace-add-client" onClick={handleAddClient}>
                <Plus className="h-4 w-4" />
                Add client
              </button>
              <input
                className="field-input"
                data-testid="workspace-new-engagement-name"
                placeholder="New engagement name"
                value={engagementName}
                onChange={(event) => setEngagementName(event.target.value)}
              />
              <button
                type="button"
                className="btn btn-ghost"
                data-testid="workspace-add-engagement"
                onClick={handleAddEngagement}
              >
                <Plus className="h-4 w-4" />
                Add engagement
              </button>
            </div>
          ) : null}
        </div>

        <div className="glass-panel space-y-4 p-5" data-testid="workspace-setup-panel">
          <h3 className="font-bold">Engagement setup</h3>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Client name
            <input
              className="field-input mt-2"
              data-testid="workspace-active-client-name"
              value={activeClient?.name ?? ''}
              onChange={handleRenameActiveClient}
              disabled={!editable}
            />
          </label>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Scope in
            <textarea
              className="field-input mt-2 min-h-24"
              data-testid="workspace-scope-in"
              value={engagement.scopeIn}
              onChange={handleScopeIn}
              disabled={!editable}
            />
          </label>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Scope out
            <textarea
              className="field-input mt-2 min-h-24"
              data-testid="workspace-scope-out"
              value={engagement.scopeOut}
              onChange={handleScopeOut}
              disabled={!editable}
            />
          </label>

          <div className="space-y-2" data-testid="workspace-stakeholders">
            <h4 className="text-sm font-bold">Stakeholders</h4>
            <ul className="space-y-1 text-sm">
              {engagement.stakeholders.map((item) => (
                <li key={item.id} className="flex justify-between gap-2">
                  <span>
                    {item.name} · {item.role}
                  </span>
                  {editable ? (
                    <button
                      type="button"
                      data-testid={`workspace-remove-stakeholder-${item.id}`}
                      onClick={() => onEngagementChange(removeStakeholder(engagement, item.id))}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
            {editable ? (
              <div className="flex flex-wrap gap-2">
                <input
                  className="field-input"
                  data-testid="workspace-stakeholder-name"
                  placeholder="Name"
                  value={stakeholderName}
                  onChange={(event) => setStakeholderName(event.target.value)}
                />
                <input
                  className="field-input"
                  data-testid="workspace-stakeholder-role"
                  placeholder="Role"
                  value={stakeholderRole}
                  onChange={(event) => setStakeholderRole(event.target.value)}
                />
                <button type="button" className="btn btn-ghost" data-testid="workspace-add-stakeholder" onClick={handleAddStakeholder}>
                  Add
                </button>
              </div>
            ) : null}
          </div>

          <div className="space-y-2" data-testid="workspace-raci">
            <h4 className="text-sm font-bold">RACI</h4>
            <ul className="space-y-1 text-sm">
              {engagement.raci.map((row) => (
                <li key={row.id} className="flex justify-between gap-2">
                  <span>
                    {row.activity}: R={row.responsible} A={row.accountable}
                  </span>
                  {editable ? (
                    <button
                      type="button"
                      data-testid={`workspace-remove-raci-${row.id}`}
                      onClick={() => onEngagementChange(removeRaciRow(engagement, row.id))}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
            {editable ? (
              <div className="grid gap-2 md:grid-cols-3">
                <input
                  className="field-input"
                  data-testid="workspace-raci-activity"
                  placeholder="Activity"
                  value={raciActivity}
                  onChange={(event) => setRaciActivity(event.target.value)}
                />
                <input
                  className="field-input"
                  data-testid="workspace-raci-responsible"
                  placeholder="Responsible"
                  value={raciResponsible}
                  onChange={(event) => setRaciResponsible(event.target.value)}
                />
                <input
                  className="field-input"
                  data-testid="workspace-raci-accountable"
                  placeholder="Accountable"
                  value={raciAccountable}
                  onChange={(event) => setRaciAccountable(event.target.value)}
                />
                <button type="button" className="btn btn-ghost" data-testid="workspace-add-raci" onClick={handleAddRaci}>
                  Add RACI row
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}
