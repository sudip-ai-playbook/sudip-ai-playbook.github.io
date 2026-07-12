import { useMemo, useState } from 'react'
import quickPicks from '../../data/quickPicks.json'

interface QuickPick {
  scenario: string
  architectureLayer?: string
  subcategory?: string
  useWhenTrigger?: string
  awsOption?: string
  azureOption?: string
  googleCloudOption?: string
  defaultFirstChoice?: string
  chooseAwsWhen?: string
  chooseAzureWhen?: string
  chooseGoogleCloudWhen?: string
  complexityCaution?: string
}

const picks = quickPicks as QuickPick[]

export function QuickPicksView() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(picks[0]?.scenario)

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return picks
    return picks.filter((pick) =>
      [pick.scenario, pick.architectureLayer, pick.subcategory, pick.useWhenTrigger]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(normalized),
    )
  }, [query])

  const active = filtered.find((pick) => pick.scenario === selected) ?? filtered[0]

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setQuery(event.target.value)
  }

  function handleSelect(scenario: string): void {
    setSelected(scenario)
  }

  return (
    <div data-testid="picks-view" className="space-y-6">
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-800">Quick Picks</h1>
        <p className="mt-1 text-sm text-ink-secondary">Scenario defaults — then challenge with Compare.</p>
      </header>

      <input
        data-testid="picks-search"
        className="field-input"
        placeholder="Filter scenarios…"
        value={query}
        onChange={handleQueryChange}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="glass-panel max-h-[65vh] overflow-y-auto p-2">
          {filtered.map((pick) => (
            <button
              key={pick.scenario}
              type="button"
              onClick={() => handleSelect(pick.scenario)}
              className={[
                'mb-1 w-full rounded-xl px-3 py-3 text-left',
                pick.scenario === active?.scenario ? 'bg-slate-blue/15' : 'hover:bg-white/70',
              ].join(' ')}
            >
              <p className="text-sm font-bold">{pick.scenario}</p>
              <p className="text-xs text-ink-muted">{pick.defaultFirstChoice}</p>
            </button>
          ))}
        </div>

        {active ? (
          <div className="glass-panel space-y-4 p-6" data-testid="picks-detail">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-700">{active.scenario}</h2>
            <p className="text-sm text-ink-secondary">{active.useWhenTrigger}</p>
            <p className="inline-flex rounded-full bg-amber-flame/20 px-3 py-1 text-xs font-bold">
              Default: {active.defaultFirstChoice}
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl provider-aws p-3">
                <p className="text-xs font-bold">AWS</p>
                <p className="mt-1 text-sm">{active.awsOption}</p>
                <p className="mt-2 text-xs opacity-80">{active.chooseAwsWhen}</p>
              </div>
              <div className="rounded-xl provider-azure p-3">
                <p className="text-xs font-bold">Azure</p>
                <p className="mt-1 text-sm">{active.azureOption}</p>
                <p className="mt-2 text-xs opacity-80">{active.chooseAzureWhen}</p>
              </div>
              <div className="rounded-xl provider-gcp p-3">
                <p className="text-xs font-bold">GCP</p>
                <p className="mt-1 text-sm">{active.googleCloudOption}</p>
                <p className="mt-2 text-xs opacity-80">{active.chooseGoogleCloudWhen}</p>
              </div>
            </div>

            {active.complexityCaution ? (
              <p className="text-xs text-cayenne-red">{active.complexityCaution}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
