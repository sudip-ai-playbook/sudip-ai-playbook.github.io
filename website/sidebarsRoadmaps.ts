import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  roadmapsSidebar: [
    'overview',
    {
      type: 'category',
      label: 'Engineering roadmaps',
      collapsed: false,
      items: ['ai-agents'],
    },
  ],
};

export default sidebars;
