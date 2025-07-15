'use client';

import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  ShieldExclamationIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import type React from 'react';

interface ErrorPageProps {
  errorCode?: string;
  title?: string;
  message?: string;
  details?: string;
  showRefresh?: boolean;
  onRefresh?: () => void;
  onGoHome?: () => void;
  onGoBack?: () => void;
  onContactSupport?: () => void;
  className?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  errorCode = '500',
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again later.',
  details,
  showRefresh = true,
  onRefresh,
  onGoHome,
  onGoBack,
  onContactSupport,
  className = '',
}) => {
  // Get error icon based on code
  const getErrorIcon = (code: string) => {
    switch (code) {
      case '404':
        return (
          <ExclamationTriangleIcon className="h-16 w-16 text-yellow-400" />
        );
      case '500':
        return <ExclamationCircleIcon className="h-16 w-16 text-red-400" />;
      case '503':
        return <WrenchScrewdriverIcon className="h-16 w-16 text-orange-400" />;
      case '403':
        return <ShieldExclamationIcon className="h-16 w-16 text-purple-400" />;
      default:
        return <ExclamationCircleIcon className="h-16 w-16 text-red-400" />;
    }
  };

  // Get error color based on code
  const getErrorColor = (code: string) => {
    switch (code) {
      case '404':
        return 'from-yellow-400 to-orange-400';
      case '500':
        return 'from-red-400 to-pink-400';
      case '503':
        return 'from-orange-400 to-red-400';
      case '403':
        return 'from-purple-400 to-pink-400';
      default:
        return 'from-red-400 to-pink-400';
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div
      className={`relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 ${className}`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(147,51,234,0.1),transparent_70%)]" />

      {/* Animated Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        className="absolute top-20 left-20 h-64 w-64 rounded-full bg-gradient-to-r from-red-500/10 to-orange-500/10 blur-3xl"
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        className="absolute right-20 bottom-20 h-48 w-48 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl"
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      />

      {/* Main Content */}
      <motion.div
        animate="visible"
        className="relative z-10 mx-auto max-w-3xl text-center"
        initial="hidden"
        variants={containerVariants}
      >
        {/* Error Code */}
        <motion.div className="mb-8" variants={itemVariants}>
          <motion.div
            animate="animate"
            className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full border border-white/10 bg-gradient-to-r from-red-500/10 to-orange-500/10"
            variants={floatingVariants}
          >
            {getErrorIcon(errorCode)}
          </motion.div>
          <motion.div
            className="mb-4 font-black text-7xl md:text-8xl"
            variants={floatingVariants}
          >
            <span
              className={`bg-gradient-to-r bg-clip-text text-transparent ${getErrorColor(errorCode)}`}
            >
              {errorCode}
            </span>
          </motion.div>
        </motion.div>

        {/* Error Message */}
        <motion.div className="mb-8 space-y-4" variants={itemVariants}>
          <h1 className="mb-4 font-bold text-3xl text-white md:text-4xl">
            {title}
          </h1>
          <p className="mx-auto max-w-2xl text-gray-300 text-lg leading-relaxed">
            {message}
          </p>
          {details && (
            <div className="mt-4 rounded-lg border border-gray-700/50 bg-gray-800/30 p-4 backdrop-blur-sm">
              <p className="text-gray-400 text-sm">{details}</p>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          variants={itemVariants}
        >
          {showRefresh && onRefresh && (
            <motion.button
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
              onClick={onRefresh}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowPathIcon className="h-5 w-5" />
              Try Again
            </motion.button>
          )}

          {onGoHome && (
            <motion.button
              className="flex items-center gap-2 rounded-lg border border-gray-700/50 bg-gray-800/50 px-6 py-3 font-semibold text-gray-300 transition-all duration-300 hover:bg-gray-700/50 hover:text-white"
              onClick={onGoHome}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <HomeIcon className="h-5 w-5" />
              Go Home
            </motion.button>
          )}

          {onGoBack && (
            <motion.button
              className="flex items-center gap-2 rounded-lg border border-gray-700/50 bg-gray-800/50 px-6 py-3 font-semibold text-gray-300 transition-all duration-300 hover:bg-gray-700/50 hover:text-white"
              onClick={onGoBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Go Back
            </motion.button>
          )}
        </motion.div>

        {/* Support Section */}
        {onContactSupport && (
          <motion.div
            className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-6 backdrop-blur-sm"
            variants={itemVariants}
          >
            <h3 className="mb-3 font-semibold text-white">Need Help?</h3>
            <p className="mb-4 text-gray-400 text-sm">
              If this problem persists, please contact our support team for
              assistance.
            </p>
            <motion.button
              className="mx-auto flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 px-4 py-2 font-medium text-white transition-all duration-300 hover:from-green-600 hover:to-blue-700"
              onClick={onContactSupport}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Support
              <ChevronRightIcon className="h-4 w-4" />
            </motion.button>
          </motion.div>
        )}

        {/* Floating Elements */}
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          className="-top-10 -left-10 absolute h-20 w-20 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-xl"
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          animate={{
            x: [0, -25, 0],
            y: [0, 15, 0],
            rotate: [360, 180, 0],
          }}
          className="-bottom-10 -right-10 absolute h-16 w-16 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl"
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Corner Decorations */}
      <div className="absolute top-4 left-4 h-12 w-12 rounded-tl-lg border-red-500/30 border-t-2 border-l-2" />
      <div className="absolute top-4 right-4 h-12 w-12 rounded-tr-lg border-orange-500/30 border-t-2 border-r-2" />
      <div className="absolute bottom-4 left-4 h-12 w-12 rounded-bl-lg border-purple-500/30 border-b-2 border-l-2" />
      <div className="absolute right-4 bottom-4 h-12 w-12 rounded-br-lg border-pink-500/30 border-r-2 border-b-2" />
    </div>
  );
};

export default ErrorPage;
