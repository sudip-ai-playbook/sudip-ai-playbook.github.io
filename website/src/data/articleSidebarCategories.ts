/**
 * Blog sidebar grouping for Articles.
 * Sidebar items from Docusaurus only expose title/permalink/date — categories
 * are maintained here so the nav stays browsable as the catalogue grows.
 */

export const ARTICLE_SIDEBAR_CATEGORIES = [
  'Getting started',
  'Business',
  'Communication',
  'Solution Engineering',
  'Consulting',
  'AI Engineering',
  'Governance',
  'Roadmaps',
  'More',
] as const;

export type ArticleSidebarCategory =
  (typeof ARTICLE_SIDEBAR_CATEGORIES)[number];

type ArticleSidebarEntry = {
  category: ArticleSidebarCategory;
  label?: string;
};

/** Slug (last path segment) → category and optional short sidebar label. */
const ARTICLE_SIDEBAR_BY_SLUG: Record<string, ArticleSidebarEntry> = {
  'welcome-to-the-ai-playbook-blog': {
    category: 'Getting started',
    label: 'Welcome',
  },

  'business-value-proposition': {
    category: 'Business',
    label: 'Value proposition',
  },
  'business-vision-mission-and-culture': {
    category: 'Business',
    label: 'Vision, mission and culture',
  },
  'business-hiring-and-team-building': {
    category: 'Business',
    label: 'Hiring and team building',
  },
  'business-have-you-got-what-it-takes': {
    category: 'Business',
    label: 'Have you got what it takes?',
  },
  'business-roadmap-to-success': {
    category: 'Business',
    label: 'Roadmap to success',
  },
  'business-how-to-get-your-first-10-customers': {
    category: 'Business',
    label: 'First 10 customers',
  },
  'business-go-to-market-strategies': {
    category: 'Business',
    label: 'Go-to-market strategies',
  },
  'business-perfect-pitch': {
    category: 'Business',
    label: 'Perfect pitch',
  },
  'business-disruptive-business-model': {
    category: 'Business',
    label: 'Disruptive business model',
  },
  'business-turning-products-into-companies': {
    category: 'Business',
    label: 'Products into companies',
  },
  'business-funding-strategies-to-go-the-distance': {
    category: 'Business',
    label: 'Funding strategies',
  },
  'how-to-build-a-business-that-works-brian-tracy': {
    category: 'Business',
    label: 'Build a business that works',
  },

  'communication-how-to-speak-with-confidence': {
    category: 'Communication',
    label: 'Speak with confidence',
  },

  'what-is-ai-solution-engineering': {
    category: 'Solution Engineering',
    label: 'What is AI Solution Engineering?',
  },
  'enterprise-ai-solution-engineering': {
    category: 'Solution Engineering',
    label: 'Enterprise AI systems',
  },
  'frameworks-for-end-to-end-ai-solution-engineering': {
    category: 'Solution Engineering',
    label: 'End-to-end frameworks',
  },
  'ai-solution-engineering-framework-playbook': {
    category: 'Solution Engineering',
    label: 'Framework playbook',
  },

  'consultai-os-in-ten-minutes': {
    category: 'Consulting',
    label: 'ConsultAI OS in ten minutes',
  },
  'ai-consulting-strategy-frameworks-roadmap': {
    category: 'Consulting',
    label: 'AI consulting roadmap',
  },

  'ai-engineering-chip-huyen-deep-dive': {
    category: 'AI Engineering',
    label: 'Chip Huyen deep dive',
  },

  'ai-governance-nist-eu-ai-act': {
    category: 'Governance',
    label: 'NIST AI RMF and EU AI Act',
  },
  'ai-governance-iso-iec-42001': {
    category: 'Governance',
    label: 'ISO/IEC 42001',
  },

  'ai-engineer-roadmap': {
    category: 'Roadmaps',
    label: 'AI Engineer',
  },
  'ai-product-builder-roadmap': {
    category: 'Roadmaps',
    label: 'AI Product Builder',
  },
  'ai-product-management-roadmap': {
    category: 'Roadmaps',
    label: 'Product Manager',
  },
  'ai-data-scientist-roadmap': {
    category: 'Roadmaps',
    label: 'AI / Data Scientist',
  },
  'building-production-grade-ai-agents': {
    category: 'Roadmaps',
    label: 'Production AI agents',
  },
  'forward-deployed-engineer-roadmap': {
    category: 'Roadmaps',
    label: 'Forward-Deployed Engineer',
  },
  'engineering-manager-roadmap': {
    category: 'Roadmaps',
    label: 'Engineering Manager',
  },
  'software-architect-roadmap': {
    category: 'Roadmaps',
    label: 'Software Architect',
  },
  'aws-roadmap': {
    category: 'Roadmaps',
    label: 'AWS',
  },
  'azure-roadmap': {
    category: 'Roadmaps',
    label: 'Azure',
  },
  'gcp-roadmap': {
    category: 'Roadmaps',
    label: 'Google Cloud',
  },
  'model-finops-cost-engineering-roadmap': {
    category: 'Roadmaps',
    label: 'Model FinOps',
  },
  'enterprise-ai-security-roadmap': {
    category: 'Roadmaps',
    label: 'Enterprise AI security',
  },
  'api-security-engineering-roadmap': {
    category: 'Roadmaps',
    label: 'API security',
  },
  'ai-red-teaming-roadmap': {
    category: 'Roadmaps',
    label: 'AI red teaming',
  },
  'devsecops-roadmap': {
    category: 'Roadmaps',
    label: 'DevSecOps',
  },
};

