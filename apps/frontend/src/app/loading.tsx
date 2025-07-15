import type React from 'react';
import LoadingPage from '@/components/ui/LoadingPage';

const Loading: React.FC = () => {
  return (
    <LoadingPage
      message="Preparing your decentralized yield farming experience..."
      title="Loading Yield-X"
    />
  );
};

export default Loading;
