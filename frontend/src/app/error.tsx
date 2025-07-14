"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
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
    window.open('mailto:support@yieldx.com?subject=Layout Error Report&body=' + encodeURIComponent(
      `Error: ${error.message}\nDigest: ${error.digest || 'N/A'}\nStack: ${error.stack || 'N/A'}`
    ));
  };

  return (
    <ErrorPage
      errorCode="500"
      title="Layout Error"
      message="There was an error loading the page layout. Please try refreshing the page."
      details={process.env.NODE_ENV === 'development' ? error.message : undefined}
      showRefresh={true}
      onRefresh={reset}
      onGoHome={handleGoHome}
      onContactSupport={handleContactSupport}
    />
  );
};

export default LayoutError;
