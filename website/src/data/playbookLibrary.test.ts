import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {
  CATALOG_PAGE_PATH,
  EXPECTED_CONTENT_PATHS,
  LIBRARY_GOALS,
  LIBRARY_SECTIONS,
  countLibraryLinks,
  findUnlinkedExpectedPaths,
  getLibrarySectionById,
  listInternalLibraryPaths,
  listLibrarySectionIds,
} from './playbookLibrary.ts';

describe('playbookLibrary', () => {
  it('exposes three progressive goals with short paths only', () => {
    assert.equal(LIBRARY_GOALS.length, 3);
    assert.deepEqual(
      LIBRARY_GOALS.map((goal) => goal.id),
      ['learn', 'deliver', 'grow'],
    );
    for (const goal of LIBRARY_GOALS) {
      assert.ok(
        goal.steps.length >= 5 && goal.steps.length <= 8,
        `${goal.id} should have 5–8 steps, got ${goal.steps.length}`,
      );
      for (const step of goal.steps) {
        assert.ok(step.label.trim().length > 0);
        assert.ok(step.to.trim().length > 0);
      }
    }
    assert.equal(CATALOG_PAGE_PATH, '/catalog');
  });

  it('exposes seven catalog sections as a full tree', () => {
    assert.deepEqual(listLibrarySectionIds(), [
      'learning-map',
      'guide',
      'frameworks',
      'roadmaps',
      'startup',
      'articles',
      'tools',
    ]);
  });

  it('gives every section a tree of branches with links', () => {
    for (const section of LIBRARY_SECTIONS) {
      assert.ok(section.overview.to.length > 0, `${section.id} needs overview`);
      assert.ok(section.branches.length > 0, `${section.id} needs branches`);
      for (const branch of section.branches) {
        assert.ok(branch.id.length > 0, `${section.id} branch missing id`);
        assert.ok(branch.title.length > 0, `${section.id} branch missing title`);
        assert.ok(
          branch.links.length > 0,
          `${section.id}/${branch.id} needs links`,
        );
        for (const link of branch.links) {
          assert.ok(link.label.trim().length > 0);
          assert.ok(link.to.trim().length > 0);
        }
      }
    }
  });

  it('looks up sections by id and counts catalog links', () => {
    const guide = getLibrarySectionById('guide');
    assert.ok(guide);
    assert.equal(guide.title, 'Guide');
    assert.equal(getLibrarySectionById('missing'), undefined);
    assert.ok(countLibraryLinks() > 150);
  });

  it('links every expected published content path in the full catalog', () => {
    assert.ok(EXPECTED_CONTENT_PATHS.length >= 190);
    assert.deepEqual(findUnlinkedExpectedPaths(), []);
  });

  it('includes all article paths under the articles section', () => {
    const articles = getLibrarySectionById('articles');
    assert.ok(articles);
    const articlePaths = new Set(
      articles.branches.flatMap((branch) =>
        branch.links.map((link) => link.to.replace(/\/+$/, '')),
      ),
    );
    const expectedArticles = EXPECTED_CONTENT_PATHS.filter((path) =>
      path.startsWith('/articles/'),
    );
    assert.equal(expectedArticles.length, 59);
    for (const path of expectedArticles) {
      assert.ok(articlePaths.has(path), `missing article in tree: ${path}`);
    }
  });

  it('exposes sorted internal paths for navigation checks', () => {
    const paths = listInternalLibraryPaths();
    assert.ok(paths.includes('/learning-map/01-business-fundamentals'));
    assert.ok(paths.includes('/articles/what-is-ai-solution-engineering'));
    assert.ok(paths.includes('/notes'));
    assert.deepEqual(paths, [...paths].sort());
  });
});
