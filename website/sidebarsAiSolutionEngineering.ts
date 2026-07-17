import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  aiSolutionEngineeringSidebar: [
    {
      type: 'category',
      label: 'AI Solution Engineering',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'overview',
      },
      items: [
        'overview',
        'discovery',
        'business-case',
        'architecture',
        'data-knowledge',
        'ai-patterns',
        'rag',
        'agentic-ai',
        'security-privacy',
        'governance',
        'evaluation-observability',
        'finops-commercial',
        'delivery',
        'adoption',
        'industries',
        'consulting',
        'toolkit',
        'career-roadmap',
      ],
    },
  ],
};

export default sidebars;
