import { useMemo, useState } from 'react'
import aiPlatform from '../../data/aiPlatform.json'
import aiGovernance from '../../data/aiGovernance.json'
import providerGuide from '../../data/providerGuide.json'

interface PlatformRow {
  lifecycleDomain: string
  detailedCapability: string
  controlOrEngineeringPurpose: string
  databricksUnityCatalogUnityAiGate?: string
  microsoftFoundryAzureMlPurview?: string
  awsSagemakerAi?: string
  amazonBedrock?: string
  geminiEnterpriseAgentPlatform?: string
}

interface GovernanceRow {
  controlId: string
  controlDomain: string
  governanceControlObjective: string
  minimumImplementation?: string
  requiredEvidence?: string
  lifecycleGate?: string
}

interface GuideRow {
  architectureLayer: string
  awsAverage?: number
  azureAverage?: number
  gcpAverage?: number
  defaultLeader?: string
  whatUsuallyDecidesTheOutcome?: string
  caution?: string
}

const platform = aiPlatform as PlatformRow[]
const governance = aiGovernance as GovernanceRow[]
const guide = providerGuide as GuideRow[]

type AiTab = 'platform' | 'governance' | 'strengths'

export function AiPlatformView() {
  const [tab, setTab] = useState<AiTab>('platform')
  const [domain, setDomain] = useState(platform[0]?.lifecycleDomain ?? '')

  const domains = useMemo(
    () => [...new Set(platform.map((row) => row.lifecycleDomain))],
    [],
  )

  const domainRows = useMemo(
    () => platform.filter((row) => row.lifecycleDomain === domain),
    [domain],
  )

  function handleTab(next: AiTab): void {
    setTab(next)
  }

  function handleDomain(event: React.ChangeEvent<HTMLSelectElement>): void {
    setDomain(event.target.value)
  }

  return (
    <div data-testid="ai-view" className="space-y-6">
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-600 tracking-[0.02em]">AI Platform</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Foundry · Bedrock · Vertex · Unity · governance controls
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ['platform', 'Components'],
            ['governance', 'Controls'],
            ['strengths', 'Provider strengths'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            data-testid={`ai-tab-${id}`}
            onClick={() => handleTab(id)}
            className={[
              'rounded-lg px-3 py-1.5 text-xs font-semibold',
              tab === id ? 'bg-ink text-surface-soft' : 'bg-white/70 text-ink-secondary',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'platform' ? (
        <div className="space-y-4">
          <select data-testid="ai-domain" className="field-input max-w-md" value={domain} onChange={handleDomain}>
            {domains.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <div className="grid gap-3">
            {domainRows.map((row) => (
              <article key={row.detailedCapability} className="glass-panel p-4">
                <h3 className="font-bold">{row.detailedCapability}</h3>
                <p className="mt-1 text-sm text-ink-secondary">{row.controlOrEngineeringPurpose}</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-lg provider-azure p-2 text-xs">
                    <strong>Microsoft</strong>
                    <p className="mt-1">{row.microsoftFoundryAzureMlPurview}</p>
                  </div>
                  <div className="rounded-lg provider-aws p-2 text-xs">
                    <strong>Bedrock</strong>
                    <p className="mt-1">{row.amazonBedrock}</p>
                  </div>
                  <div className="rounded-lg provider-gcp p-2 text-xs">
                    <strong>Gemini</strong>
                    <p className="mt-1">{row.geminiEnterpriseAgentPlatform}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {tab === 'governance' ? (
        <div className="grid gap-3" data-testid="ai-governance-list">
          {governance.map((row) => (
            <article key={row.controlId} className="glass-card glass-card-accent-blue p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-blue/15 px-2 py-0.5 text-[10px] font-bold text-indigo-velvet">
                  {row.controlId}
                </span>
                <span className="text-xs text-ink-muted">{row.controlDomain}</span>
              </div>
              <h3 className="mt-2 font-bold">{row.governanceControlObjective}</h3>
              <p className="mt-1 text-sm text-ink-secondary">{row.minimumImplementation}</p>
            </article>
          ))}
        </div>
      ) : null}

      {tab === 'strengths' ? (
        <div className="grid gap-3" data-testid="ai-strengths-list">
          {guide.map((row) => (
            <article key={row.architectureLayer} className="glass-panel p-4">
              <h3 className="font-bold">{row.architectureLayer}</h3>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
                <div className="rounded-lg provider-aws p-2">
                  <p className="text-[10px] font-bold">AWS</p>
                  <p className="font-bold">{row.awsAverage}</p>
                </div>
                <div className="rounded-lg provider-azure p-2">
                  <p className="text-[10px] font-bold">Azure</p>
                  <p className="font-bold">{row.azureAverage}</p>
                </div>
                <div className="rounded-lg provider-gcp p-2">
                  <p className="text-[10px] font-bold">GCP</p>
                  <p className="font-bold">{row.gcpAverage}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-ink-secondary">{row.whatUsuallyDecidesTheOutcome}</p>
              <p className="mt-1 text-xs text-cayenne-red">{row.caution}</p>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  )
}
