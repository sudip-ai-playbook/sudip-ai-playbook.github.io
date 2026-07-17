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
          showLastUpdateTime: true,
          showLastUpdateAuthor: false,
        },
        blog: {
          routeBasePath: 'articles',
          showReadingTime: true,
          blogTitle: 'Articles',
          blogDescription:
            'Practical notes on designing, governing and scaling production AI systems.',
          blogSidebarTitle: 'Recent articles',
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

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['en'],
        indexDocs: true,
        indexBlog: true,
        indexPages: true,
        docsRouteBasePath: ['docs', 'ai-solution-engineering'],
        blogRouteBasePath: 'articles',
        explicitSearchResultPath: true,
        searchBarShortcutHint: true,
        searchResultLimits: 12,
      },
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
        showLastUpdateTime: true,
        showLastUpdateAuthor: false,
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
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 3,
    },
    navbar: {
      title: 'AI Playbook',
      logo: {
        alt: 'AI Solution Engineering Playbook',
        src: 'img/logo.svg',
      },
      items: [
        {to: '/', label: 'Home', position: 'left'},
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
          label: 'Framework',
        },
        {to: '/articles', label: 'Articles', position: 'left'},
        {
          href: 'https://sudip-ai-playbook.github.io/',
          label: 'Open app',
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
          title: 'Start here',
          items: [
            {
              label: 'Home',
              to: '/',
            },
            {
              label: 'Guide overview',
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
          title: 'Guide phases',
          items: [
            {
              label: 'Discover & prioritise',
              to: '/ai-solution-engineering/discovery',
            },
            {
              label: 'Design the solution',
              to: '/ai-solution-engineering/architecture',
            },
            {
              label: 'Trust & operate',
              to: '/ai-solution-engineering/security-privacy',
            },
            {
              label: 'Deliver & scale',
              to: '/ai-solution-engineering/delivery',
            },
          ],
        },
        {
          title: 'Tools',
          items: [
            {
              label: 'Interactive playbook',
              href: 'https://sudip-ai-playbook.github.io/',
            },
            {
              label: 'ConsultAI OS',
              href: 'https://sudip-ai-playbook.github.io/consult',
            },
            {
              label: 'Articles',
              to: '/articles',
            },
            {
              label: 'Page template',
              to: '/docs/playbook-page-template',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/sudip-ai-playbook/sudip-ai-playbook.github.io',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} AI Solution Engineering Playbook.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
