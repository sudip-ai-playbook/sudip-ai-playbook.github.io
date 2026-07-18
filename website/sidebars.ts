import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'framework',
    {
      type: 'category',
      label: 'Framework catalogue',
      collapsed: true,
      items: [
        'frameworks/mobilisation',
        'frameworks/strategy',
        'frameworks/discovery',
        'frameworks/readiness-maturity',
        'frameworks/prioritisation',
        'frameworks/commercial-value',
        'frameworks/architecture-engineering',
        'frameworks/technical-ai-engineering',
        'frameworks/responsible-ai-governance',
        'frameworks/security-privacy',
        'frameworks/delivery',
        'frameworks/change-adoption',
      ],
    },
    {
      type: 'category',
      label: '8D Methodology',
      collapsed: true,
      items: [
        'ai-solution-engineering/8d-framework',
        'ai-solution-engineering/value-gate',
      ],
    },
    {
      type: 'category',
      label: 'Contribute',
      collapsed: true,
      items: ['playbook-page-template', 'write-a-blog-post', 'about'],
    },
  ],
};

export default sidebars;