function getSlugFromPermalink(permalink: string): string {
  const trimmed = permalink.replace(/\/+$/, '');
  const segments = trimmed.split('/');
  return segments[segments.length - 1] ?? trimmed;
}

export function getArticleSidebarCategory(
  permalink: string,
): ArticleSidebarCategory {
  const slug = getSlugFromPermalink(permalink);
  return ARTICLE_SIDEBAR_BY_SLUG[slug]?.category ?? 'More';
}

export function getArticleSidebarLabel(
  permalink: string,
  fallbackTitle: string,
): string {
  const slug = getSlugFromPermalink(permalink);
  return ARTICLE_SIDEBAR_BY_SLUG[slug]?.label ?? fallbackTitle;
}

export type BlogSidebarListItem = {
  title: string;
  permalink: string;
  unlisted: boolean;
  date: Date | string;
};

export type ArticleSidebarCategoryGroup = {
  category: ArticleSidebarCategory;
  items: BlogSidebarListItem[];
};

function compareByTitle(
  left: BlogSidebarListItem,
  right: BlogSidebarListItem,
): number {
  return left.title.localeCompare(right.title, 'en', {sensitivity: 'base'});
}

/**
 * Group sidebar items into ordered categories with short labels.
 * Empty categories are omitted.
 */
export function groupBlogSidebarItemsByCategory(
  items: BlogSidebarListItem[],
): ArticleSidebarCategoryGroup[] {
  const buckets = new Map<ArticleSidebarCategory, BlogSidebarListItem[]>();

  for (const item of items) {
    const category = getArticleSidebarCategory(item.permalink);
    const labeledItem: BlogSidebarListItem = {
      ...item,
      title: getArticleSidebarLabel(item.permalink, item.title),
    };
    const existing = buckets.get(category);
    if (existing) {
      existing.push(labeledItem);
    } else {
      buckets.set(category, [labeledItem]);
    }
  }

  const groups: ArticleSidebarCategoryGroup[] = [];
  for (const category of ARTICLE_SIDEBAR_CATEGORIES) {
    const categoryItems = buckets.get(category);
    if (!categoryItems || categoryItems.length === 0) {
      continue;
    }
    categoryItems.sort(compareByTitle);
    groups.push({category, items: categoryItems});
  }
  return groups;
}

export function categoryContainsPermalink(
  group: ArticleSidebarCategoryGroup,
  pathname: string,
): boolean {
  const normalizedPath = pathname.replace(/\/+$/, '');
  return group.items.some((item) => {
    const itemPath = item.permalink.replace(/\/+$/, '');
    return (
      normalizedPath === itemPath || normalizedPath.endsWith(itemPath)
    );
  });
}
