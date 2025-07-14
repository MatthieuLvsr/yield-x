import React from 'react';
import LoadingPage from '@/components/ui/LoadingPage';

const Loading: React.FC = () => {
  return (
    <LoadingPage
      title="Loading Yield-X"
      message="Preparing your decentralized yield farming experience..."
    />
  );
};

export default Loading;
