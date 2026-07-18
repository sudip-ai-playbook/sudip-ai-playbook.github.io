import { useMemo, useState } from 'react'
import {
  LLM_MODELS,
  LLM_SOURCE_LINKS,
  getAlternatives,
  sortModelsByBlendedCost,
  type CloudProvider,
  type LlmModel,
} from '../../data/llmPricing'
import { estimateTokenCost, monthlyCostFromDaily } from '../decide/decide.logic'
import { StepNav } from '../journey/StepNav'

const PROVIDER_FILTERS: Array<{ id: CloudProvider | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'azure', label: 'Azure' },
  { id: 'aws', label: 'AWS Bedrock' },
  { id: 'gcp', label: 'Google Cloud' },
]

const TIER_FILTERS = ['all', 'flagship', 'balanced', 'efficient', 'reasoning'] as const

function providerBadgeClass(provider: CloudProvider): string {
  if (provider === 'azure') return 'provider-azure'
  if (provider === 'aws') return 'provider-aws'
  return 'provider-gcp'
}

export function FinOpsView() {
  const [providerFilter, setProviderFilter] = useState<CloudProvider | 'all'>('all')
  const [tierFilter, setTierFilter] = useState<(typeof TIER_FILTERS)[number]>('all')
  const [selectedId, setSelectedId] = useState(LLM_MODELS[0]?.id)
  const [inputTokens, setInputTokens] = useState(8_000)
  const [outputTokens, setOutputTokens] = useState(1_500)
  const [dailyRequests, setDailyRequests] = useState(10_000)

  const filtered = useMemo(() => {
    const models = LLM_MODELS.filter((model) => {
      if (providerFilter !== 'all' && model.provider !== providerFilter) return false
      if (tierFilter !== 'all' && model.tier !== tierFilter) return false
      return true
    })
    return sortModelsByBlendedCost(models)
  }, [providerFilter, tierFilter])

  const selected: LlmModel | undefined =
    filtered.find((model) => model.id === selectedId) ?? filtered[0]

  const alternatives = selected ? getAlternatives(selected) : []

  const costPerRequest = selected
    ? estimateTokenCost(
        inputTokens,
        outputTokens,
        selected.inputPerMillion,
        selected.outputPerMillion,
      )
    : 0

  const monthly = monthlyCostFromDaily(dailyRequests, costPerRequest)

  function handleProviderFilter(provider: CloudProvider | 'all'): void {
    setProviderFilter(provider)
  }

  function handleTierFilter(event: React.ChangeEvent<HTMLSelectElement>): void {
    setTierFilter(event.target.value as (typeof TIER_FILTERS)[number])
  }

  function handleSelect(modelId: string): void {
    setSelectedId(modelId)
  }

  function handleInputTokens(event: React.ChangeEvent<HTMLInputElement>): void {
    setInputTokens(Number(event.target.value))
  }

  function handleOutputTokens(event: React.ChangeEvent<HTMLInputElement>): void {
    setOutputTokens(Number(event.target.value))
  }

  function handleDailyRequests(event: React.ChangeEvent<HTMLInputElement>): void {
    setDailyRequests(Number(event.target.value))
  }

  return (
    <div data-testid="finops-view" className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-blue">Step 6 · FinOps</p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-600 tracking-[0.02em]">LLM FinOps</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Compare models, alternatives, and token economics across clouds.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          {LLM_SOURCE_LINKS.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-slate-blue underline-offset-2 hover:underline"
            >
              {link.label}
            </a>
          ))}
        </div>
      </header>

      <div className="glass-panel flex flex-wrap gap-2 p-3">
        {PROVIDER_FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            data-testid={`finops-provider-${filter.id}`}
            onClick={() => handleProviderFilter(filter.id)}
            className={[
              'rounded-lg px-3 py-1.5 text-xs font-semibold',
              providerFilter === filter.id
                ? 'bg-ink text-surface-soft'
                : 'bg-white/70 text-ink-secondary',
            ].join(' ')}
          >
            {filter.label}
          </button>
        ))}
        <select
          data-testid="finops-tier"
          className="field-input ml-auto max-w-[160px] py-1.5 text-xs"
          value={tierFilter}
          onChange={handleTierFilter}
        >
          {TIER_FILTERS.map((tier) => (
            <option key={tier} value={tier}>
              {tier === 'all' ? 'All tiers' : tier}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
        <div className="glass-panel max-h-[70vh] overflow-y-auto p-2" data-testid="finops-list">
          {filtered.map((model) => {
            const isActive = model.id === selected?.id
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => handleSelect(model.id)}
                className={[
                  'mb-1 w-full rounded-xl px-3 py-3 text-left',
                  isActive ? 'bg-slate-blue/15' : 'hover:bg-white/70',
                ].join(' ')}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold">{model.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${providerBadgeClass(model.provider)}`}>
                    {model.provider.toUpperCase()}
                  </span>
                </div>
                <p className="mt-1 text-xs text-ink-muted">
                  ${model.inputPerMillion} / ${model.outputPerMillion} per 1M
                </p>
              </button>
            )
          })}
        </div>

        {selected ? (
          <div className="glass-panel space-y-5 p-6" data-testid="finops-detail">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-700">{selected.name}</h2>
              <p className="mt-1 text-sm text-ink-muted">
                {selected.platform} · {selected.family} · {selected.tier}
              </p>
              <p className="mt-3 text-sm text-ink-secondary">{selected.strengths}</p>
              {selected.notes ? (
                <p className="mt-2 text-xs text-tiger-orange">{selected.notes}</p>
              ) : null}
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-white/70 p-3">
                <p className="text-[10px] font-semibold uppercase text-ink-muted">Input</p>
                <p className="text-lg font-bold">${selected.inputPerMillion}</p>
              </div>
              <div className="rounded-xl bg-white/70 p-3">
                <p className="text-[10px] font-semibold uppercase text-ink-muted">Output</p>
                <p className="text-lg font-bold">${selected.outputPerMillion}</p>
              </div>
              <div className="rounded-xl bg-white/70 p-3">
                <p className="text-[10px] font-semibold uppercase text-ink-muted">Context</p>
                <p className="text-lg font-bold">{selected.contextWindow}</p>
              </div>
            </div>

            <div className="space-y-3 rounded-xl bg-white/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Cost estimator
              </p>
              <label className="block text-xs font-semibold text-ink-muted">
                Input tokens / request
                <input
                  data-testid="finops-input-tokens"
                  type="number"
                  min={1}
                  className="field-input mt-1"
                  value={inputTokens}
                  onChange={handleInputTokens}
                />
              </label>
              <label className="block text-xs font-semibold text-ink-muted">
                Output tokens / request
                <input
                  data-testid="finops-output-tokens"
                  type="number"
                  min={1}
                  className="field-input mt-1"
                  value={outputTokens}
                  onChange={handleOutputTokens}
                />
              </label>
              <label className="block text-xs font-semibold text-ink-muted">
                Requests / day
                <input
                  data-testid="finops-daily"
                  type="number"
                  min={1}
                  className="field-input mt-1"
                  value={dailyRequests}
                  onChange={handleDailyRequests}
                />
              </label>
              <div className="flex justify-between border-t border-slate-blue/10 pt-3 text-sm">
                <span>Per request</span>
                <strong data-testid="finops-per-request">${costPerRequest.toFixed(4)}</strong>
              </div>
              <div className="flex justify-between text-sm">
                <span>Est. monthly</span>
                <strong data-testid="finops-monthly">${monthly.toLocaleString()}</strong>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Alternatives</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {alternatives.map((alternative) => (
                  <button
                    key={alternative.id}
                    type="button"
                    onClick={() => handleSelect(alternative.id)}
                    className="rounded-xl border border-slate-blue/15 bg-white/70 p-3 text-left"
                  >
                    <p className="text-sm font-bold">{alternative.name}</p>
                    <p className="text-xs text-ink-muted">
                      ${alternative.inputPerMillion} / ${alternative.outputPerMillion}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <a
              href={selected.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex text-xs font-semibold text-slate-blue"
            >
              Verify on provider pricing page →
            </a>
          </div>
        ) : null}
      </div>

      <p className="text-xs text-ink-muted">
        Snapshot rates for FinOps comparison. Always verify live regional pricing before commitment.
      </p>

      <StepNav path="/finops" nextHint="Next: assemble the stack" />
    </div>
  )
}
