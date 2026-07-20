/**
 * Library catalog for the Learn site.
 * Home uses LIBRARY_GOALS (short paths). /catalog uses LIBRARY_SECTIONS (full tree).
 */

export type LibraryLink = {
  label: string;
  to: string;
  external?: boolean;
};

export type LibraryBranch = {
  id: string;
  title: string;
  links: LibraryLink[];
};

export type LibraryGoal = {
  id: string;
  title: string;
  description: string;
  /** Short ordered path shown after the user picks this goal (5–8 steps). */
  steps: LibraryLink[];
};

export type LibrarySection = {
  id: string;
  number: string;
  title: string;
  summary: string;
  overview: LibraryLink;
  branches: LibraryBranch[];
};

/** Progressive home: three goals only. Full inventory lives in LIBRARY_SECTIONS. */
export const LIBRARY_GOALS: LibraryGoal[] = [
  {
    id: 'learn',
    title: 'Learn',
    description: 'Build capability with practice — stages and topics.',
    steps: [
      {label: 'How to use the Learning Map', to: '/learning-map/how-to-use'},
      {
        label: 'Stage 1 · Business & consulting',
        to: '/learning-map/stage-1-business-consulting',
      },
      {label: 'Stage 2 · AI & data', to: '/learning-map/stage-2-ai-data'},
      {
        label: 'Stage 3 · Architecture & cloud',
        to: '/learning-map/stage-3-architecture-cloud',
      },
      {
        label: 'Stage 4 · Trust & control',
        to: '/learning-map/stage-4-trust-control',
      },
      {label: 'Learning Map overview', to: '/learning-map/overview'},
      {label: 'Competency test', to: '/learning-map/competency-test'},
    ],
  },
  {
    id: 'deliver',
    title: 'Deliver',
    description: 'Run an engagement with Guide, Frameworks, and tools.',
    steps: [
      {label: 'Guide overview', to: '/ai-solution-engineering/overview'},
      {
        label: 'Opportunity Discovery',
        to: '/ai-solution-engineering/discovery',
      },
      {
        label: '8D methodology',
        to: '/docs/ai-solution-engineering/8d-framework',
      },
      {label: 'Framework library', to: '/docs/framework'},
      {
        label: 'ConsultAI OS',
        to: 'https://sudip-ai-playbook.github.io/consult',
        external: true,
      },
      {
        label: 'Security and Privacy',
        to: '/ai-solution-engineering/security-privacy',
      },
      {
        label: 'Delivery and Operating Model',
        to: '/ai-solution-engineering/delivery',
      },
    ],
  },
  {
    id: 'grow',
    title: 'Grow',
    description: 'Follow a career roadmap or founder playbook.',
    steps: [
      {label: 'Roadmaps overview', to: '/roadmaps/overview'},
      {
        label: 'AI Solution Engineering roadmap',
        to: '/roadmaps/ai-solution-engineering',
      },
      {label: 'AI Engineer roadmap', to: '/roadmaps/ai-engineer'},
      {
        label: 'Startup overview',
        to: '/startup-entrepreneurship/overview',
      },
      {
        label: 'Great ideas',
        to: '/startup-entrepreneurship/great-ideas',
      },
      {
        label: 'Career and Capability Roadmap',
        to: '/ai-solution-engineering/career-roadmap',
      },
      {label: 'Browse articles', to: '/articles'},
    ],
  },
];

export const CATALOG_PAGE_PATH = '/catalog';

