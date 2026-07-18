import type {ReactNode} from 'react';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import BlogPostItemFooter from '@theme-original/BlogPostItem/Footer';
import SupportCta from '@site/src/components/SupportCta';

export default function BlogPostItemFooterWrapper(): ReactNode {
  const {isBlogPostPage} = useBlogPost();

  return (
    <>
      <BlogPostItemFooter />
      {isBlogPostPage ? (
        <SupportCta variant="compact" headingId="support-article" />
      ) : null}
    </>
  );
}
