import React, {memo, useState, type ReactNode, type SyntheticEvent} from 'react';
import Heading from '@theme/Heading';
import type {Props} from '@theme/BlogSidebar/Content';
import {
  groupBlogSidebarItemsByCategory,
  type ArticleSidebarCategory,
} from '@site/src/data/articleSidebarCategories';

function BlogSidebarCategoryGroup({
  category,
  yearGroupHeadingClassName,
  children,
}: {
  category: ArticleSidebarCategory;
  yearGroupHeadingClassName?: string;
  children: ReactNode;
}): ReactNode {
  const [isOpen, setIsOpen] = useState(false);

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
  const groups = groupBlogSidebarItemsByCategory(items);

  return (
    <>
      {groups.map((group) => (
        <BlogSidebarCategoryGroup
          key={group.category}
          category={group.category}
          yearGroupHeadingClassName={yearGroupHeadingClassName}>
          <ListComponent items={group.items} />
        </BlogSidebarCategoryGroup>
      ))}
    </>
  );
}

export default memo(BlogSidebarContent);
