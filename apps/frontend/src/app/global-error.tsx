"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import ErrorPage from '@/components/ui/ErrorPage';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const GlobalError: React.FC<GlobalErrorProps> = ({ error, reset }) => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleContactSupport = () => {
    // You can implement this to open a support form or redirect to support
    window.open('mailto:support@yieldx.com?subject=Error Report&body=' + encodeURIComponent(
      `Error: ${error.message}\nDigest: ${error.digest || 'N/A'}\nStack: ${error.stack || 'N/A'}`
    ));
  };

  return (
    <ErrorPage
      errorCode="500"
      title="Server Error"
      message="An unexpected error occurred on our servers. Our team has been notified and is working to fix this issue."
      details={process.env.NODE_ENV === 'development' ? error.message : undefined}
      showRefresh={true}
      onRefresh={reset}
      onGoHome={handleGoHome}
      onGoBack={handleGoBack}
      onContactSupport={handleContactSupport}
    />
  );
};

export default GlobalError;
