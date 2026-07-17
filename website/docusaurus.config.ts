import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'AI Solution Engineering Playbook',
  tagline:
    'Turn ambiguous business problems into valuable, feasible and trusted AI solutions',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://sudip-ai-playbook.github.io',
  baseUrl: '/blog/',

  organizationName: 'sudip-ai-playbook',
  projectName: 'sudip-ai-playbook.github.io',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/sudip-ai-playbook/sudip-ai-playbook.github.io/tree/main/website/',
        },
        blog: {
          routeBasePath: '/',
          showReadingTime: true,
          blogTitle: 'AI Solution Engineering Blog',
          blogDescription:
            'Practical notes on designing, governing and scaling production AI systems.',
          blogSidebarTitle: 'Recent posts',
          blogSidebarCount: 8,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/sudip-ai-playbook/sudip-ai-playbook.github.io/tree/main/website/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'ai-solution-engineering',
        path: 'ai-solution-engineering',
        routeBasePath: 'ai-solution-engineering',
        sidebarPath: './sidebarsAiSolutionEngineering.ts',
        editUrl:
          'https://github.com/sudip-ai-playbook/sudip-ai-playbook.github.io/tree/main/website/',
        showLastUpdateTime: false,
      },
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: 'AI Solution Engineering',
      logo: {
        alt: 'AI Solution Engineering Playbook',
        src: 'img/logo.svg',
      },
      items: [
        {to: '/', label: 'Blog', position: 'left'},
        {
          type: 'docSidebar',
          sidebarId: 'aiSolutionEngineeringSidebar',
          docsPluginId: 'ai-solution-engineering',
          position: 'left',
          label: 'Guide',
        },
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Playbook docs',
        },
        {
          href: 'https://sudip-ai-playbook.github.io/',
          label: 'Playbook app',
          position: 'right',
        },
        {
          href: 'https://github.com/sudip-ai-playbook/sudip-ai-playbook.github.io',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Read',
          items: [
            {
              label: 'Blog',
              to: '/',
            },
            {
              label: 'AI Solution Engineering guide',
              to: '/ai-solution-engineering/overview',
            },
            {
              label: '8D Framework',
              to: '/docs/ai-solution-engineering/8d-framework',
            },
            {
              label: 'VALUE gate',
              to: '/docs/ai-solution-engineering/value-gate',
            },
          ],
        },
        {
          title: 'Series',
          items: [
            {
              label: 'Opportunity discovery',
              to: '/ai-solution-engineering/discovery',
            },
            {
              label: 'Enterprise architecture',
              to: '/ai-solution-engineering/architecture',
            },
            {
              label: 'RAG engineering',
              to: '/ai-solution-engineering/rag',
            },
            {
              label: 'Security and privacy',
              to: '/ai-solution-engineering/security-privacy',
            },
          ],
        },
        {
          title: 'Playbook',
          items: [
            {
              label: 'Open interactive playbook',
              href: 'https://sudip-ai-playbook.github.io/',
            },
            {
              label: 'ConsultAI OS',
              href: 'https://sudip-ai-playbook.github.io/consult',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/sudip-ai-playbook/sudip-ai-playbook.github.io',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} AI Solution Engineering Playbook. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