export const LIBRARY_SECTIONS: LibrarySection[] = [
  {
    id: 'learning-map',
    number: '01',
    title: 'Learning Map',
    summary:
      'Curriculum for AI Solution Engineers — stages, 35 topics, and practice.',
    overview: {label: 'Overview', to: '/learning-map/overview'},
    branches: [
      {
        id: 'lm-start',
        title: 'Start here',
        links: [
          {label: 'Overview', to: '/learning-map/overview'},
          {label: 'How to use', to: '/learning-map/how-to-use'},
          {label: 'Core deliverables', to: '/learning-map/core-deliverables'},
          {label: 'Competency test', to: '/learning-map/competency-test'},
        ],
      },
      {
        id: 'lm-stages',
        title: 'Stages',
        links: [
          {label: 'Stage 1 · Business & consulting', to: '/learning-map/stage-1-business-consulting'},
          {label: 'Stage 2 · AI & data', to: '/learning-map/stage-2-ai-data'},
          {label: 'Stage 3 · Architecture & cloud', to: '/learning-map/stage-3-architecture-cloud'},
          {label: 'Stage 4 · Trust & control', to: '/learning-map/stage-4-trust-control'},
          {label: 'Stage 5 · Commercial & delivery', to: '/learning-map/stage-5-commercial-delivery'},
          {label: 'Stage 6 · Leadership', to: '/learning-map/stage-6-leadership'},
        ],
      },
      {
        id: 'lm-topics-1',
        title: 'Topics · Business & consulting',
        links: [
          {label: 'Business Fundamentals', to: '/learning-map/01-business-fundamentals'},
          {label: 'Business Strategy', to: '/learning-map/02-business-strategy'},
          {label: 'Industry and Domain Knowledge', to: '/learning-map/03-industry-domain-knowledge'},
          {label: 'Consulting and Problem Solving', to: '/learning-map/04-consulting-problem-solving'},
          {label: 'AI Opportunity Discovery', to: '/learning-map/05-ai-opportunity-discovery'},
          {label: 'Stakeholder Management', to: '/learning-map/27-stakeholder-management'},
          {label: 'Communication and Executive Articulation', to: '/learning-map/28-communication-executive-articulation'},
        ],
      },
      {
        id: 'lm-topics-2',
        title: 'Topics · AI & data',
        links: [
          {label: 'Data Engineering and Data Architecture', to: '/learning-map/09-data-engineering-architecture'},
          {label: 'Machine Learning Foundations', to: '/learning-map/10-machine-learning-foundations'},
          {label: 'Generative AI and LLM Fundamentals', to: '/learning-map/11-generative-ai-llm-fundamentals'},
          {label: 'Prompt and Context Engineering', to: '/learning-map/12-prompt-context-engineering'},
          {label: 'Retrieval-Augmented Generation', to: '/learning-map/13-retrieval-augmented-generation'},
          {label: 'Agentic AI and Workflow Automation', to: '/learning-map/14-agentic-ai-workflow-automation'},
          {label: 'AI Evaluation and Quality Assurance', to: '/learning-map/21-ai-evaluation-quality-assurance'},
        ],
      },
      {
        id: 'lm-topics-3',
        title: 'Topics · Architecture & cloud',
        links: [
          {label: 'Enterprise Architecture', to: '/learning-map/08-enterprise-architecture'},
          {label: 'Software Engineering', to: '/learning-map/15-software-engineering'},
          {label: 'Cloud and Platform Engineering', to: '/learning-map/16-cloud-platform-engineering'},
          {label: 'Integration and Enterprise Systems', to: '/learning-map/24-integration-enterprise-systems'},
        ],
      },
      {
        id: 'lm-topics-4',
        title: 'Topics · Trust & control',
        links: [
          {label: 'Security Engineering', to: '/learning-map/17-security-engineering'},
          {label: 'Privacy, Legal and Compliance', to: '/learning-map/18-privacy-legal-compliance'},
          {label: 'Responsible AI and AI Governance', to: '/learning-map/19-responsible-ai-governance'},
          {label: 'MLOps, LLMOps and Observability', to: '/learning-map/20-mlops-llmops-observability'},
        ],
      },
      {
        id: 'lm-topics-5',
        title: 'Topics · Commercial & delivery',
        links: [
          {label: 'Product Management', to: '/learning-map/06-product-management'},
          {label: 'Commercial and Financial Modelling', to: '/learning-map/07-commercial-financial-modelling'},
          {label: 'Performance Engineering and AI FinOps', to: '/learning-map/22-performance-finops'},
          {label: 'User Experience and Human Factors', to: '/learning-map/23-ux-human-factors'},
          {label: 'Delivery and Programme Management', to: '/learning-map/25-delivery-programme-management'},
          {label: 'Change Management and Adoption', to: '/learning-map/26-change-management-adoption'},
          {label: 'Presales and Solution Shaping', to: '/learning-map/29-presales-solution-shaping'},
          {label: 'RFP, Procurement and Contracting', to: '/learning-map/30-rfp-procurement-contracting'},
          {label: 'Vendor and Technology Evaluation', to: '/learning-map/31-vendor-technology-evaluation'},
          {label: 'Operations and Production Support', to: '/learning-map/32-operations-production-support'},
        ],
      },
      {
        id: 'lm-topics-6',
        title: 'Topics · Leadership',
        links: [
          {label: 'Leadership and People Management', to: '/learning-map/33-leadership-people-management'},
          {label: 'Ethics, Sustainability and Social Impact', to: '/learning-map/34-ethics-sustainability-social-impact'},
          {label: 'Personal Effectiveness', to: '/learning-map/35-personal-effectiveness'},
        ],
      },
      {
        id: 'lm-business-learning',
        title: 'Business Learning',
        links: [
          {label: 'Overview', to: '/learning-map/business-learning/overview'},
          {label: 'Business briefing', to: '/learning-map/business-learning/business-briefing'},
          {label: 'Business keywords', to: '/learning-map/business-learning/business-keywords'},
          {label: 'Business power words', to: '/learning-map/business-learning/business-power-words'},
          {label: 'Business communication', to: '/learning-map/business-learning/business-communication'},
          {label: 'Domain knowledge gathering', to: '/learning-map/business-learning/domain-knowledge-gathering'},
          {label: 'Domain knowledge workbook', to: '/learning-map/business-learning/domain-knowledge-workbook'},
        ],
      },
      {
        id: 'lm-pm',
        title: 'Project Management',
        links: [
          {label: 'Overview', to: '/learning-map/project-management/overview'},
          {label: 'PMBOK Fifth Edition study map', to: '/learning-map/project-management/pmbok-fifth-edition'},
        ],
      },
    ],
  },
  {
    id: 'guide',
    number: '02',
    title: 'Guide',
    summary:
      '18-part engagement playbook from opportunity discovery to adoption.',
    overview: {label: 'Overview', to: '/ai-solution-engineering/overview'},
    branches: [
      {
        id: 'guide-discover',
        title: '1. Discover & prioritise',
        links: [
          {label: 'Opportunity Discovery', to: '/ai-solution-engineering/discovery'},
          {label: 'Business Case and Prioritisation', to: '/ai-solution-engineering/business-case'},
        ],
      },
      {
        id: 'guide-design',
        title: '2. Design the solution',
        links: [
          {label: 'Enterprise AI Architecture', to: '/ai-solution-engineering/architecture'},
          {label: 'Data and Knowledge Engineering', to: '/ai-solution-engineering/data-knowledge'},
          {label: 'AI Patterns and Model Strategy', to: '/ai-solution-engineering/ai-patterns'},
          {label: 'RAG Engineering', to: '/ai-solution-engineering/rag'},
          {label: 'Agentic AI Systems', to: '/ai-solution-engineering/agentic-ai'},
        ],
      },
      {
        id: 'guide-trust',
        title: '3. Trust & operate',
        links: [
          {label: 'Security and Privacy', to: '/ai-solution-engineering/security-privacy'},
          {label: 'Responsible AI and Governance', to: '/ai-solution-engineering/governance'},
          {label: 'Evaluation and Observability', to: '/ai-solution-engineering/evaluation-observability'},
          {label: 'AI FinOps and Commercial Design', to: '/ai-solution-engineering/finops-commercial'},
        ],
      },
      {
        id: 'guide-deliver',
        title: '4. Deliver & scale',
        links: [
          {label: 'Delivery and Operating Model', to: '/ai-solution-engineering/delivery'},
          {label: 'Adoption and Change Management', to: '/ai-solution-engineering/adoption'},
          {label: 'Industry Solution Engineering', to: '/ai-solution-engineering/industries'},
        ],
      },
      {
        id: 'guide-practice',
        title: '5. Practice & growth',
        links: [
          {label: 'Consulting and Executive Communication', to: '/ai-solution-engineering/consulting'},
          {label: 'AI Solution Engineering Toolkit', to: '/ai-solution-engineering/toolkit'},
          {label: 'Career and Capability Roadmap', to: '/ai-solution-engineering/career-roadmap'},
        ],
      },
    ],
  },
  {
    id: 'frameworks',
    number: '03',
    title: 'Frameworks',
    summary:
      'Reusable methods for mobilisation, value gates, architecture, and delivery.',
    overview: {label: 'Framework library', to: '/docs/framework'},
    branches: [
      {
        id: 'fw-method',
        title: 'Methodology',
        links: [
          {label: '8D AI Solution Engineering Framework', to: '/docs/ai-solution-engineering/8d-framework'},
          {label: 'VALUE quality gate', to: '/docs/ai-solution-engineering/value-gate'},
        ],
      },
      {
        id: 'fw-catalogue',
        title: 'Framework catalogue',
        links: [
          {label: 'Mobilisation and Decision', to: '/docs/frameworks/mobilisation'},
          {label: 'Strategy', to: '/docs/frameworks/strategy'},
          {label: 'Discovery', to: '/docs/frameworks/discovery'},
          {label: 'AI Readiness and Maturity', to: '/docs/frameworks/readiness-maturity'},
          {label: 'Use-Case Prioritisation', to: '/docs/frameworks/prioritisation'},
          {label: 'Commercial and Value', to: '/docs/frameworks/commercial-value'},
          {label: 'Architecture and Engineering', to: '/docs/frameworks/architecture-engineering'},
          {label: 'Technical AI Engineering', to: '/docs/frameworks/technical-ai-engineering'},
          {label: 'Responsible AI and Governance', to: '/docs/frameworks/responsible-ai-governance'},
          {label: 'Security and Privacy', to: '/docs/frameworks/security-privacy'},
          {label: 'Delivery', to: '/docs/frameworks/delivery'},
          {label: 'Change and Adoption', to: '/docs/frameworks/change-adoption'},
        ],
      },
      {
        id: 'fw-contribute',
        title: 'Contribute',
        links: [
          {label: 'Playbook page template', to: '/docs/playbook-page-template'},
          {label: 'Write a blog post', to: '/docs/write-a-blog-post'},
          {label: 'About these guides', to: '/docs/about'},
        ],
      },
    ],
  },
  {
    id: 'roadmaps',
    number: '04',
    title: 'Roadmaps',
    summary:
      'Stage-by-stage paths for engineering, product, leadership, security, and cloud.',
    overview: {label: 'Overview', to: '/roadmaps/overview'},
    branches: [
      {
        id: 'rm-eng',
        title: 'Engineering',
        links: [
          {label: 'AI Solution Engineering', to: '/roadmaps/ai-solution-engineering'},
          {label: 'AI Engineer', to: '/roadmaps/ai-engineer'},
          {label: 'AI Data Scientist', to: '/roadmaps/ai-data-scientist'},
          {label: 'AI Agents', to: '/roadmaps/ai-agents'},
          {label: 'AI Product Builder', to: '/roadmaps/ai-product-builder'},
          {label: 'Forward-Deployed Engineer', to: '/roadmaps/forward-deployed-engineer'},
          {label: 'Engineering Manager', to: '/roadmaps/engineering-manager'},
          {label: 'Software Architect', to: '/roadmaps/software-architect'},
        ],
      },
      {
        id: 'rm-product',
        title: 'Product',
        links: [
          {label: 'AI Product Management', to: '/roadmaps/ai-product-management'},
        ],
      },
      {
        id: 'rm-org',
        title: 'Organisation & leadership',
        links: [
          {label: 'Data & AI Centre of Excellence', to: '/roadmaps/data-ai-centre-of-excellence'},
          {label: 'Direction and priorities', to: '/roadmaps/leadership-direction-priorities'},
          {label: 'Engage business leaders', to: '/roadmaps/leadership-engage-business-leaders'},
          {label: 'Remove delivery blockers', to: '/roadmaps/leadership-remove-delivery-blockers'},
          {label: 'Risk, governance and assurance', to: '/roadmaps/leadership-risk-governance-assurance'},
          {label: 'Portfolio performance', to: '/roadmaps/leadership-portfolio-performance'},
          {label: 'Client opportunity shaping', to: '/roadmaps/leadership-client-opportunity-shaping'},
          {label: 'Market opportunity shaping', to: '/roadmaps/leadership-market-opportunity-shaping'},
          {label: 'External representation', to: '/roadmaps/leadership-external-representation'},
          {label: 'People and organisational capability', to: '/roadmaps/leadership-people-organisational-capability'},
          {label: 'Exceptional culture', to: '/roadmaps/leadership-exceptional-culture'},
          {label: 'Build future capability', to: '/roadmaps/leadership-future-capability'},
          {label: 'Exceptional professional services', to: '/roadmaps/leadership-exceptional-professional-services'},
          {label: 'Quality, independence and trust', to: '/roadmaps/leadership-quality-independence-trust'},
          {label: 'Organisation-wide transformation', to: '/roadmaps/leadership-organisation-wide-transformation'},
        ],
      },
      {
        id: 'rm-sec',
        title: 'Security',
        links: [
          {label: 'DevSecOps', to: '/roadmaps/devsecops'},
          {label: 'API Security Engineering', to: '/roadmaps/api-security-engineering'},
          {label: 'AI Red Teaming', to: '/roadmaps/ai-red-teaming'},
          {label: 'Enterprise AI Security', to: '/roadmaps/enterprise-ai-security'},
        ],
      },
      {
        id: 'rm-platform',
        title: 'Platform',
        links: [
          {label: 'AWS', to: '/roadmaps/aws'},
          {label: 'Azure', to: '/roadmaps/azure'},
          {label: 'Google Cloud', to: '/roadmaps/gcp'},
          {label: 'Model FinOps', to: '/roadmaps/model-finops'},
        ],
      },
    ],
  },
  {
    id: 'startup',
    number: '05',
    title: 'Startup',
    summary:
      'Founder practice: ideas, product, team, growth, fundraising, and scaling.',
    overview: {label: 'Overview', to: '/startup-entrepreneurship/overview'},
    branches: [
      {
        id: 'su-decide',
        title: 'Decide and learn',
        links: [
          {label: 'Why start a startup', to: '/startup-entrepreneurship/why-start-a-startup'},
          {label: 'Counterintuitive advice', to: '/startup-entrepreneurship/counterintuitive-advice'},
        ],
      },
      {
        id: 'su-levers',
        title: 'The four levers',
        links: [
          {label: 'Great ideas', to: '/startup-entrepreneurship/great-ideas'},
          {label: 'Great products', to: '/startup-entrepreneurship/great-products'},
          {label: 'Team and hiring', to: '/startup-entrepreneurship/team-and-hiring'},
          {label: 'Execution', to: '/startup-entrepreneurship/execution'},
        ],
      },
      {
        id: 'su-grow',
        title: 'Grow and compete',
        links: [
          {label: 'Growth and distribution', to: '/startup-entrepreneurship/growth-and-distribution'},
          {label: "Do things that don't scale", to: '/startup-entrepreneurship/do-things-that-dont-scale'},
          {label: 'Sales', to: '/startup-entrepreneurship/sales'},
          {label: 'Competition and monopoly', to: '/startup-entrepreneurship/competition-and-monopoly'},
        ],
      },
      {
        id: 'su-capital',
        title: 'Organisation and capital',
        links: [
          {label: 'Culture', to: '/startup-entrepreneurship/culture'},
          {label: 'Fundraising', to: '/startup-entrepreneurship/fundraising'},
          {label: 'Legal and finance mechanics', to: '/startup-entrepreneurship/legal-finance-mechanics'},
          {label: 'Scaling the company', to: '/startup-entrepreneurship/scaling-the-company'},
        ],
      },
    ],
  },
  {
    id: 'articles',
    number: '06',
    title: 'Articles',
    summary:
      'All short practical notes — business, consulting, engineering, and governance.',
    overview: {label: 'Browse all articles', to: '/articles'},
    branches: [
      {
        id: 'art-1',
        title: 'Getting started',
        links: [
          {label: 'Welcome', to: '/articles/welcome-to-the-ai-playbook-blog'},
          {label: 'What is AI Solution Engineering?', to: '/articles/what-is-ai-solution-engineering'},
        ],
      },
      {
        id: 'art-2',
        title: 'Business',
        links: [
          {label: 'Value proposition', to: '/articles/business-value-proposition'},
          {label: 'Vision, mission and culture', to: '/articles/business-vision-mission-and-culture'},
          {label: 'Hiring and team building', to: '/articles/business-hiring-and-team-building'},
          {label: 'Have you got what it takes?', to: '/articles/business-have-you-got-what-it-takes'},
          {label: 'Roadmap to success', to: '/articles/business-roadmap-to-success'},
          {label: 'First 10 customers', to: '/articles/business-how-to-get-your-first-10-customers'},
          {label: 'Go-to-market strategies', to: '/articles/business-go-to-market-strategies'},
          {label: 'Perfect pitch', to: '/articles/business-perfect-pitch'},
          {label: 'Disruptive business model', to: '/articles/business-disruptive-business-model'},
          {label: 'Products into companies', to: '/articles/business-turning-products-into-companies'},
          {label: 'Funding strategies', to: '/articles/business-funding-strategies-to-go-the-distance'},
          {label: 'Build a business that works', to: '/articles/how-to-build-a-business-that-works-brian-tracy'},
        ],
      },
      {
        id: 'art-3',
        title: 'Communication',
        links: [
          {label: 'Speak with confidence', to: '/articles/communication-how-to-speak-with-confidence'},
        ],
      },
      {
        id: 'art-4',
        title: 'Solution Engineering',
        links: [
          {label: 'Enterprise AI systems', to: '/articles/enterprise-ai-solution-engineering'},
          {label: 'End-to-end frameworks', to: '/articles/frameworks-for-end-to-end-ai-solution-engineering'},
          {label: 'Framework playbook', to: '/articles/ai-solution-engineering-framework-playbook'},
          {label: 'PMBOK study guide', to: '/articles/pmbok-fifth-edition-project-management-study-guide'},
        ],
      },
      {
        id: 'art-5',
        title: 'Consulting & leadership',
        links: [
          {label: 'ConsultAI OS in ten minutes', to: '/articles/consultai-os-in-ten-minutes'},
          {label: 'AI consulting roadmap', to: '/articles/ai-consulting-strategy-frameworks-roadmap'},
          {label: 'Regional Data & AI CoE', to: '/articles/regional-data-ai-centre-of-excellence'},
          {label: 'Set direction and priorities', to: '/articles/leadership-set-direction-and-priorities'},
          {label: 'Engage business leaders', to: '/articles/leadership-engage-business-service-line-leaders'},
          {label: 'Remove delivery blockers', to: '/articles/leadership-remove-delivery-blockers'},
          {label: 'Risk, governance and assurance', to: '/articles/leadership-risk-governance-assurance-decisions'},
          {label: 'Portfolio performance and value', to: '/articles/leadership-portfolio-performance-and-business-value'},
          {label: 'Shape client opportunities', to: '/articles/leadership-shaping-major-data-ai-client-opportunities'},
          {label: 'Shape market opportunities', to: '/articles/leadership-shape-major-market-opportunities'},
          {label: 'Represent the firm externally', to: '/articles/leadership-represent-the-firm-externally'},
          {label: 'Develop people & capability', to: '/articles/leadership-develop-people-and-organisational-capability'},
          {label: 'Create an exceptional culture', to: '/articles/leadership-create-an-exceptional-culture'},
          {label: 'Build future capability', to: '/articles/leadership-build-future-capability'},
          {label: 'Exceptional firm leadership', to: '/articles/leadership-exceptional-professional-services'},
          {label: 'Quality, independence and trust', to: '/articles/leadership-protect-quality-independence-and-trust'},
          {label: 'Organisation-wide transformation', to: '/articles/leadership-organisation-wide-transformation'},
        ],
      },
      {
        id: 'art-6',
        title: 'AI Engineering',
        links: [
          {label: 'Chip Huyen deep dive', to: '/articles/ai-engineering-chip-huyen-deep-dive'},
        ],
      },
      {
        id: 'art-7',
        title: 'Governance',
        links: [
          {label: 'NIST AI RMF and EU AI Act', to: '/articles/ai-governance-nist-eu-ai-act'},
          {label: 'ISO/IEC 42001', to: '/articles/ai-governance-iso-iec-42001'},
          {label: 'ISO/IEC 27001', to: '/articles/ai-governance-iso-iec-27001'},
          {label: 'EU AI Act application playbook', to: '/articles/eu-ai-act-regulation-2024-1689'},
          {label: 'OWASP LLM Top 10', to: '/articles/owasp-llm-top-10-governance'},
          {label: 'Software licences explained', to: '/articles/software-licences-explained'},
        ],
      },
      {
        id: 'art-8',
        title: 'Roadmap articles',
        links: [
          {label: 'AI Engineer', to: '/articles/ai-engineer-roadmap'},
          {label: 'AI / Data Scientist', to: '/articles/ai-data-scientist-roadmap'},
          {label: 'AI Product Builder', to: '/articles/ai-product-builder-roadmap'},
          {label: 'Product Manager', to: '/articles/ai-product-management-roadmap'},
          {label: 'Production AI agents', to: '/articles/building-production-grade-ai-agents'},
          {label: 'Forward-Deployed Engineer', to: '/articles/forward-deployed-engineer-roadmap'},
          {label: 'Engineering Manager', to: '/articles/engineering-manager-roadmap'},
          {label: 'Software Architect', to: '/articles/software-architect-roadmap'},
          {label: 'AWS', to: '/articles/aws-roadmap'},
          {label: 'Azure', to: '/articles/azure-roadmap'},
          {label: 'Google Cloud', to: '/articles/gcp-roadmap'},
          {label: 'Model FinOps', to: '/articles/model-finops-cost-engineering-roadmap'},
          {label: 'Enterprise AI security', to: '/articles/enterprise-ai-security-roadmap'},
          {label: 'API security', to: '/articles/api-security-engineering-roadmap'},
          {label: 'AI red teaming', to: '/articles/ai-red-teaming-roadmap'},
          {label: 'DevSecOps', to: '/articles/devsecops-roadmap'},
        ],
      },
    ],
  },
  {
    id: 'tools',
    number: '07',
    title: 'Tools',
    summary:
      'Interactive playbook, ConsultAI OS, and private daily notes.',
    overview: {
      label: 'Interactive playbook',
      to: 'https://sudip-ai-playbook.github.io/',
      external: true,
    },
    branches: [
      {
        id: 'tools-app',
        title: 'Interactive',
        links: [
          {
            label: 'Interactive playbook',
            to: 'https://sudip-ai-playbook.github.io/',
            external: true,
          },
          {
            label: 'ConsultAI OS',
            to: 'https://sudip-ai-playbook.github.io/consult',
            external: true,
          },
          {
            label: 'Architecture journey',
            to: 'https://sudip-ai-playbook.github.io/',
            external: true,
          },
          {label: 'Daily Notes', to: '/notes'},
        ],
      },
    ],
  },
];

