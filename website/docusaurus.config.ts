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
        docsRouteBasePath: ['docs', 'ai-solution-engineering', 'learning-map'],
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
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'learning-map',
        path: 'learning-map',
        routeBasePath: 'learning-map',
        sidebarPath: './sidebarsLearningMap.ts',
        editUrl:
          'https://github.com/sudip-ai-playbook/sudip-ai-playbook.github.io/tree/main/website/',
        showLastUpdateTime: true,
        showLastUpdateAuthor: false,
      },
    ],
  ],

  themeConfig: {
    image: 'img/social-card.svg',
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
      title: 'AI Solution Engineering Playbook',
      items: [
        {to: '/', label: 'Home', position: 'left'},
        {
          type: 'docSidebar',
          sidebarId: 'learningMapSidebar',
          docsPluginId: 'learning-map',
          position: 'left',
          label: 'Learning Map',
        },
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
      logo: undefined,
      links: [
        {
          title: 'Start here',
          items: [
            {label: 'Home', to: '/'},
            {label: 'Learning Map', to: '/learning-map/overview'},
            {label: 'How to practise', to: '/learning-map/how-to-use'},
            {label: 'Guide overview', to: '/ai-solution-engineering/overview'},
            {label: '8D Framework', to: '/docs/ai-solution-engineering/8d-framework'},
          ],
        },
        {
          title: 'Learning stages',
          items: [
            {label: '1. Business & consulting', to: '/learning-map/stage-1-business-consulting'},
            {label: '2. AI & data', to: '/learning-map/stage-2-ai-data'},
            {label: '3. Architecture & cloud', to: '/learning-map/stage-3-architecture-cloud'},
            {label: '4. Trust & control', to: '/learning-map/stage-4-trust-control'},
            {label: '5. Commercial & delivery', to: '/learning-map/stage-5-commercial-delivery'},
            {label: '6. Leadership', to: '/learning-map/stage-6-leadership'},
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
            {label: 'Articles', to: '/articles'},
            {label: 'Competency test', to: '/learning-map/competency-test'},
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
