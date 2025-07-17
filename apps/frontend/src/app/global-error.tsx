'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
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
    window.open(
      'mailto:support@yieldx.com?subject=Error Report&body=' +
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
      message="An unexpected error occurred on our servers. Our team has been notified and is working to fix this issue."
      onContactSupport={handleContactSupport}
      onGoBack={handleGoBack}
      onGoHome={handleGoHome}
      onRefresh={reset}
      showRefresh={true}
      title="Server Error"
    />
  );
};

export default GlobalError;
