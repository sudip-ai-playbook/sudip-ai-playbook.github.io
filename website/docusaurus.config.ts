import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {
  BUY_ME_A_COFFEE_URL,
  KO_FI_URL,
} from './src/constants/support';

const config: Config = {
  title: 'AI Playbook',
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
          sidebarCollapsed: true,
          showLastUpdateTime: true,
          showLastUpdateAuthor: false,
        },
        blog: {
          routeBasePath: 'articles',
          showReadingTime: true,
          blogTitle: 'Articles',
          blogDescription:
            'Practical notes on designing, governing and scaling production AI systems.',
          blogSidebarTitle: 'Articles by topic',
          blogSidebarCount: 'ALL',
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
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
        docsRouteBasePath: [
          'docs',
          'ai-solution-engineering',
          'learning-map',
          'roadmaps',
          'startup-entrepreneurship',
        ],
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
        sidebarCollapsed: true,
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
        sidebarCollapsed: true,
        showLastUpdateTime: true,
        showLastUpdateAuthor: false,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'roadmaps',
        path: 'roadmaps',
        routeBasePath: 'roadmaps',
        sidebarPath: './sidebarsRoadmaps.ts',
        sidebarCollapsed: true,
        showLastUpdateTime: true,
        showLastUpdateAuthor: false,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'startup-entrepreneurship',
        path: 'startup-entrepreneurship',
        routeBasePath: 'startup-entrepreneurship',
        sidebarPath: './sidebarsStartupEntrepreneurship.ts',
        sidebarCollapsed: true,
        showLastUpdateTime: true,
        showLastUpdateAuthor: false,
      },
    ],
  ],

  themeConfig: {
    image: 'img/social-card.svg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    blog: {
      sidebar: {
        // Categories are handled by the swizzled BlogSidebar/Content.
        groupByYear: false,
      },
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 3,
    },
    navbar: {
      title: 'AI Playbook',
      logo: {
        alt: 'AI Playbook',
        src: 'img/logo.svg',
        href: 'https://sudip-ai-playbook.github.io/',
        target: '_self',
      },
      items: [
        {
          to: '/',
          label: 'Library',
          position: 'left',
          title: 'Choose Learn, Deliver, or Grow',
        },
        {
          to: '/catalog',
          label: 'Browse all',
          position: 'left',
          title: 'Full content catalog',
        },
        {
          to: '/notes',
          label: 'Notes',
          position: 'right',
          className: 'navbar-notes-link',
          title: 'Daily Notes',
        },
        {
          type: 'dropdown',
          label: 'Sections',
          position: 'right',
          items: [
            {
              type: 'html',
              value:
                '<div class="dropdown-section-label">Learn & deliver</div>',
            },
            {label: '01 Learning Map', to: '/learning-map/overview'},
            {label: '02 Guide', to: '/ai-solution-engineering/overview'},
            {label: '03 Frameworks', to: '/docs/framework'},
            {
              type: 'html',
              value: '<hr class="dropdown-separator" />',
            },
            {
              type: 'html',
              value:
                '<div class="dropdown-section-label">Grow & read</div>',
            },
            {label: '04 Roadmaps', to: '/roadmaps/overview'},
            {label: '05 Startup', to: '/startup-entrepreneurship/overview'},
            {label: '06 Articles', to: '/articles'},
            {
              type: 'html',
              value: '<hr class="dropdown-separator" />',
            },
            {
              type: 'html',
              value: '<div class="dropdown-section-label">Tools</div>',
            },
            {
              label: '07 Interactive playbook',
              href: 'https://sudip-ai-playbook.github.io/',
            },
            {
              label: 'ConsultAI OS',
              href: 'https://sudip-ai-playbook.github.io/consult',
            },
            {
              type: 'html',
              value: '<hr class="dropdown-separator" />',
            },
            {
              label: 'Buy me a coffee',
              href: BUY_ME_A_COFFEE_URL,
            },
            {
              label: 'Support on Ko-fi',
              href: KO_FI_URL,
            },
          ],
        },
      ],
    },
    footer: {
      style: 'light',
      logo: undefined,
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} AI Playbook.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
