import type {ReactNode} from 'react';
import ReadingProgress from '@site/src/components/ReadingProgress';

type RootProps = {
  children: ReactNode;
};

export default function Root({children}: RootProps): ReactNode {
  return (
    <>
      <ReadingProgress />
      {children}
    </>
  );
}
