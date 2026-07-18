import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  learningMapSidebar: [
    'overview',
    'how-to-use',
    {
      type: 'category',
      label: 'Learning stages',
      collapsed: false,
      items: [
        'stage-1-business-consulting',
        'stage-2-ai-data',
        'stage-3-architecture-cloud',
        'stage-4-trust-control',
        'stage-5-commercial-delivery',
        'stage-6-leadership',
      ],
    },
    {
      type: 'category',
      label: 'Business Learning',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'business-learning/overview',
      },
      items: [
        'business-learning/overview',
        'business-learning/business-briefing',
        'business-learning/business-keywords',
        'business-learning/business-power-words',
        'business-learning/domain-knowledge-gathering',
        'business-learning/domain-knowledge-workbook',
      ],
    },
    {
      type: 'category',
      label: '1. Business & consulting',
      collapsed: true,
      items: [
        'business-fundamentals',
        'business-strategy',
        'industry-domain-knowledge',
        'consulting-problem-solving',
        'ai-opportunity-discovery',
        'stakeholder-management',
        'communication-executive-articulation',
      ],
    },
    {
      type: 'category',
      label: '2. AI & data',
      collapsed: true,
      items: [
        'data-engineering-architecture',
        'machine-learning-foundations',
        'generative-ai-llm-fundamentals',
        'prompt-context-engineering',
        'retrieval-augmented-generation',
        'agentic-ai-workflow-automation',
        'ai-evaluation-quality-assurance',
      ],
    },
    {
      type: 'category',
      label: '3. Architecture & cloud',
      collapsed: true,
      items: [
        'enterprise-architecture',
        'software-engineering',
        'cloud-platform-engineering',
        'integration-enterprise-systems',
      ],
    },
    {
      type: 'category',
      label: '4. Trust & control',
      collapsed: true,
      items: [
        'security-engineering',
        'privacy-legal-compliance',
        'responsible-ai-governance',
        'mlops-llmops-observability',
      ],
    },
    {
      type: 'category',
      label: '5. Commercial & delivery',
      collapsed: true,
      items: [
        'product-management',
        'commercial-financial-modelling',
        'performance-finops',
        'ux-human-factors',
        'delivery-programme-management',
        'change-management-adoption',
        'presales-solution-shaping',
        'rfp-procurement-contracting',
        'vendor-technology-evaluation',
        'operations-production-support',
      ],
    },
    {
      type: 'category',
      label: '6. Leadership',
      collapsed: true,
      items: [
        'leadership-people-management',
        'ethics-sustainability-social-impact',
        'personal-effectiveness',
      ],
    },
    'core-deliverables',
    'competency-test',
  ],
};

export default sidebars;
