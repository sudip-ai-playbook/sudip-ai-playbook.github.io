import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    'playbook-page-template',
    {
      type: 'category',
      label: '8D Framework',
      collapsed: false,
      items: [
        'ai-solution-engineering/8d-framework',
        'ai-solution-engineering/value-gate',
      ],
    },
    {
      type: 'category',
      label: 'Contribute',
      collapsed: true,
      items: ['write-a-blog-post'],
    },
  ],
};

export default sidebars;
