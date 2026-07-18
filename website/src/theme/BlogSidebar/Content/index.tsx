import React, {
  memo,
  useEffect,
  useState,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import {useLocation} from '@docusaurus/router';
import Heading from '@theme/Heading';
import type {Props} from '@theme/BlogSidebar/Content';
import {
  categoryContainsPermalink,
  groupBlogSidebarItemsByCategory,
  type ArticleSidebarCategory,
} from '@site/src/data/articleSidebarCategories';

function BlogSidebarCategoryGroup({
  category,
  shouldOpen,
  yearGroupHeadingClassName,
  children,
}: {
  category: ArticleSidebarCategory;
  shouldOpen: boolean;
  yearGroupHeadingClassName?: string;
  children: ReactNode;
}): ReactNode {
  const [isOpen, setIsOpen] = useState(shouldOpen);

  useEffect(() => {
    if (shouldOpen) {
      setIsOpen(true);
    }
  }, [shouldOpen]);

  function handleToggle(event: SyntheticEvent<HTMLDetailsElement>): void {
    setIsOpen(event.currentTarget.open);
  }

  return (
    <details
      className="blog-sidebar-category"
      open={isOpen}
      onToggle={handleToggle}>
      <summary className="blog-sidebar-category__summary">
        <Heading as="h3" className={yearGroupHeadingClassName}>
          {category}
        </Heading>
      </summary>
      <div className="blog-sidebar-category__body" role="group">
        {children}
      </div>
    </details>
  );
}

function BlogSidebarContent({
  items,
  yearGroupHeadingClassName,
  ListComponent,
}: Props): ReactNode {
  const {pathname} = useLocation();
  const groups = groupBlogSidebarItemsByCategory(items);
  const hasActiveCategory = groups.some((group) =>
    categoryContainsPermalink(group, pathname),
  );

  return (
    <>
      {groups.map((group) => {
        const containsActive = categoryContainsPermalink(group, pathname);
        // On the articles index, expand every section for browsing.
        const shouldOpen = hasActiveCategory ? containsActive : true;
        return (
          <BlogSidebarCategoryGroup
            key={group.category}
            category={group.category}
            shouldOpen={shouldOpen}
            yearGroupHeadingClassName={yearGroupHeadingClassName}>
            <ListComponent items={group.items} />
          </BlogSidebarCategoryGroup>
        );
      })}
    </>
  );
}

export default memo(BlogSidebarContent);
