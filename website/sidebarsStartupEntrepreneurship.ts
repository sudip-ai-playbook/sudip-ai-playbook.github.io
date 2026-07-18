import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  startupEntrepreneurshipSidebar: [
    'overview',
    {
      type: 'category',
      label: 'Decide and learn',
      collapsed: true,
      items: ['why-start-a-startup', 'counterintuitive-advice'],
    },
    {
      type: 'category',
      label: 'The four levers',
      collapsed: true,
      items: [
        'great-ideas',
        'great-products',
        'team-and-hiring',
        'execution',
      ],
    },
    {
      type: 'category',
      label: 'Grow and compete',
      collapsed: true,
      items: [
        'growth-and-distribution',
        'do-things-that-dont-scale',
        'sales',
        'competition-and-monopoly',
      ],
    },
    {
      type: 'category',
      label: 'Organisation and capital',
      collapsed: true,
      items: [
        'culture',
        'fundraising',
        'legal-finance-mechanics',
        'scaling-the-company',
      ],
    },
  ],
};

export default sidebars;
