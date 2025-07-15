'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import ErrorPage from '@/components/ui/ErrorPage';

interface LayoutErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const LayoutError: React.FC<LayoutErrorProps> = ({ error, reset }) => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleContactSupport = () => {
    window.open(
      'mailto:support@yieldx.com?subject=Layout Error Report&body=' +
        encodeURIComponent(
          `Error: ${error.message}\nDigest: ${error.digest || 'N/A'}\nStack: ${error.stack || 'N/A'}`
        )
    );
  };

  return (
    <ErrorPage
      details={
        process.env.NODE_ENV === 'development' ? error.message : undefined
      }
      errorCode="500"
      message="There was an error loading the page layout. Please try refreshing the page."
      onContactSupport={handleContactSupport}
      onGoHome={handleGoHome}
      onRefresh={reset}
      showRefresh={true}
      title="Layout Error"
    />
  );
};

export default LayoutError;
