import type {ReactNode} from 'react';
import ReadingBookmark from '@site/src/components/ReadingBookmark';
import ReadingProgress from '@site/src/components/ReadingProgress';

type RootProps = {
  children: ReactNode;
};

export default function Root({children}: RootProps): ReactNode {
  return (
    <>
      <ReadingProgress />
      <ReadingBookmark />
      {children}
    </>
  );
}
