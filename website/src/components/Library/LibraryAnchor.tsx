import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import type {LibraryLink} from '@site/src/data/playbookLibrary';

function isExternalLink(link: LibraryLink): boolean {
  return Boolean(link.external) || link.to.startsWith('http');
}

type LibraryAnchorProps = {
  link: LibraryLink;
  className?: string;
};

export default function LibraryAnchor({
  link,
  className,
}: LibraryAnchorProps): ReactNode {
  if (isExternalLink(link)) {
    return (
      <Link className={className} href={link.to}>
        {link.label}
      </Link>
    );
  }

  return (
    <Link className={className} to={link.to}>
      {link.label}
    </Link>
  );
}
