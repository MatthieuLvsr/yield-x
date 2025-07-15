"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  ArrowLeftIcon, 
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  ShieldExclamationIcon,
  WrenchScrewdriverIcon,
  ArrowPathIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

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
  errorCode = "500",
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again later.",
  details,
  showRefresh = true,
  onRefresh,
  onGoHome,
  onGoBack,
  onContactSupport,
  className = ""
}) => {
  // Get error icon based on code
  const getErrorIcon = (code: string) => {
    switch (code) {
      case "404":
        return <ExclamationTriangleIcon className="w-16 h-16 text-yellow-400" />;
      case "500":
        return <ExclamationCircleIcon className="w-16 h-16 text-red-400" />;
      case "503":
        return <WrenchScrewdriverIcon className="w-16 h-16 text-orange-400" />;
      case "403":
        return <ShieldExclamationIcon className="w-16 h-16 text-purple-400" />;
      default:
        return <ExclamationCircleIcon className="w-16 h-16 text-red-400" />;
    }
  };

  // Get error color based on code
  const getErrorColor = (code: string) => {
    switch (code) {
      case "404":
        return "from-yellow-400 to-orange-400";
      case "500":
        return "from-red-400 to-pink-400";
      case "503":
        return "from-orange-400 to-red-400";
      case "403":
        return "from-purple-400 to-pink-400";
      default:
        return "from-red-400 to-pink-400";
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 relative overflow-hidden ${className}`}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(147,51,234,0.1),transparent_70%)]" />
      
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 rounded-full bg-gradient-to-r from-red-500/10 to-orange-500/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main Content */}
      <motion.div
        className="relative z-10 max-w-3xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Error Code */}
        <motion.div
          className="mb-8"
          variants={itemVariants}
        >
          <motion.div
            className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-500/10 to-orange-500/10 flex items-center justify-center border border-white/10"
            variants={floatingVariants}
            animate="animate"
          >
            {getErrorIcon(errorCode)}
          </motion.div>
          <motion.div
            className="text-7xl md:text-8xl font-black mb-4"
            variants={floatingVariants}
          >
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${getErrorColor(errorCode)}`}>
              {errorCode}
            </span>
          </motion.div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          className="mb-8 space-y-4"
          variants={itemVariants}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {title}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {message}
          </p>
          {details && (
            <div className="mt-4 p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg backdrop-blur-sm">
              <p className="text-gray-400 text-sm">{details}</p>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          variants={itemVariants}
        >
          {showRefresh && onRefresh && (
            <motion.button
              onClick={onRefresh}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowPathIcon className="w-5 h-5" />
              Try Again
            </motion.button>
          )}

          {onGoHome && (
            <motion.button
              onClick={onGoHome}
              className="flex items-center gap-2 px-6 py-3 bg-gray-800/50 border border-gray-700/50 text-gray-300 font-semibold rounded-lg hover:bg-gray-700/50 hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <HomeIcon className="w-5 h-5" />
              Go Home
            </motion.button>
          )}

          {onGoBack && (
            <motion.button
              onClick={onGoBack}
              className="flex items-center gap-2 px-6 py-3 bg-gray-800/50 border border-gray-700/50 text-gray-300 font-semibold rounded-lg hover:bg-gray-700/50 hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Go Back
            </motion.button>
          )}
        </motion.div>

        {/* Support Section */}
        {onContactSupport && (
          <motion.div
            className="p-6 bg-gray-800/30 border border-gray-700/50 rounded-xl backdrop-blur-sm"
            variants={itemVariants}
          >
            <h3 className="text-white font-semibold mb-3">Need Help?</h3>
            <p className="text-gray-400 text-sm mb-4">
              If this problem persists, please contact our support team for assistance.
            </p>
            <motion.button
              onClick={onContactSupport}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Support
              <ChevronRightIcon className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}

        {/* Floating Elements */}
        <motion.div
          className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-10 -right-10 w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl"
          animate={{
            x: [0, -25, 0],
            y: [0, 15, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Corner Decorations */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-red-500/30 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-orange-500/30 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-purple-500/30 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-pink-500/30 rounded-br-lg" />
    </div>
  );
};

export default ErrorPage;
