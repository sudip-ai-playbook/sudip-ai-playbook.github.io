import type {ReactNode} from 'react';
import ReadingBookmark from '@site/src/components/ReadingBookmark';
import ReadingProgress from '@site/src/components/ReadingProgress';
import ReadingStickies from '@site/src/components/ReadingStickies';

type RootProps = {
  children: ReactNode;
};

export default function Root({children}: RootProps): ReactNode {
  return (
    <>
      <ReadingProgress />
      <ReadingStickies />
      <ReadingBookmark />
      {children}
    </>
  );
}