export function getLibrarySectionById(
  sectionId: string,
): LibrarySection | undefined {
  return LIBRARY_SECTIONS.find((section) => section.id === sectionId);
}

export function listLibrarySectionIds(): string[] {
  return LIBRARY_SECTIONS.map((section) => section.id);
}

export function listLibraryLinks(): LibraryLink[] {
  const links: LibraryLink[] = [];
  for (const goal of LIBRARY_GOALS) {
    links.push(...goal.steps);
  }
  for (const section of LIBRARY_SECTIONS) {
    links.push(section.overview);
    for (const branch of section.branches) {
      links.push(...branch.links);
    }
  }
  return links;
}

export function listInternalLibraryPaths(): string[] {
  const paths = new Set<string>();
  for (const link of listLibraryLinks()) {
    if (link.external || link.to.startsWith('http')) {
      continue;
    }
    paths.add(link.to.replace(/\/+$/, ''));
  }
  return [...paths].sort();
}

export function countLibraryLinks(): number {
  return listLibraryLinks().length;
}

/** Expected published content paths (excluding unlisted intro redirect). */
export const EXPECTED_CONTENT_PATHS: string[] = [

  '/ai-solution-engineering/adoption',
  '/ai-solution-engineering/agentic-ai',
  '/ai-solution-engineering/ai-patterns',
  '/ai-solution-engineering/architecture',
  '/ai-solution-engineering/business-case',
  '/ai-solution-engineering/career-roadmap',
  '/ai-solution-engineering/consulting',
  '/ai-solution-engineering/data-knowledge',
  '/ai-solution-engineering/delivery',
  '/ai-solution-engineering/discovery',
  '/ai-solution-engineering/evaluation-observability',
  '/ai-solution-engineering/finops-commercial',
  '/ai-solution-engineering/governance',
  '/ai-solution-engineering/industries',
  '/ai-solution-engineering/overview',
  '/ai-solution-engineering/rag',
  '/ai-solution-engineering/security-privacy',
  '/ai-solution-engineering/toolkit',
  '/articles/ai-consulting-strategy-frameworks-roadmap',
  '/articles/ai-data-scientist-roadmap',
  '/articles/ai-engineer-roadmap',
  '/articles/ai-engineering-chip-huyen-deep-dive',
  '/articles/ai-governance-iso-iec-27001',
  '/articles/ai-governance-iso-iec-42001',
  '/articles/ai-governance-nist-eu-ai-act',
  '/articles/ai-product-builder-roadmap',
  '/articles/ai-product-management-roadmap',
  '/articles/ai-red-teaming-roadmap',
  '/articles/ai-solution-engineering-framework-playbook',
  '/articles/api-security-engineering-roadmap',
  '/articles/aws-roadmap',
  '/articles/azure-roadmap',
  '/articles/building-production-grade-ai-agents',
  '/articles/business-disruptive-business-model',
  '/articles/business-funding-strategies-to-go-the-distance',
  '/articles/business-go-to-market-strategies',
  '/articles/business-have-you-got-what-it-takes',
  '/articles/business-hiring-and-team-building',
  '/articles/business-how-to-get-your-first-10-customers',
  '/articles/business-perfect-pitch',
  '/articles/business-roadmap-to-success',
  '/articles/business-turning-products-into-companies',
  '/articles/business-value-proposition',
  '/articles/business-vision-mission-and-culture',
  '/articles/communication-how-to-speak-with-confidence',
  '/articles/consultai-os-in-ten-minutes',
  '/articles/devsecops-roadmap',
  '/articles/engineering-manager-roadmap',
  '/articles/enterprise-ai-security-roadmap',
  '/articles/enterprise-ai-solution-engineering',
  '/articles/eu-ai-act-regulation-2024-1689',
  '/articles/forward-deployed-engineer-roadmap',
  '/articles/frameworks-for-end-to-end-ai-solution-engineering',
  '/articles/gcp-roadmap',
  '/articles/how-to-build-a-business-that-works-brian-tracy',
  '/articles/leadership-build-future-capability',
  '/articles/leadership-create-an-exceptional-culture',
  '/articles/leadership-develop-people-and-organisational-capability',
  '/articles/leadership-engage-business-service-line-leaders',
  '/articles/leadership-exceptional-professional-services',
  '/articles/leadership-organisation-wide-transformation',
  '/articles/leadership-portfolio-performance-and-business-value',
  '/articles/leadership-protect-quality-independence-and-trust',
  '/articles/leadership-remove-delivery-blockers',
  '/articles/leadership-represent-the-firm-externally',
  '/articles/leadership-risk-governance-assurance-decisions',
  '/articles/leadership-set-direction-and-priorities',
  '/articles/leadership-shape-major-market-opportunities',
  '/articles/leadership-shaping-major-data-ai-client-opportunities',
  '/articles/model-finops-cost-engineering-roadmap',
  '/articles/owasp-llm-top-10-governance',
  '/articles/pmbok-fifth-edition-project-management-study-guide',
  '/articles/regional-data-ai-centre-of-excellence',
  '/articles/software-architect-roadmap',
  '/articles/software-licences-explained',
  '/articles/welcome-to-the-ai-playbook-blog',
  '/articles/what-is-ai-solution-engineering',
  '/docs/about',
  '/docs/ai-solution-engineering/8d-framework',
  '/docs/ai-solution-engineering/value-gate',
  '/docs/framework',
  '/docs/frameworks/architecture-engineering',
  '/docs/frameworks/change-adoption',
  '/docs/frameworks/commercial-value',
  '/docs/frameworks/delivery',
  '/docs/frameworks/discovery',
  '/docs/frameworks/mobilisation',
  '/docs/frameworks/prioritisation',
  '/docs/frameworks/readiness-maturity',
  '/docs/frameworks/responsible-ai-governance',
  '/docs/frameworks/security-privacy',
  '/docs/frameworks/strategy',
  '/docs/frameworks/technical-ai-engineering',
  '/docs/playbook-page-template',
  '/docs/write-a-blog-post',
  '/learning-map/01-business-fundamentals',
  '/learning-map/02-business-strategy',
  '/learning-map/03-industry-domain-knowledge',
  '/learning-map/04-consulting-problem-solving',
  '/learning-map/05-ai-opportunity-discovery',
  '/learning-map/06-product-management',
  '/learning-map/07-commercial-financial-modelling',
  '/learning-map/08-enterprise-architecture',
  '/learning-map/09-data-engineering-architecture',
  '/learning-map/10-machine-learning-foundations',
  '/learning-map/11-generative-ai-llm-fundamentals',
  '/learning-map/12-prompt-context-engineering',
  '/learning-map/13-retrieval-augmented-generation',
  '/learning-map/14-agentic-ai-workflow-automation',
  '/learning-map/15-software-engineering',
  '/learning-map/16-cloud-platform-engineering',
  '/learning-map/17-security-engineering',
  '/learning-map/18-privacy-legal-compliance',
  '/learning-map/19-responsible-ai-governance',
  '/learning-map/20-mlops-llmops-observability',
  '/learning-map/21-ai-evaluation-quality-assurance',
  '/learning-map/22-performance-finops',
  '/learning-map/23-ux-human-factors',
  '/learning-map/24-integration-enterprise-systems',
  '/learning-map/25-delivery-programme-management',
  '/learning-map/26-change-management-adoption',
  '/learning-map/27-stakeholder-management',
  '/learning-map/28-communication-executive-articulation',
  '/learning-map/29-presales-solution-shaping',
  '/learning-map/30-rfp-procurement-contracting',
  '/learning-map/31-vendor-technology-evaluation',
  '/learning-map/32-operations-production-support',
  '/learning-map/33-leadership-people-management',
  '/learning-map/34-ethics-sustainability-social-impact',
  '/learning-map/35-personal-effectiveness',
  '/learning-map/business-learning/business-briefing',
  '/learning-map/business-learning/business-communication',
  '/learning-map/business-learning/business-keywords',
  '/learning-map/business-learning/business-power-words',
  '/learning-map/business-learning/domain-knowledge-gathering',
  '/learning-map/business-learning/domain-knowledge-workbook',
  '/learning-map/business-learning/overview',
  '/learning-map/competency-test',
  '/learning-map/core-deliverables',
  '/learning-map/how-to-use',
  '/learning-map/overview',
  '/learning-map/project-management/overview',
  '/learning-map/project-management/pmbok-fifth-edition',
  '/learning-map/stage-1-business-consulting',
  '/learning-map/stage-2-ai-data',
  '/learning-map/stage-3-architecture-cloud',
  '/learning-map/stage-4-trust-control',
  '/learning-map/stage-5-commercial-delivery',
  '/learning-map/stage-6-leadership',
  '/notes',
  '/roadmaps/ai-agents',
  '/roadmaps/ai-data-scientist',
  '/roadmaps/ai-engineer',
  '/roadmaps/ai-product-builder',
  '/roadmaps/ai-product-management',
  '/roadmaps/ai-red-teaming',
  '/roadmaps/ai-solution-engineering',
  '/roadmaps/api-security-engineering',
  '/roadmaps/aws',
  '/roadmaps/azure',
  '/roadmaps/data-ai-centre-of-excellence',
  '/roadmaps/devsecops',
  '/roadmaps/engineering-manager',
  '/roadmaps/enterprise-ai-security',
  '/roadmaps/forward-deployed-engineer',
  '/roadmaps/gcp',
  '/roadmaps/leadership-client-opportunity-shaping',
  '/roadmaps/leadership-direction-priorities',
  '/roadmaps/leadership-engage-business-leaders',
  '/roadmaps/leadership-exceptional-culture',
  '/roadmaps/leadership-exceptional-professional-services',
  '/roadmaps/leadership-external-representation',
  '/roadmaps/leadership-future-capability',
  '/roadmaps/leadership-market-opportunity-shaping',
  '/roadmaps/leadership-organisation-wide-transformation',
  '/roadmaps/leadership-people-organisational-capability',
  '/roadmaps/leadership-portfolio-performance',
  '/roadmaps/leadership-quality-independence-trust',
  '/roadmaps/leadership-remove-delivery-blockers',
  '/roadmaps/leadership-risk-governance-assurance',
  '/roadmaps/model-finops',
  '/roadmaps/overview',
  '/roadmaps/software-architect',
  '/startup-entrepreneurship/competition-and-monopoly',
  '/startup-entrepreneurship/counterintuitive-advice',
  '/startup-entrepreneurship/culture',
  '/startup-entrepreneurship/do-things-that-dont-scale',
  '/startup-entrepreneurship/execution',
  '/startup-entrepreneurship/fundraising',
  '/startup-entrepreneurship/great-ideas',
  '/startup-entrepreneurship/great-products',
  '/startup-entrepreneurship/growth-and-distribution',
  '/startup-entrepreneurship/legal-finance-mechanics',
  '/startup-entrepreneurship/overview',
  '/startup-entrepreneurship/sales',
  '/startup-entrepreneurship/scaling-the-company',
  '/startup-entrepreneurship/team-and-hiring',
  '/startup-entrepreneurship/why-start-a-startup',
];

export function findUnlinkedExpectedPaths(): string[] {
  const linked = new Set(listInternalLibraryPaths());
  return EXPECTED_CONTENT_PATHS.filter((path) => !linked.has(path));
}

