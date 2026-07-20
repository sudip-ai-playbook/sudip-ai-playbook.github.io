import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {
  ARTICLE_SIDEBAR_CATEGORIES,
  categoryContainsPermalink,
  getArticleSidebarCategory,
  getArticleSidebarLabel,
  groupBlogSidebarItemsByCategory,
} from './articleSidebarCategories.ts';

describe('articleSidebarCategories', () => {
  it('maps known business and roadmap slugs to categories', () => {
    assert.equal(
      getArticleSidebarCategory('/blog/articles/business-hiring-and-team-building'),
      'Business',
    );
    assert.equal(
      getArticleSidebarCategory('/blog/articles/ai-engineer-roadmap/'),
      'Roadmaps',
    );
    assert.equal(
      getArticleSidebarCategory(
        '/blog/articles/leadership-engage-business-service-line-leaders',
      ),
      'Consulting',
    );
    assert.equal(
      getArticleSidebarCategory(
        '/blog/articles/leadership-set-direction-and-priorities',
      ),
      'Consulting',
    );
    assert.equal(
      getArticleSidebarCategory(
        '/blog/articles/leadership-shape-major-market-opportunities',
      ),
      'Consulting',
    );
    assert.equal(
      getArticleSidebarCategory(
        '/blog/articles/leadership-organisation-wide-transformation',
      ),
      'Consulting',
    );
    assert.equal(
      getArticleSidebarCategory(
        '/blog/articles/leadership-protect-quality-independence-and-trust',
      ),
      'Consulting',
    );
    assert.equal(
      getArticleSidebarCategory(
        '/blog/articles/leadership-develop-people-and-organisational-capability',
      ),
      'Consulting',
    );
    assert.equal(
      getArticleSidebarCategory(
        '/blog/articles/leadership-create-an-exceptional-culture',
      ),
      'Consulting',
    );
    assert.equal(
      getArticleSidebarCategory(
        '/blog/articles/leadership-build-future-capability',
      ),
      'Consulting',
    );
    assert.equal(
      getArticleSidebarCategory(
        '/blog/articles/leadership-exceptional-professional-services',
      ),
      'Consulting',
    );
    assert.equal(
      getArticleSidebarCategory(
        '/blog/articles/leadership-represent-the-firm-externally',
      ),
      'Consulting',
    );
    assert.equal(
      getArticleSidebarCategory(
        '/blog/articles/regional-data-ai-centre-of-excellence',
      ),
      'Consulting',
    );
    assert.equal(
      getArticleSidebarCategory('/blog/articles/eu-ai-act-regulation-2024-1689'),
      'Governance',
    );
    assert.equal(
      getArticleSidebarCategory('/blog/articles/owasp-llm-top-10-governance'),
      'Governance',
    );
    assert.equal(
      getArticleSidebarCategory('/blog/articles/unknown-future-post'),
      'More',
    );
  });

  it('returns short labels when configured', () => {
    assert.equal(
      getArticleSidebarLabel(
        '/blog/articles/business-hiring-and-team-building',
        'Business: Hiring and Team Building',
      ),
      'Hiring and team building',
    );
    assert.equal(
      getArticleSidebarLabel(
        '/blog/articles/eu-ai-act-regulation-2024-1689',
        'EU AI Act Application Playbook: Classify, Control and Evidence Regulation 2024/1689',
      ),
      'EU AI Act application playbook',
    );
    assert.equal(
      getArticleSidebarLabel(
        '/blog/articles/owasp-llm-top-10-governance',
        'AI Governance in Practice: Applying the OWASP Top 10 for LLM Applications 2025',
      ),
      'OWASP LLM Top 10',
    );
    assert.equal(
      getArticleSidebarLabel(
        '/blog/articles/leadership-represent-the-firm-externally',
        'Leadership: Represent the Firm Externally',
      ),
      'Represent the firm externally',
    );
    assert.equal(
      getArticleSidebarLabel(
        '/blog/articles/leadership-build-future-capability',
        'Leadership: Build Future Capability Before It Is Urgently Needed',
      ),
      'Build future capability',
    );
    assert.equal(
      getArticleSidebarLabel(
        '/blog/articles/leadership-exceptional-professional-services',
        'Exceptional Leadership: Building a Resilient, Commercially Strong and Future-Ready Professional-Services Firm',
      ),
      'Exceptional firm leadership',
    );
    assert.equal(
      getArticleSidebarLabel(
        '/blog/articles/leadership-protect-quality-independence-and-trust',
        'Leadership: Protect Quality, Independence and Trust',
      ),
      'Quality, independence and trust',
    );
    assert.equal(
      getArticleSidebarLabel(
        '/blog/articles/leadership-shape-major-market-opportunities',
        'Leadership: How to Shape Major Market Opportunities',
      ),
      'Shape market opportunities',
    );
  });

  it('groups items by category order and sorts labels', () => {
    const groups = groupBlogSidebarItemsByCategory([
      {
        title: 'Business: Perfect Pitch',
        permalink: '/blog/articles/business-perfect-pitch',
        unlisted: false,
        date: '2026-07-19',
      },
      {
        title: 'Welcome',
        permalink: '/blog/articles/welcome-to-the-ai-playbook-blog',
        unlisted: false,
        date: '2026-07-17',
      },
      {
        title: 'The Complete AI Engineer Roadmap',
        permalink: '/blog/articles/ai-engineer-roadmap',
        unlisted: false,
        date: '2026-07-18',
      },
      {
        title: 'Business: Hiring and Team Building',
        permalink: '/blog/articles/business-hiring-and-team-building',
        unlisted: false,
        date: '2026-07-19',
      },
    ]);

    assert.deepEqual(
      groups.map((group) => group.category),
      ['Getting started', 'Business', 'Roadmaps'],
    );
    assert.deepEqual(
      groups[1]?.items.map((item) => item.title),
      ['Hiring and team building', 'Perfect pitch'],
    );
    assert.ok(
      ARTICLE_SIDEBAR_CATEGORIES.indexOf('Getting started') <
        ARTICLE_SIDEBAR_CATEGORIES.indexOf('Business'),
    );
  });

  it('detects whether a category contains the active path', () => {
    const group = {
      category: 'Business' as const,
      items: [
        {
          title: 'Hiring and team building',
          permalink: '/blog/articles/business-hiring-and-team-building',
          unlisted: false,
          date: '2026-07-19',
        },
      ],
    };
    assert.equal(
      categoryContainsPermalink(
        group,
        '/blog/articles/business-hiring-and-team-building/',
      ),
      true,
    );
    assert.equal(
      categoryContainsPermalink(group, '/blog/articles/ai-engineer-roadmap'),
      false,
    );
  });
});
