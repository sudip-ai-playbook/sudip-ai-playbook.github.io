import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  aiSolutionEngineeringSidebar: [
    'overview',
    {
      type: 'category',
      label: '1. Discover & prioritise',
      collapsed: true,
      items: ['discovery', 'business-case'],
    },
    {
      type: 'category',
      label: '2. Design the solution',
      collapsed: true,
      items: [
        'architecture',
        'data-knowledge',
        'ai-patterns',
        'rag',
        'agentic-ai',
      ],
    },
    {
      type: 'category',
      label: '3. Trust & operate',
      collapsed: true,
      items: [
        'security-privacy',
        'governance',
        'evaluation-observability',
        'finops-commercial',
      ],
    },
    {
      type: 'category',
      label: '4. Deliver & scale',
      collapsed: true,
      items: ['delivery', 'adoption', 'industries'],
    },
    {
      type: 'category',
      label: '5. Practice & growth',
      collapsed: true,
      items: ['consulting', 'toolkit', 'career-roadmap'],
    },
  ],
};

export default sidebars;
