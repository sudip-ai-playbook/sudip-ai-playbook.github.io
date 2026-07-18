import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  roadmapsSidebar: [
    'overview',
    {
      type: 'category',
      label: 'Engineering roadmaps',
      collapsed: false,
      items: [
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
      collapsed: false,
      items: ['ai-product-management'],
    },
    {
      type: 'category',
      label: 'Security roadmaps',
      collapsed: false,
      items: ['devsecops', 'api-security-engineering'],
    },
    {
      type: 'category',
      label: 'Platform roadmaps',
      collapsed: false,
      items: ['aws'],
    },
  ],
};

export default sidebars;
