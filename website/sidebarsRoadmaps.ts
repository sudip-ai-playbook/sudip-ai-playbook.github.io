import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  roadmapsSidebar: [
    'overview',
    {
      type: 'category',
      label: 'Engineering roadmaps',
      collapsed: true,
      items: [
        'ai-solution-engineering',
        'ai-engineer',
        'ai-data-scientist',
        'ai-agents',
        'ai-product-builder',
        'forward-deployed-engineer',
        'engineering-manager',
        'software-architect',
      ],
    },
    {
      type: 'category',
      label: 'Product roadmaps',
      collapsed: true,
      items: ['ai-product-management'],
    },
    {
      type: 'category',
      label: 'Security roadmaps',
      collapsed: true,
      items: [
        'devsecops',
        'api-security-engineering',
        'ai-red-teaming',
        'enterprise-ai-security',
      ],
    },
    {
      type: 'category',
      label: 'Platform roadmaps',
      collapsed: true,
      items: ['aws', 'azure', 'gcp', 'model-finops'],
    },
  ],
};

export default sidebars;
